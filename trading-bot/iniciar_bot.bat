@echo off
REM Doble clic para arrancar el bot. Si se corta, vuelve a arrancar solo a los 30 segundos.
cd /d "%~dp0"
:loop
python -m bot.bot
echo El bot se detuvo. Reintentando en 30 segundos... (cierre esta ventana para apagarlo)
timeout /t 30 /nobreak >nul
goto loop
