"""Bucle principal. Uso:
    python -m bot.bot          # corre 24 h, revisa cada minuto
    python -m bot.bot --once   # una sola revisión (para cron / programador de tareas)
"""
import argparse
import csv
import json
import logging
import socket
import time
from datetime import datetime, timezone

from . import exchange, notify, risk, strategy
from .config import DATA_DIR, Config, load_config

log = logging.getLogger("bot")


def state_path(cfg: Config):
    return DATA_DIR / f"state_{cfg.mode}.json"


def trades_path(cfg: Config):
    return DATA_DIR / f"trades_{cfg.mode}.csv"


def load_state(cfg: Config) -> dict:
    path = state_path(cfg)
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return {"cash": cfg.capital, "start_capital": cfg.capital, "position": None,
            "halted": False, "last_candle": None,
            "started_at": datetime.now(timezone.utc).isoformat()}


def save_state(cfg: Config, state: dict) -> None:
    DATA_DIR.mkdir(exist_ok=True)
    tmp = state_path(cfg).with_suffix(".tmp")
    tmp.write_text(json.dumps(state, indent=2), encoding="utf-8")
    tmp.replace(state_path(cfg))


def record_trade(cfg: Config, row: dict) -> None:
    DATA_DIR.mkdir(exist_ok=True)
    path = trades_path(cfg)
    new = not path.exists()
    with path.open("a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(row))
        if new:
            w.writeheader()
        w.writerow(row)


def make_broker(cfg: Config):
    if cfg.mode == "paper":
        return exchange.PaperBroker(cfg.symbol)
    url = exchange.TESTNET_URL if cfg.mode == "testnet" else exchange.LIVE_URL
    return exchange.BinanceBroker(cfg.symbol, cfg.api_key, cfg.api_secret, url)


def close_position(cfg, state, broker, reason: str) -> None:
    pos = state["position"]
    fill = broker.sell(pos["qty"])
    pnl = fill.quote - pos["cost"]
    state["cash"] += fill.quote
    state["position"] = None
    save_state(cfg, state)  # se guarda ya: si la PC se apaga, no se pierde la operación
    record_trade(cfg, {
        "time": datetime.now(timezone.utc).isoformat(timespec="seconds"), "side": "SELL",
        "reason": reason, "price": round(fill.price, 2), "qty": pos["qty"],
        "usdt": round(fill.quote, 2), "pnl": round(pnl, 2), "cash": round(state["cash"], 2),
    })
    log.info("VENTA (%s) a %.2f | resultado %+.2f USDT | efectivo %.2f", reason, fill.price, pnl, state["cash"])
    notify.send(f"{'🟢' if pnl > 0 else '🔴'} [{cfg.mode}] VENTA {cfg.symbol} ({reason})\n"
                f"Precio: {fill.price:,.2f}\nResultado: {pnl:+.2f} USDT\nCapital: {state['cash']:.2f} USDT")


def open_position(cfg, state, broker, quote: float, stop: float) -> None:
    fill = broker.buy(quote)
    state["cash"] -= fill.quote
    state["position"] = {"qty": fill.qty, "entry": fill.price, "cost": fill.quote,
                         "stop": stop, "highest": fill.price,
                         "opened_at": datetime.now(timezone.utc).isoformat(timespec="seconds")}
    save_state(cfg, state)
    record_trade(cfg, {
        "time": datetime.now(timezone.utc).isoformat(timespec="seconds"), "side": "BUY",
        "reason": "cruce EMA", "price": round(fill.price, 2), "qty": fill.qty,
        "usdt": round(fill.quote, 2), "pnl": "", "cash": round(state["cash"], 2),
    })
    log.info("COMPRA %.2f USDT a %.2f | stop %.2f", fill.quote, fill.price, stop)
    notify.send(f"🛒 [{cfg.mode}] COMPRA {cfg.symbol}\nMonto: {fill.quote:.2f} USDT a {fill.price:,.2f}\n"
                f"Stop-loss: {stop:,.2f} (pérdida máx. ~{fill.quote * (1 - stop / fill.price):.2f} USDT)")


def step(cfg: Config, state: dict, broker) -> None:
    """Una revisión completa: precios, frenos de riesgo, stops y señales."""
    if state.get("halted"):
        log.warning("Bot DETENIDO por caída máxima. Para reanudar: python -m bot.bot --reanudar")
        return

    sp, rp = cfg.strategy, cfg.risk
    price = exchange.last_price(cfg.symbol)
    state.setdefault("start_price", price)
    pos = state["position"]
    equity = state["cash"] + (pos["qty"] * price if pos else 0)
    state["last_equity"] = round(equity, 2)
    risk.roll_day(state, equity, datetime.now(timezone.utc).strftime("%Y-%m-%d"))

    if risk.drawdown_hit(state, equity, rp):
        if pos:
            close_position(cfg, state, broker, "freno caída máxima")
        state["halted"] = True
        log.error("Caída máxima alcanzada (%.0f%%). Bot detenido.", rp.max_drawdown * 100)
        notify.send(f"🛑 [{cfg.mode}] Bot DETENIDO: el capital cayó {rp.max_drawdown:.0%} desde su máximo. Requiere revisión.")
        return

    # 1) Stop-loss: se revisa en cada vuelta (cada minuto), no solo al cerrar la vela.
    if pos and price <= pos["stop"]:
        close_position(cfg, state, broker, "stop-loss")
        return

    # 2) Señales: solo cuando cierra una vela nueva.
    df = exchange.fetch_closed_klines(cfg.symbol, cfg.interval, limit=500)
    if df.empty:
        return
    candle = int(df["close_time"].iloc[-1])
    if candle == state.get("last_candle"):
        return
    state["last_candle"] = candle
    df = strategy.add_indicators(df, sp)
    i = len(df) - 1
    atr_now = float(df["atr"].iloc[i])

    if pos:
        if strategy.exit_signal(df, i):
            close_position(cfg, state, broker, "cruce EMA a la baja")
            return
        pos["highest"] = max(pos["highest"], float(df["high"].iloc[i]))
        pos["stop"] = strategy.trailing_stop(pos["stop"], pos["highest"], atr_now, sp)
        log.info("En posición | precio %.2f | stop %.2f | capital %.2f", price, pos["stop"], equity)
        return

    if risk.daily_limit_hit(state, equity, rp):
        log.info("Límite de pérdida diaria alcanzado: sin operaciones nuevas hasta mañana (UTC).")
        return
    if strategy.entry_signal(df, i, sp):
        stop = strategy.initial_stop(price, atr_now, sp)
        quote = risk.position_size(equity, state["cash"], price, stop, rp)
        if quote > 0:
            open_position(cfg, state, broker, quote, stop)
    else:
        log.info("Sin señal | precio %.2f | capital %.2f", price, equity)


def maybe_daily_summary(cfg: Config, state: dict) -> None:
    """Un resumen por día a la hora local DAILY_REPORT_HOUR (por defecto 13 h)."""
    now = datetime.now()
    today = now.strftime("%Y-%m-%d")
    if now.hour < cfg.daily_report_hour or state.get("last_summary") == today:
        return
    state["last_summary"] = today
    notify.send("📊 Resumen diario\n" + summary_text(cfg, state, exchange.last_price(cfg.symbol)))


def summary_text(cfg: Config, state: dict, price: float) -> str:
    pos = state.get("position")
    equity = state["cash"] + (pos["qty"] * price if pos else 0)
    start = state["start_capital"]
    lines = [f"Modo: {cfg.mode} | desde {state.get('started_at', '?')[:10]}",
             f"Capital: {equity:.2f} USDT ({100 * (equity / start - 1):+.2f}%)"]
    if state.get("start_price"):
        lines.append(f"Comprar y guardar BTC: {100 * (price / state['start_price'] - 1):+.2f}%")
    lines.append(f"Posición abierta: entrada {pos['entry']:,.2f}, stop {pos['stop']:,.2f}" if pos else "Posición abierta: no")
    path = trades_path(cfg)
    if path.exists():
        with path.open(encoding="utf-8") as f:
            pnls = [float(r["pnl"]) for r in csv.DictReader(f) if r["side"] == "SELL"]
        if pnls:
            wins = sum(p > 0 for p in pnls)
            lines.append(f"Operaciones cerradas: {len(pnls)} | ganadoras: {wins} ({100 * wins / len(pnls):.0f}%)"
                         f" | total: {sum(pnls):+.2f} USDT")
    if state.get("halted"):
        lines.append("ATENCIÓN: bot detenido por caída máxima.")
    return "\n".join(lines)


def single_instance_lock(port: int = 47321) -> socket.socket:
    """Evita que corran dos bots a la vez (operarían por duplicado). Se libera solo al cerrar."""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        sock.bind(("127.0.0.1", port))
    except OSError:
        raise SystemExit("Ya hay un bot corriendo en esta PC. Cierre la otra ventana antes de abrir uno nuevo.")
    return sock


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--once", action="store_true", help="hace una sola revisión y termina")
    parser.add_argument("--reanudar", action="store_true", help="reactiva el bot tras el freno de caída máxima")
    args = parser.parse_args()

    cfg = load_config()
    lock = single_instance_lock()  # noqa: F841 (se mantiene abierto mientras corre)
    DATA_DIR.mkdir(exist_ok=True)
    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s",
        handlers=[logging.StreamHandler(),
                  logging.FileHandler(DATA_DIR / f"bot_{cfg.mode}.log", encoding="utf-8")],
    )
    if args.reanudar:
        state = load_state(cfg)
        state["halted"] = False
        state.pop("peak_equity", None)  # el máximo se vuelve a medir desde el capital actual
        save_state(cfg, state)
        print("Bot reactivado. Ahora arránquelo normalmente con iniciar_bot.bat")
        return
    log.info("Arrancando en modo %s | %s %s | capital %.2f USDT", cfg.mode.upper(), cfg.symbol, cfg.interval, cfg.capital)
    broker = make_broker(cfg)
    state = load_state(cfg)

    if not args.once:
        notify.send(f"▶️ Bot de trading encendido [{cfg.mode}] | {cfg.symbol} | capital {state['cash']:.2f} USDT")
    errors = 0
    while True:
        try:
            step(cfg, state, broker)
            maybe_daily_summary(cfg, state)
            save_state(cfg, state)
            if errors >= 5:
                notify.send("✅ El bot recuperó la conexión.")
            errors = 0
        except Exception as e:  # red caída, Binance en mantenimiento, etc.: espera y reintenta
            errors += 1
            log.exception("Error (%d seguidos): %s", errors, e)
            if errors == 5:
                notify.send(f"⚠️ El bot tiene problemas para conectarse (5 intentos fallidos): {e}")
        if args.once:
            break
        time.sleep(min(cfg.poll_seconds * (2 ** min(errors, 4)), 900))


if __name__ == "__main__":
    main()
