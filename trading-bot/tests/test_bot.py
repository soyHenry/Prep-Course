import numpy as np
import pandas as pd
import pytest

from bot import bot as live
from bot import exchange, risk, strategy
from bot.backtest import run_backtest
from bot.config import Config
from bot.risk import RiskParams
from bot.strategy import StrategyParams


def synthetic(n=3000, seed=1):
    rng = np.random.default_rng(seed)
    t = np.arange(n)
    close = 30000 * np.exp(0.15 * np.sin(t / 150) + np.cumsum(rng.normal(0, 0.004, n)))
    open_ = np.r_[close[0], close[:-1]]
    high = np.maximum(open_, close) * (1 + rng.uniform(0, 0.003, n))
    low = np.minimum(open_, close) * (1 - rng.uniform(0, 0.003, n))
    ot = 1_700_000_000_000 + t * 3_600_000
    return pd.DataFrame({"open_time": ot, "open": open_, "high": high, "low": low,
                         "close": close, "volume": 1.0, "close_time": ot + 3_599_999})


def test_signature_matches_binance_docs_example():
    secret = "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"
    query = "symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559"
    assert exchange.sign(query, secret) == "c8db56825ae71d6d79447849e617115f4a920fa2acdcab2b053c4b2838bd6b71"


def test_position_size_risks_two_percent():
    p = RiskParams()
    quote = risk.position_size(equity=100, cash=100, entry=100, stop=96, p=p)  # stop a 4%
    assert quote == pytest.approx(50.0)  # perder 4% de 50 = 2 USDT = 2% del capital


def test_position_size_caps_and_minimum():
    p = RiskParams()
    assert risk.position_size(100, 100, 100, 99.9, p) == 95.0      # tope 95% del efectivo
    assert risk.position_size(10, 10, 100, 50, p) == 0.0           # menos del mínimo de Binance
    assert risk.position_size(100, 100, 100, 101, p) == 0.0        # stop inválido


def test_daily_limit_and_drawdown():
    p, s = RiskParams(), {}
    risk.roll_day(s, 100, "2026-12-01")
    assert not risk.daily_limit_hit(s, 96, p)
    assert risk.daily_limit_hit(s, 95, p)
    risk.roll_day(s, 95, "2026-12-02")
    assert not risk.daily_limit_hit(s, 95, p)
    assert not risk.drawdown_hit(s, 120, p)
    assert risk.drawdown_hit(s, 96, p)  # 20% abajo del máximo de 120


def test_trailing_stop_only_moves_up():
    p = StrategyParams()
    assert strategy.trailing_stop(90, 110, 2, p) == 104
    assert strategy.trailing_stop(105, 110, 2, p) == 105


def test_backtest_runs_and_respects_drawdown_brake():
    r = run_backtest(synthetic(), capital=100)
    assert r["trades"] > 0
    assert r["final_equity"] > 0
    # el freno corta en ~20%; con deslizamiento y huecos puede pasarse un poco
    assert r["max_drawdown_pct"] < 25


def test_live_step_buys_and_stops_out(monkeypatch, tmp_path):
    df = synthetic()
    df = strategy.add_indicators(df, StrategyParams())
    i = next(k for k in range(250, len(df)) if strategy.entry_signal(df, k, StrategyParams()))
    candles = df.iloc[: i + 1][["open_time", "open", "high", "low", "close", "volume", "close_time"]]
    prices = {"p": float(df["close"].iloc[i])}

    monkeypatch.setattr(live, "DATA_DIR", tmp_path)
    monkeypatch.setattr(exchange, "last_price", lambda s: prices["p"])
    monkeypatch.setattr(exchange, "fetch_closed_klines", lambda *a, **k: candles.reset_index(drop=True))

    cfg = Config(capital=100)
    state = live.load_state(cfg)
    broker = exchange.PaperBroker(cfg.symbol)

    live.step(cfg, state, broker)
    pos = state["position"]
    assert pos is not None and state["cash"] < 100

    prices["p"] = pos["stop"] * 0.999
    live.step(cfg, state, broker)
    assert state["position"] is None
    assert 95 < state["cash"] < 100  # perdió cerca del 2% previsto, no más
    assert (tmp_path / "trades_paper.csv").exists()


def test_telegram_messages_on_trades(monkeypatch, tmp_path):
    from bot import notify
    sent = []
    monkeypatch.setenv("TELEGRAM_TOKEN", "x")
    monkeypatch.setenv("TELEGRAM_CHAT_ID", "1")

    class R:
        def raise_for_status(self):
            pass

    monkeypatch.setattr(notify.requests, "post", lambda url, json, timeout: sent.append(json["text"]) or R())
    test_live_step_buys_and_stops_out(monkeypatch, tmp_path)
    assert any("COMPRA" in m for m in sent) and any("VENTA" in m for m in sent)

    cfg = Config(capital=100)
    text = live.summary_text(cfg, live.load_state(cfg) | {"cash": 98.0, "start_price": 100.0}, 110.0)
    assert "Capital: 98.00 USDT (-2.00%)" in text and "+10.00%" in text


def test_telegram_failure_never_breaks_bot(monkeypatch):
    from bot import notify
    monkeypatch.setenv("TELEGRAM_TOKEN", "x")
    monkeypatch.setenv("TELEGRAM_CHAT_ID", "1")
    monkeypatch.setattr(notify.requests, "post", lambda *a, **k: (_ for _ in ()).throw(OSError("sin red")))
    assert notify.send("hola") is False
