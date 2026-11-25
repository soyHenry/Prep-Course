"""Configuración: lee variables de entorno y, si existe, el archivo .env."""
import os
from dataclasses import dataclass, field
from pathlib import Path

from .risk import RiskParams
from .strategy import StrategyParams

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"


def load_dotenv(path: Path = ROOT / ".env") -> None:
    if not path.exists():
        return
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


def _f(name: str, default: float) -> float:
    return float(os.environ.get(name) or default)


@dataclass
class Config:
    mode: str = "paper"
    symbol: str = "BTCUSDT"
    interval: str = "1h"
    capital: float = 100.0
    poll_seconds: int = 60
    api_key: str = ""
    api_secret: str = ""
    strategy: StrategyParams = field(default_factory=StrategyParams)
    risk: RiskParams = field(default_factory=RiskParams)


def load_config() -> Config:
    load_dotenv()
    mode = os.environ.get("MODE", "paper").lower()
    if mode not in ("paper", "testnet", "live"):
        raise SystemExit(f"MODE inválido: {mode}. Usá paper, testnet o live.")

    key = secret = ""
    if mode == "testnet":
        key = os.environ.get("BINANCE_TESTNET_KEY", "")
        secret = os.environ.get("BINANCE_TESTNET_SECRET", "")
    elif mode == "live":
        if os.environ.get("CONFIRMO_DINERO_REAL", "").lower() != "si":
            raise SystemExit("Modo live bloqueado: poné CONFIRMO_DINERO_REAL=si en .env si de verdad querés usar dinero real.")
        key = os.environ.get("BINANCE_KEY", "")
        secret = os.environ.get("BINANCE_SECRET", "")
    if mode != "paper" and not (key and secret):
        raise SystemExit(f"Faltan las claves de API para MODE={mode}.")

    return Config(
        mode=mode,
        symbol=os.environ.get("SYMBOL", "BTCUSDT").upper(),
        interval=os.environ.get("INTERVAL", "1h"),
        capital=_f("CAPITAL", 100),
        poll_seconds=int(_f("POLL_SECONDS", 60)),
        api_key=key,
        api_secret=secret,
        risk=RiskParams(
            risk_per_trade=_f("RISK_PER_TRADE", 0.02),
            daily_loss_limit=_f("DAILY_LOSS_LIMIT", 0.05),
            max_drawdown=_f("MAX_DRAWDOWN", 0.20),
        ),
    )
