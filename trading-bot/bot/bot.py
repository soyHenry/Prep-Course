"""Bucle principal. Uso:
    python -m bot.bot          # corre 24 h, revisa cada minuto
    python -m bot.bot --once   # una sola revisión (para cron / programador de tareas)
"""
import argparse
import csv
import json
import logging
import time
from datetime import datetime, timezone

from . import exchange, risk, strategy
from .config import DATA_DIR, Config, load_config

log = logging.getLogger("bot")


def state_path(cfg: Config):
    return DATA_DIR / f"state_{cfg.mode}.json"


def trades_path(cfg: Config):
    return DATA_DIR / f"trades_{cfg.mode}.csv"


def load_state(cfg: Config) -> dict:
    path = state_path(cfg)
    if path.exists():
        return json.loads(path.read_text())
    return {"cash": cfg.capital, "start_capital": cfg.capital, "position": None,
            "halted": False, "last_candle": None,
            "started_at": datetime.now(timezone.utc).isoformat()}


def save_state(cfg: Config, state: dict) -> None:
    DATA_DIR.mkdir(exist_ok=True)
    tmp = state_path(cfg).with_suffix(".tmp")
    tmp.write_text(json.dumps(state, indent=2))
    tmp.replace(state_path(cfg))


def record_trade(cfg: Config, row: dict) -> None:
    DATA_DIR.mkdir(exist_ok=True)
    path = trades_path(cfg)
    new = not path.exists()
    with path.open("a", newline="") as f:
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
    record_trade(cfg, {
        "time": datetime.now(timezone.utc).isoformat(timespec="seconds"), "side": "SELL",
        "reason": reason, "price": round(fill.price, 2), "qty": pos["qty"],
        "usdt": round(fill.quote, 2), "pnl": round(pnl, 2), "cash": round(state["cash"], 2),
    })
    log.info("VENTA (%s) a %.2f | resultado %+.2f USDT | efectivo %.2f", reason, fill.price, pnl, state["cash"])


def open_position(cfg, state, broker, quote: float, stop: float) -> None:
    fill = broker.buy(quote)
    state["cash"] -= fill.quote
    state["position"] = {"qty": fill.qty, "entry": fill.price, "cost": fill.quote,
                         "stop": stop, "highest": fill.price,
                         "opened_at": datetime.now(timezone.utc).isoformat(timespec="seconds")}
    record_trade(cfg, {
        "time": datetime.now(timezone.utc).isoformat(timespec="seconds"), "side": "BUY",
        "reason": "cruce EMA", "price": round(fill.price, 2), "qty": fill.qty,
        "usdt": round(fill.quote, 2), "pnl": "", "cash": round(state["cash"], 2),
    })
    log.info("COMPRA %.2f USDT a %.2f | stop %.2f", fill.quote, fill.price, stop)


def step(cfg: Config, state: dict, broker) -> None:
    """Una revisión completa: precios, frenos de riesgo, stops y señales."""
    if state.get("halted"):
        log.warning("Bot DETENIDO por caída máxima. Revisá y borrá 'halted' del estado para reanudar.")
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


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--once", action="store_true", help="hace una sola revisión y termina")
    args = parser.parse_args()

    cfg = load_config()
    DATA_DIR.mkdir(exist_ok=True)
    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s",
        handlers=[logging.StreamHandler(), logging.FileHandler(DATA_DIR / f"bot_{cfg.mode}.log")],
    )
    log.info("Arrancando en modo %s | %s %s | capital %.2f USDT", cfg.mode.upper(), cfg.symbol, cfg.interval, cfg.capital)
    broker = make_broker(cfg)
    state = load_state(cfg)

    errors = 0
    while True:
        try:
            step(cfg, state, broker)
            save_state(cfg, state)
            errors = 0
        except Exception as e:  # red caída, Binance en mantenimiento, etc.: espera y reintenta
            errors += 1
            log.exception("Error (%d seguidos): %s", errors, e)
        if args.once:
            break
        time.sleep(min(cfg.poll_seconds * (2 ** min(errors, 4)), 900))


if __name__ == "__main__":
    main()
