"""Static expert-defined benchmarks for the current phase.
"""

import time
from functools import wraps
from fastapi import APIRouter

router = APIRouter()

_CACHE = {}
_CACHE_TTL = 900

def cached_benchmark(func):
    @wraps(func)
    def wrapper(role: str, sector: str = "all"):
        key = f"{role}_{sector}"
        now = time.time()
        if key in _CACHE:
            result, timestamp = _CACHE[key]
            if now - timestamp < _CACHE_TTL:
                return result
        result = func(role, sector)
        _CACHE[key] = (result, now)
        return result
    return wrapper

# ── Static fallback benchmarks ──
_STATIC: dict[str, dict] = {
    "GCC Head":                          {"composite": 3.1, "dimensions": {1:4, 2:3, 3:3, 4:3, 5:3, 6:3, 7:3, 8:3, 9:3}},
    "Managing Director (MD)":            {"composite": 3.1, "dimensions": {1:4, 2:3, 3:3, 4:3, 5:3, 6:3, 7:3, 8:3, 9:3}},
    "Chief Operating Officer (COO)":     {"composite": 3.1, "dimensions": {1:4, 2:3, 3:3, 4:3, 5:3, 6:3, 7:3, 8:3, 9:3}},
    "Strategy Officer":                  {"composite": 3.2, "dimensions": {1:4, 2:3, 3:3, 4:3, 5:3, 6:3, 7:4, 8:3, 9:3}},
    "CIO":                               {"composite": 3.0, "dimensions": {1:3, 2:3, 3:3, 4:4, 5:2, 6:4, 7:3, 8:3, 9:2}},
    "CTO / VP Engineering":              {"composite": 3.0, "dimensions": {1:3, 2:3, 3:3, 4:4, 5:2, 6:4, 7:3, 8:3, 9:2}},
    "Head of IT":                        {"composite": 3.0, "dimensions": {1:3, 2:3, 3:3, 4:4, 5:2, 6:4, 7:3, 8:3, 9:2}},
    "Head of Data":                      {"composite": 3.0, "dimensions": {1:3, 2:3, 3:3, 4:3, 5:3, 6:4, 7:3, 8:3, 9:2}},
    "Chief Data Officer":                {"composite": 3.0, "dimensions": {1:3, 2:3, 3:3, 4:3, 5:3, 6:4, 7:3, 8:3, 9:2}},
    "Analytics Lead":                    {"composite": 3.0, "dimensions": {1:3, 2:3, 3:3, 4:3, 5:3, 6:4, 7:3, 8:3, 9:2}},
    "Data Scientists":                   {"composite": 3.2, "dimensions": {1:4, 2:4, 3:3, 4:4, 5:2, 6:3, 7:4, 8:3, 9:2}},
    "ML Engineers":                      {"composite": 3.2, "dimensions": {1:4, 2:4, 3:3, 4:4, 5:2, 6:3, 7:4, 8:3, 9:2}},
    "AI CoE":                            {"composite": 3.2, "dimensions": {1:4, 2:4, 3:3, 4:4, 5:2, 6:3, 7:4, 8:3, 9:2}},
    "CHRO / VP HR":                      {"composite": 2.8, "dimensions": {1:3, 2:3, 3:3, 4:2, 5:4, 6:3, 7:2, 8:3, 9:2}},
    "Head of L&D":                       {"composite": 2.8, "dimensions": {1:3, 2:3, 3:3, 4:2, 5:4, 6:3, 7:2, 8:3, 9:2}},
    "Talent Acquisition":                {"composite": 2.7, "dimensions": {1:2, 2:3, 3:3, 4:2, 5:4, 6:3, 7:2, 8:3, 9:2}},
    "Head of Finance Ops":               {"composite": 3.0, "dimensions": {1:3, 2:3, 3:3, 4:4, 5:4, 6:3, 7:2, 8:3, 9:2}},
    "Operations Lead":                   {"composite": 2.9, "dimensions": {1:2, 2:3, 3:3, 4:4, 5:4, 6:3, 7:2, 8:3, 9:2}},
    "Head of Procurement & Supply Chain":{"composite": 3.0, "dimensions": {1:3, 2:3, 3:3, 4:4, 5:4, 6:3, 7:2, 8:3, 9:2}},
    "General Counsel":                   {"composite": 2.4, "dimensions": {1:2, 2:3, 3:2, 4:2, 5:3, 6:3, 7:2, 8:3, 9:2}},
    "Head of Risk":                      {"composite": 2.6, "dimensions": {1:2, 2:3, 3:3, 4:2, 5:3, 6:3, 7:2, 8:3, 9:2}},
    "Compliance Officer":                {"composite": 2.4, "dimensions": {1:2, 2:3, 3:2, 4:2, 5:3, 6:3, 7:2, 8:3, 9:2}},
}

_DEFAULT = {"composite": 2.9, "dimensions": {1:3, 2:3, 3:3, 4:3, 5:3, 6:3, 7:3, 8:3, 9:3}}

@cached_benchmark
def compute_benchmark(role: str, sector: str = "all") -> dict:
    """Always return expert-defined static benchmarks."""
    
    def _format_static(val: float) -> dict:
        return {"median": val, "leading_quartile": val, "lagging_quartile": val}

    static = _STATIC.get(role, _DEFAULT)
    return {
        "composite": _format_static(static["composite"]),
        "dimensions": {str(k): _format_static(v) for k, v in static["dimensions"].items()},
        "source": "static",
        "count": 0
    }
