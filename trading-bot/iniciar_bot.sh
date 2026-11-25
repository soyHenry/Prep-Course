#!/usr/bin/env bash
# Arranca el bot y lo reinicia solo si se corta (Mac / Linux).
cd "$(dirname "$0")"
while true; do
  python3 -m bot.bot
  echo "El bot se detuvo. Reintentando en 30 segundos..."
  sleep 30
done
