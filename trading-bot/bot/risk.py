"""Gestión de riesgo: tamaño de posición y frenos de emergencia."""
from dataclasses import dataclass


@dataclass
class RiskParams:
    risk_per_trade: float = 0.02    # pierde como máximo 2% del capital si salta el stop
    max_position_pct: float = 0.95  # nunca usa más del 95% del efectivo en una operación
    daily_loss_limit: float = 0.05  # si pierde 5% en el día (UTC), no abre más operaciones hasta mañana
    max_drawdown: float = 0.20      # si cae 20% desde su máximo, se apaga y espera revisión humana
    min_notional: float = 6.0       # Binance exige ~5 USDT mínimo por orden


def position_size(equity: float, cash: float, entry: float, stop: float, p: RiskParams) -> float:
    """Monto en USDT a comprar. Devuelve 0 si la operación no es válida."""
    distance = entry - stop
    if distance <= 0 or entry <= 0:
        return 0.0
    risk_amount = equity * p.risk_per_trade
    quote = risk_amount / (distance / entry)
    quote = min(quote, cash * p.max_position_pct)
    return round(quote, 2) if quote >= p.min_notional else 0.0


def roll_day(state: dict, equity: float, day: str) -> None:
    """Al cambiar el día UTC, guarda el capital de arranque del día."""
    if state.get("day") != day:
        state["day"] = day
        state["day_start_equity"] = equity


def daily_limit_hit(state: dict, equity: float, p: RiskParams) -> bool:
    start = state.get("day_start_equity") or equity
    return equity <= start * (1 - p.daily_loss_limit)


def drawdown_hit(state: dict, equity: float, p: RiskParams) -> bool:
    """Actualiza el máximo histórico y avisa si la caída supera el límite."""
    state["peak_equity"] = max(state.get("peak_equity", equity), equity)
    return equity <= state["peak_equity"] * (1 - p.max_drawdown)
