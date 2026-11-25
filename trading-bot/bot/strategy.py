"""Estrategia de seguimiento de tendencia con stop-loss por volatilidad (ATR).

Reglas (siempre sobre velas CERRADAS):
- Entrada: la EMA rápida cruza hacia arriba a la EMA lenta y el precio está
  por encima de la EMA de tendencia larga (solo opera a favor de la tendencia).
- Stop inicial: precio de entrada - stop_atr * ATR.
- Stop móvil: máximo alcanzado - trail_atr * ATR (solo sube, nunca baja).
- Salida: toca el stop, o la EMA rápida queda por debajo de la lenta
  (así no se pierde la salida aunque la PC haya estado apagada justo en el cruce).
Solo compra y vende (spot, sin apalancamiento, sin ventas en corto).
"""
from dataclasses import dataclass

import pandas as pd


@dataclass
class StrategyParams:
    ema_fast: int = 20
    ema_slow: int = 50
    ema_trend: int = 200
    atr_period: int = 14
    stop_atr: float = 2.0
    trail_atr: float = 3.0


def ema(series: pd.Series, n: int) -> pd.Series:
    return series.ewm(span=n, adjust=False).mean()


def atr(df: pd.DataFrame, n: int) -> pd.Series:
    prev_close = df["close"].shift(1)
    tr = pd.concat(
        [df["high"] - df["low"], (df["high"] - prev_close).abs(), (df["low"] - prev_close).abs()],
        axis=1,
    ).max(axis=1)
    return tr.ewm(alpha=1 / n, adjust=False).mean()


def add_indicators(df: pd.DataFrame, p: StrategyParams) -> pd.DataFrame:
    df = df.copy()
    df["ema_fast"] = ema(df["close"], p.ema_fast)
    df["ema_slow"] = ema(df["close"], p.ema_slow)
    df["ema_trend"] = ema(df["close"], p.ema_trend)
    df["atr"] = atr(df, p.atr_period)
    return df


def warmup(p: StrategyParams) -> int:
    return max(p.ema_trend, p.ema_slow, p.atr_period) + 1


def entry_signal(df: pd.DataFrame, i: int, p: StrategyParams) -> bool:
    if i < warmup(p):
        return False
    row, prev = df.iloc[i], df.iloc[i - 1]
    crossed_up = prev["ema_fast"] <= prev["ema_slow"] and row["ema_fast"] > row["ema_slow"]
    return bool(crossed_up and row["close"] > row["ema_trend"])


def exit_signal(df: pd.DataFrame, i: int) -> bool:
    row = df.iloc[i]
    return bool(row["ema_fast"] < row["ema_slow"])


def initial_stop(price: float, atr_value: float, p: StrategyParams) -> float:
    return price - p.stop_atr * atr_value


def trailing_stop(current_stop: float, highest: float, atr_value: float, p: StrategyParams) -> float:
    return max(current_stop, highest - p.trail_atr * atr_value)
