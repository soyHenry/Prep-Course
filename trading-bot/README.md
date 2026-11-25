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

## Instalación (una sola vez)

Requiere Python 3.10 o más nuevo.

```bash
cd trading-bot
pip install -r requirements.txt
cp .env.example .env        # en Windows: copy .env.example .env
```

## Uso

```bash
python -m bot.backtest --days 730   # 1) probar la estrategia con los últimos 2 años
python -m bot.bot                    # 2) dejarlo corriendo (Ctrl+C para frenarlo)
python -m bot.report                 # 3) ver cómo viene
```

Todo queda guardado en `data/`: el estado (`state_paper.json`), cada operación (`trades_paper.csv`) y el registro (`bot_paper.log`). Si el bot se corta, retoma donde quedó.

## Modos

| MODE | Qué hace | Claves |
|---|---|---|
| `paper` (por defecto) | Simula las órdenes con precios **reales** de Binance, con comisión de 0,1 % y deslizamiento | No necesita |
| `testnet` | Manda órdenes a la cuenta de prueba oficial de Binance (dinero ficticio) | De [testnet.binance.vision](https://testnet.binance.vision): entrar con GitHub → *Generate HMAC_SHA256 Key* |
| `live` | **Dinero real** | De Binance, **sin permiso de retiro** y con restricción de IP |

Se recomienda `paper`: los precios de la testnet a veces no reflejan el mercado real.

## Dejarlo 24 h

El bot tiene que correr en una computadora siempre encendida y conectada:
- **Su PC**, sin suspensión. Si se apaga, al volver a arrancarlo retoma desde el estado guardado.
- **Un servidor en la nube** (VPS) por unos 5 USD al mes. Es lo más confiable para 24 h.

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
