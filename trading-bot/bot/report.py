"""Resumen de cómo va el bot:  python -m bot.report  (agregue --telegram para mandarlo al celular)"""
import json
import sys

from . import exchange, notify
from .bot import state_path, summary_text
from .config import load_config


def main() -> None:
    cfg = load_config()
    path = state_path(cfg)
    if not path.exists():
        print("Todavía no hay datos: el bot no corrió en este modo.")
        return
    text = summary_text(cfg, json.loads(path.read_text()), exchange.last_price(cfg.symbol))
    print(text)
    if "--telegram" in sys.argv:
        notify.send("📊 Resumen\n" + text)


if __name__ == "__main__":
    main()
