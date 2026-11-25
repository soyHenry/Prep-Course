"""Acceso a Binance: datos de mercado públicos y ejecución de órdenes."""
import hashlib
import hmac
import math
import time
from dataclasses import dataclass
from urllib.parse import urlencode

import pandas as pd
import requests

PUBLIC_DATA_URL = "https://data-api.binance.vision"  # datos públicos, sin claves
TESTNET_URL = "https://testnet.binance.vision"
LIVE_URL = "https://api.binance.com"

PAPER_FEE = 0.001        # 0,1% comisión estándar de Binance
PAPER_SLIPPAGE = 0.0005  # 0,05% de deslizamiento para ser conservadores

_session = requests.Session()


def _get(url: str, params: dict | None = None, headers: dict | None = None):
    r = _session.get(url, params=params, headers=headers, timeout=15)
    r.raise_for_status()
    return r.json()


def klines_to_df(raw: list) -> pd.DataFrame:
    df = pd.DataFrame(raw, columns=[
        "open_time", "open", "high", "low", "close", "volume", "close_time",
        "quote_volume", "trades", "taker_base", "taker_quote", "ignore",
    ])
    for col in ("open", "high", "low", "close", "volume"):
        df[col] = df[col].astype(float)
    df["open_time"] = df["open_time"].astype("int64")
    df["close_time"] = df["close_time"].astype("int64")
    return df[["open_time", "open", "high", "low", "close", "volume", "close_time"]]


def fetch_klines(symbol: str, interval: str, limit: int = 500, start_ms: int | None = None,
                 base_url: str = PUBLIC_DATA_URL) -> pd.DataFrame:
    params = {"symbol": symbol, "interval": interval, "limit": limit}
    if start_ms is not None:
        params["startTime"] = start_ms
    return klines_to_df(_get(f"{base_url}/api/v3/klines", params))


def fetch_closed_klines(symbol: str, interval: str, limit: int = 500) -> pd.DataFrame:
    df = fetch_klines(symbol, interval, limit)
    now_ms = int(time.time() * 1000)
    return df[df["close_time"] < now_ms].reset_index(drop=True)


def fetch_history(symbol: str, interval: str, days: int) -> pd.DataFrame:
    start = int((time.time() - days * 86400) * 1000)
    frames = []
    while True:
        df = fetch_klines(symbol, interval, 1000, start_ms=start)
        if df.empty:
            break
        frames.append(df)
        start = int(df["close_time"].iloc[-1]) + 1
        if len(df) < 1000:
            break
        time.sleep(0.2)
    out = pd.concat(frames, ignore_index=True) if frames else pd.DataFrame()
    now_ms = int(time.time() * 1000)
    return out[out["close_time"] < now_ms].reset_index(drop=True) if not out.empty else out


def last_price(symbol: str) -> float:
    return float(_get(f"{PUBLIC_DATA_URL}/api/v3/ticker/price", {"symbol": symbol})["price"])


@dataclass
class Fill:
    qty: float     # cantidad del activo (ej. BTC)
    price: float   # precio promedio
    quote: float   # USDT gastados (compra) o recibidos (venta), ya neto de comisión


class PaperBroker:
    """Simula las órdenes con el precio real de mercado, comisión y deslizamiento."""

    def __init__(self, symbol: str):
        self.symbol = symbol

    def buy(self, quote_amount: float) -> Fill:
        price = last_price(self.symbol) * (1 + PAPER_SLIPPAGE)
        qty = quote_amount * (1 - PAPER_FEE) / price
        return Fill(qty=qty, price=price, quote=quote_amount)

    def sell(self, qty: float) -> Fill:
        price = last_price(self.symbol) * (1 - PAPER_SLIPPAGE)
        return Fill(qty=qty, price=price, quote=qty * price * (1 - PAPER_FEE))


def sign(query: str, secret: str) -> str:
    return hmac.new(secret.encode(), query.encode(), hashlib.sha256).hexdigest()


class BinanceBroker:
    """Órdenes de mercado reales en Binance (testnet o cuenta real)."""

    def __init__(self, symbol: str, key: str, secret: str, base_url: str):
        self.symbol, self.key, self.secret, self.base_url = symbol, key, secret, base_url
        info = _get(f"{base_url}/api/v3/exchangeInfo", {"symbol": symbol})["symbols"][0]
        filters = {f["filterType"]: f for f in info["filters"]}
        self.step = float(filters["LOT_SIZE"]["stepSize"])
        notional = filters.get("NOTIONAL") or filters.get("MIN_NOTIONAL") or {}
        self.min_notional = float(notional.get("minNotional", 5))
        self.sync_clock()

    def sync_clock(self) -> None:
        """Binance rechaza órdenes si el reloj de la PC está corrido más de 1 s."""
        server = _get(f"{self.base_url}/api/v3/time")["serverTime"]
        self.time_offset = server - int(time.time() * 1000)

    def _signed(self, method: str, path: str, params: dict) -> dict:
        for attempt in range(2):
            signed = {**params, "timestamp": int(time.time() * 1000) + self.time_offset, "recvWindow": 5000}
            query = urlencode(signed)
            url = f"{self.base_url}{path}?{query}&signature={sign(query, self.secret)}"
            r = _session.request(method, url, headers={"X-MBX-APIKEY": self.key}, timeout=15)
            if attempt == 0 and r.status_code == 400 and '"code":-1021' in r.text.replace(" ", ""):
                self.sync_clock()  # reloj corrido: resincroniza y reintenta una vez
                continue
            break
        if r.status_code >= 400:
            raise RuntimeError(f"Binance {r.status_code}: {r.text}")
        return r.json()

    def floor_qty(self, qty: float) -> float:
        decimals = max(0, -int(math.floor(math.log10(self.step))))
        return round(math.floor(qty / self.step) * self.step, decimals)

    @staticmethod
    def _fill_from(order: dict, side: str) -> Fill:
        qty = float(order["executedQty"])
        quote = float(order["cummulativeQuoteQty"])
        fee_base = fee_quote = 0.0
        for f in order.get("fills", []):
            if f["commissionAsset"] == "USDT":
                fee_quote += float(f["commission"])
            elif side == "BUY":
                fee_base += float(f["commission"])
        price = quote / qty if qty else 0.0
        if side == "BUY":
            return Fill(qty=qty - fee_base, price=price, quote=quote + fee_quote)
        return Fill(qty=qty, price=price, quote=quote - fee_quote)

    def buy(self, quote_amount: float) -> Fill:
        order = self._signed("POST", "/api/v3/order", {
            "symbol": self.symbol, "side": "BUY", "type": "MARKET",
            "quoteOrderQty": f"{quote_amount:.2f}", "newOrderRespType": "FULL",
        })
        return self._fill_from(order, "BUY")

    def sell(self, qty: float) -> Fill:
        order = self._signed("POST", "/api/v3/order", {
            "symbol": self.symbol, "side": "SELL", "type": "MARKET",
            "quantity": f"{self.floor_qty(qty):f}", "newOrderRespType": "FULL",
        })
        return self._fill_from(order, "SELL")
