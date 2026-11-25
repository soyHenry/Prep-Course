# Bot de trading cripto (Binance)

Bot que opera **BTC/USDT** solo, las 24 horas, siguiendo la tendencia y con frenos de riesgo.
**Fase actual: prueba con dinero ficticio hasta enero de 2027.** A enero se pasa a dinero real solo si los números lo justifican.

> Aviso honesto: ninguna estrategia garantiza ganancias. Este bot está diseñado para **perder poco cuando se equivoca**, no para ganar siempre.

## Cómo opera

| Regla | Detalle |
|---|---|
| Mercado | BTCUSDT spot, velas de 1 hora. Sin apalancamiento ni ventas en corto |
| Compra | La media móvil de 20 velas cruza hacia arriba la de 50, y el precio está sobre la de 200 (tendencia alcista) |
| Stop-loss | 2 × ATR (la volatilidad) debajo de la entrada. Se revisa **cada minuto** |
| Stop móvil | Sube con el precio (máximo − 3 × ATR). Nunca baja |
| Venta | Salta el stop, o la media de 20 cruza hacia abajo la de 50 |

**Frenos de riesgo**
- Cada operación arriesga como máximo **2 % del capital** si salta el stop (con 100 USD, unos 2 USD).
- Si pierde **5 % en un día**, no abre más operaciones hasta el día siguiente.
- Si cae **20 % desde su máximo**, vende todo y **se apaga** hasta que una persona lo revise.
- Solo usa el capital configurado (`CAPITAL`), aunque la cuenta tenga más plata.
- El modo con dinero real no arranca sin `CONFIRMO_DINERO_REAL=si`.

## Instalación en su PC (Windows, una sola vez)

1. Instale Python desde [python.org](https://www.python.org/downloads/). En el instalador, **tilde "Add python.exe to PATH"**.
2. Descargue el código: en GitHub, rama `claude/automated-trading-bot-xg5uvk` → botón verde *Code* → *Download ZIP*. Descomprímalo y entre a la carpeta `trading-bot`.
3. En esa carpeta, clic en la barra de direcciones, escriba `cmd` y Enter. En la ventana negra:
   ```
   pip install -r requirements.txt
   copy .env.example .env
   python -m pytest -q tests
   python -m bot.backtest --days 730
   ```
4. Configure Telegram (abajo) y arranque con **doble clic en `iniciar_bot.bat`**. Si se corta, se reinicia solo.

**Para que corra las 24 h:**
- Configuración → Sistema → Energía → *Suspender: Nunca* (la pantalla sí puede apagarse).
- Para que arranque solo al prender la PC: `Win + R` → `shell:startup` → pegue ahí un acceso directo a `iniciar_bot.bat`.
- Si la PC se apaga o se corta internet, no pasa nada grave: al volver retoma desde el estado guardado. En modo real, eso sí, mientras la PC esté apagada el stop-loss no se vigila.

## Avisos por Telegram

Le llegan al celular: cada compra y venta, el resumen diario (13 h por defecto), si se activa un freno o si pierde la conexión.

1. En Telegram, busque **@BotFather** → `/newbot` → elija nombre. Le da un *token*: péguelo en `.env` como `TELEGRAM_TOKEN=`.
2. Abra el chat con su bot nuevo y mándele "hola".
3. Corra `python -m bot.notify --chat-id` y pegue el número en `.env` como `TELEGRAM_CHAT_ID=`.
4. Pruebe con `python -m bot.notify --test`.

Para pedir el resumen en cualquier momento: `python -m bot.report --telegram`.

## Acceso a Binance

| Etapa | Qué necesita |
|---|---|
| **Ahora (modo `paper`)** | **Nada.** Usa los precios públicos de Binance; no hace falta cuenta ni claves |
| Opcional (modo `testnet`) | Claves de [testnet.binance.vision](https://testnet.binance.vision) (entrar con GitHub → *Generate HMAC_SHA256 Key*) |
| **Enero (modo `live`)** | Una clave de API de su cuenta real, creada así: |

Cómo crear la clave real (solo en enero, si se aprueba):
1. Binance → Perfil → **Gestión de API** → *Crear API* → *Generada por el sistema*.
2. Permisos: tilde **solo "Habilitar trading spot y de margen"**. **Nunca "Habilitar retiros"**: así, aunque alguien robe la clave, no puede sacar su plata.
3. Restricción de IP: ponga la IP de su casa (la ve en [whatismyip.com](https://www.whatismyip.com)).
4. Pegue la clave en `.env` (`BINANCE_KEY`, `BINANCE_SECRET`), ponga `MODE=live` y `CONFIRMO_DINERO_REAL=si`.
5. Deje en la cuenta spot solo los USDT que el bot puede usar.

El archivo `.env` contiene sus claves: no lo comparta ni lo suba a ningún lado (ya está excluido de Git).

## Modos

| MODE | Qué hace |
|---|---|
| `paper` (por defecto) | Simula órdenes con precios **reales**, comisión de 0,1 % y deslizamiento |
| `testnet` | Órdenes en la cuenta de prueba oficial de Binance (dinero ficticio) |
| `live` | **Dinero real** |

## Ver el progreso

- **Telegram:** avisos automáticos y resumen diario.
- `python -m bot.report`: capital, % ganado o perdido, operaciones y comparación con comprar y guardar BTC.
- Carpeta `data/`: estado (`state_paper.json`), cada operación (`trades_paper.csv`, se abre con Excel) y el registro (`bot_paper.log`).

## Plan hasta enero

1. **Ya:** correr el backtest y arrancar el modo `paper` con 100 USD ficticios.
2. **Cada semana:** `python -m bot.report`, comparando contra "comprar y guardar BTC".
3. **Revisión en enero.** Se pasa a dinero real (100 USD/mes) **solo si**:
   - el bot no perdió más de 10 % en la prueba,
   - no se activó el freno de caída máxima,
   - y no rindió claramente peor que comprar y guardar.

   Si no se cumplen, se ajusta la estrategia o se opta por compra periódica (DCA), que es más simple y suele rendir igual o mejor.

## Tests

```bash
python -m pytest -q tests
```
