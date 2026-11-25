"""Prueba la estrategia sobre datos históricos con las mismas reglas que el bot.

    python -m bot.backtest --days 365
    python -m bot.backtest --csv mis_velas.csv
"""
import argparse
from datetime import datetime, timezone

import pandas as pd

from . import risk, strategy
from .exchange import PAPER_FEE, PAPER_SLIPPAGE, fetch_history
from .risk import RiskParams
from .strategy import StrategyParams


def run_backtest(df: pd.DataFrame, sp: StrategyParams = StrategyParams(), rp: RiskParams = RiskParams(),
                 capital: float = 100.0, fee: float = PAPER_FEE, slippage: float = PAPER_SLIPPAGE) -> dict:
    df = strategy.add_indicators(df, sp).reset_index(drop=True)
    state: dict = {}
    cash, pos, trades, curve, halted = capital, None, [], [], False

    def sell(price: float, i: int, reason: str):
        nonlocal cash, pos
        px = price * (1 - slippage)
        proceeds = pos["qty"] * px * (1 - fee)
        cash += proceeds
        trades.append({"i": i, "entry": pos["entry"], "exit": px, "pnl": proceeds - pos["cost"], "reason": reason})
        pos = None

    for i in range(1, len(df)):
        row = df.iloc[i]
        day = datetime.fromtimestamp(row["open_time"] / 1000, timezone.utc).strftime("%Y-%m-%d")
        equity_open = cash + (pos["qty"] * row["open"] if pos else 0)
        risk.roll_day(state, equity_open, day)

        stopped = bool(pos and row["low"] <= pos["stop"])
        if stopped:
            sell(min(row["open"], pos["stop"]), i, "stop")
        if stopped:
            pass  # no reabre en la misma vela en la que saltó el stop
        elif pos and strategy.exit_signal(df, i):
            sell(row["close"], i, "señal")
        elif pos:
            pos["highest"] = max(pos["highest"], row["high"])
            pos["stop"] = strategy.trailing_stop(pos["stop"], pos["highest"], row["atr"], sp)
        elif not halted and strategy.entry_signal(df, i, sp):
            equity = cash
            if not risk.daily_limit_hit(state, equity, rp):
                px = row["close"] * (1 + slippage)
                stop = strategy.initial_stop(px, row["atr"], sp)
                quote = risk.position_size(equity, cash, px, stop, rp)
                if quote > 0:
                    cash -= quote
                    pos = {"qty": quote * (1 - fee) / px, "entry": px, "cost": quote, "stop": stop, "highest": px}

        equity = cash + (pos["qty"] * row["close"] if pos else 0)
        curve.append(equity)
        if not halted and risk.drawdown_hit(state, equity, rp):
            halted = True
            if pos:
                sell(row["close"], i, "freno caída máxima")
                curve[-1] = cash

    if pos:
        sell(df["close"].iloc[-1], len(df) - 1, "fin del período")
        curve[-1] = cash

    curve_s = pd.Series(curve) if curve else pd.Series([capital])
    max_dd = float((1 - curve_s / curve_s.cummax()).max())
    pnls = [t["pnl"] for t in trades]
    return {
        "final_equity": round(float(curve_s.iloc[-1]), 2),
        "return_pct": round(float(100 * (curve_s.iloc[-1] / capital - 1)), 2),
        "buy_hold_pct": round(float(100 * (df["close"].iloc[-1] / df["close"].iloc[0] - 1)), 2),
        "max_drawdown_pct": round(100 * max_dd, 2),
        "trades": len(trades),
        "win_rate_pct": round(float(100 * sum(p > 0 for p in pnls) / len(pnls)), 1) if pnls else 0.0,
        "halted": halted,
        "trade_log": trades,
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--symbol", default="BTCUSDT")
    ap.add_argument("--interval", default="1h")
    ap.add_argument("--days", type=int, default=365)
    ap.add_argument("--capital", type=float, default=100.0)
    ap.add_argument("--csv", help="archivo con columnas open_time,open,high,low,close")
    args = ap.parse_args()

    df = pd.read_csv(args.csv) if args.csv else fetch_history(args.symbol, args.interval, args.days)
    r = run_backtest(df, capital=args.capital)
    print(f"Velas analizadas: {len(df)}")
    print(f"Resultado del bot:      {r['return_pct']:+.2f}%  ({args.capital:.0f} -> {r['final_equity']:.2f} USDT)")
    print(f"Comprar y guardar:      {r['buy_hold_pct']:+.2f}%")
    print(f"Peor caída del capital: -{r['max_drawdown_pct']:.2f}%")
    print(f"Operaciones: {r['trades']} | ganadoras: {r['win_rate_pct']}%")
    if r["halted"]:
        print("El freno de caída máxima se activó durante el período.")


if __name__ == "__main__":
    main()
