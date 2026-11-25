"""Resumen de cómo va el bot:  python -m bot.report"""
import json
import os

import pandas as pd

from . import exchange
from .config import DATA_DIR, load_dotenv


def main() -> None:
    load_dotenv()
    mode = os.environ.get("MODE", "paper").lower()
    symbol = os.environ.get("SYMBOL", "BTCUSDT").upper()
    state_file = DATA_DIR / f"state_{mode}.json"
    if not state_file.exists():
        print("Todavía no hay datos: el bot no corrió en este modo.")
        return
    state = json.loads(state_file.read_text())
    price = exchange.last_price(symbol)
    pos = state.get("position")
    equity = state["cash"] + (pos["qty"] * price if pos else 0)
    start = state["start_capital"]

    print(f"Modo: {mode} | desde {state.get('started_at', '?')[:10]}")
    print(f"Capital: {equity:.2f} USDT (arrancó con {start:.2f}) -> {100 * (equity / start - 1):+.2f}%")
    if state.get("start_price"):
        print(f"Si solo hubiera comprado y guardado BTC: {100 * (price / state['start_price'] - 1):+.2f}%")
    print("Posición abierta:", f"sí, entrada {pos['entry']:.2f}, stop {pos['stop']:.2f}" if pos else "no")
    if state.get("halted"):
        print("ATENCIÓN: bot detenido por caída máxima.")

    trades_file = DATA_DIR / f"trades_{mode}.csv"
    if trades_file.exists():
        t = pd.read_csv(trades_file)
        sells = t[t["side"] == "SELL"]
        if len(sells):
            wins = (sells["pnl"].astype(float) > 0).sum()
            print(f"Operaciones cerradas: {len(sells)} | ganadoras: {wins} ({100 * wins / len(sells):.0f}%)"
                  f" | resultado total: {sells['pnl'].astype(float).sum():+.2f} USDT")


if __name__ == "__main__":
    main()
