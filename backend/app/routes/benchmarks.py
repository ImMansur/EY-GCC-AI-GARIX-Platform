"""Dynamic benchmark calculation from survey responses.

Once ≥30 responses exist for a role, benchmarks are computed from real data
using quartiles. Below that threshold the static defaults are returned.
"""

import statistics
import time
from functools import wraps
from fastapi import APIRouter, Query

from app.firebase import get_db

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

MIN_RESPONSES = 25

# ── Static fallback benchmarks (used when < 25 responses) ──
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


def _quantile(data: list[float], q: float) -> float:
    return round(statistics.quantiles(data, n=100, method="inclusive")[int(q * 100) - 1], 2)


def _is_dynamic_enabled() -> bool:
    try:
        db = get_db()
        doc = db.collection("settings").document("benchmarks").get()
        return doc.to_dict().get("dynamic_enabled", False) if doc.exists else False
    except Exception:
        return False


@cached_benchmark
def compute_benchmark(role: str, sector: str = "all") -> dict:
    """Compute benchmark for a role and sector from Firestore pre-aggregated data.

    Returns percentiles for composite and individual dimensions.
    """
    def _format_static(val: float) -> dict:
        return {"median": val, "leading_quartile": val, "lagging_quartile": val}

    if not _is_dynamic_enabled():
        static = _STATIC.get(role, _DEFAULT)
        return {
            "composite": _format_static(static["composite"]),
            "dimensions": {str(k): _format_static(v) for k, v in static["dimensions"].items()},
            "source": "static",
            "count": 0
        }

    db = get_db()
    
    role_key = role.replace(" ", "_").lower()
    sector_key = sector.replace(" ", "_").lower()
    doc_id = f"{role_key}_{sector_key}"
    
    doc_ref = db.collection("benchmark_aggregates").document(doc_id).get()
    
    if doc_ref.exists:
        data = doc_ref.to_dict()
        comp_scores = data.get("composite_scores", [])
        dim_scores = data.get("dimension_scores", {})
        
        if len(comp_scores) >= MIN_RESPONSES:
            comp_scores.sort()
            
            dim_results = {}
            for dim_id, scores in dim_scores.items():
                scores.sort()
                if scores:
                    dim_results[dim_id] = {
                        "median": _quantile(scores, 0.50),
                        "leading_quartile": _quantile(scores, 0.75),
                        "lagging_quartile": _quantile(scores, 0.25)
                    }
            
            return {
                "composite": {
                    "median": _quantile(comp_scores, 0.50),
                    "leading_quartile": _quantile(comp_scores, 0.75),
                    "lagging_quartile": _quantile(comp_scores, 0.25)
                },
                "dimensions": dim_results,
                "source": "dynamic",
                "count": data.get("response_count", len(comp_scores))
            }

    # Fall back to static data if not enough responses or document missing
    static = _STATIC.get(role, _DEFAULT)
    return {
        "composite": _format_static(static["composite"]),
        "dimensions": {str(k): _format_static(v) for k, v in static["dimensions"].items()},
        "source": "static",
        "count": len(doc_ref.to_dict().get("composite_scores", [])) if doc_ref and doc_ref.exists else 0
    }


@router.get("/benchmarks/{role:path}")
async def get_benchmark(role: str, sector: str = Query("all")):
    """Return benchmark data for a given role and sector."""
    return compute_benchmark(role, sector)
