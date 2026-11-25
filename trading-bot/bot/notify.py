"""Avisos por Telegram.

    python -m bot.notify --chat-id   # muestra su chat_id (antes, mandale cualquier mensaje a su bot)
    python -m bot.notify --test      # manda un mensaje de prueba
"""
import argparse
import logging
import os

import requests

log = logging.getLogger("bot")
API = "https://api.telegram.org/bot{token}/{method}"


def _token() -> str:
    return os.environ.get("TELEGRAM_TOKEN", "").strip()


def _chat() -> str:
    return os.environ.get("TELEGRAM_CHAT_ID", "").strip()


def enabled() -> bool:
    return bool(_token() and _chat())


def send(text: str) -> bool:
    """Manda un mensaje. Nunca corta el bot si Telegram falla."""
    if not enabled():
        return False
    try:
        r = requests.post(API.format(token=_token(), method="sendMessage"),
                          json={"chat_id": _chat(), "text": text}, timeout=10)
        r.raise_for_status()
        return True
    except Exception as e:
        log.warning("No se pudo mandar el aviso de Telegram: %s", e)
        return False


def main() -> None:
    from .config import load_dotenv
    load_dotenv()
    ap = argparse.ArgumentParser()
    ap.add_argument("--chat-id", action="store_true")
    ap.add_argument("--test", action="store_true")
    args = ap.parse_args()
    if not _token():
        raise SystemExit("Falta TELEGRAM_TOKEN en .env")
    if args.chat_id:
        updates = requests.get(API.format(token=_token(), method="getUpdates"), timeout=10).json()
        chats = {u["message"]["chat"]["id"] for u in updates.get("result", []) if "message" in u}
        print("Su chat_id:" if chats else "No hay mensajes. Mandele un 'hola' a su bot en Telegram y vuelva a correr esto.",
              *chats)
    if args.test:
        print("Enviado" if send("🤖 Prueba: los avisos del bot de trading funcionan.") else "No se pudo enviar")


if __name__ == "__main__":
    main()
