import os
import json
from concurrent.futures import ThreadPoolExecutor
from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone

from firebase_admin import firestore
from app.firebase import get_db
from app.routes.benchmarks import compute_benchmark
from openai import AzureOpenAI

router = APIRouter()

def get_client():
    return AzureOpenAI(
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        api_version="2024-12-01-preview"
    )

def get_deployment():
    return os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4o")

def _get_stage(score: float) -> str:
    if score >= 4.5: return "Leading"
    if score >= 3.5: return "Structured"
    if score >= 2.5: return "Emerging"
    if score >= 1.5: return "Fragmented"
    return "Early"

def send_survey_completion_emails(*args, **kwargs):
    pass
_executor = ThreadPoolExecutor(max_workers=2)

# Strategy (id=1) and Risk Management (id=9) carry 1.5× weight
DIMENSION_WEIGHTS = {
    1: 1.5,
    2: 1.0,
    3: 1.0,
    4: 1.0,
    5: 1.0,
    6: 1.0,
    7: 1.0,
    8: 1.0,
    9: 1.5,
}


class OptionDetail(BaseModel):
    value: int
    label: str
    description: str


class AnswerItem(BaseModel):
    dimension_id: int
    dimension_name: str
    sub_dimension_id: str
    sub_dimension_name: str
    question: str
    selected_option: int
    option_label: str
    option_description: str
    all_options: Optional[list[OptionDetail]] = None


class SurveySubmission(BaseModel):
    uid: str
    persona: str
    role: str
    sector: str
    answers: list[AnswerItem]


# ✅ UPDATED FUNCTION (ONLY CHANGE)
def compute_scores(answers: list[AnswerItem]) -> dict:
    """Compute per-dimension and composite weighted GARIX score with sub-dimensions."""

    dimension_map = {}
    sub_dimension_order = {}  # Track order subdimensions first appear
    order_counter = 0
    total_weighted = 0.0
    total_weight = 0.0

    # Group answers by dimension -> sub_dimension, preserving order
    for a in answers:
        dimension_map.setdefault(a.dimension_id, {
            "name": a.dimension_name,
            "sub_dimensions": {}
        })
        sub_dims = dimension_map[a.dimension_id]["sub_dimensions"]
        
        # Track first appearance order
        if a.sub_dimension_id not in sub_dimension_order:
            sub_dimension_order[a.sub_dimension_id] = order_counter
            order_counter += 1
        
        sub_dims.setdefault(a.sub_dimension_id, {
            "name": a.sub_dimension_name,
            "scores": [],
            "order": sub_dimension_order[a.sub_dimension_id]
        })
        sub_dims[a.sub_dimension_id]["scores"].append(a.selected_option)

    dimension_scores = []

    # Compute average score per dimension
    for dim_id, data in dimension_map.items():
        sub_dims_list = []
        dim_total = 0.0
        for sub_id, sub_data in data["sub_dimensions"].items():
            sub_avg = sum(sub_data["scores"]) / len(sub_data["scores"]) if sub_data["scores"] else 0
            dim_total += sub_avg
            sub_dims_list.append({
                "sub_dimension_id": sub_id,
                "sub_dimension_name": sub_data["name"],
                "score": round(sub_avg, 2),
                "order": sub_data["order"]
            })

        avg_score = dim_total / len(sub_dims_list) if sub_dims_list else 0

        weight = DIMENSION_WEIGHTS.get(dim_id, 1.0)
        weighted_score = avg_score * weight

        total_weighted += weighted_score
        total_weight += weight

        # Sort by order index to preserve question sequence, then remove order field
        sorted_sub_dims = sorted(sub_dims_list, key=lambda x: x["order"])
        for sd in sorted_sub_dims:
            del sd["order"]

        dimension_scores.append({
            "dimension_id": dim_id,
            "dimension_name": data["name"],
            "score": round(avg_score, 2),
            "weight": weight,
            "weighted_score": round(weighted_score, 2),
            "sub_dimensions": sorted_sub_dims
        })

    composite = round(total_weighted / total_weight, 2) if total_weight > 0 else 0

    return {
        "dimensions": sorted(dimension_scores, key=lambda x: x["dimension_id"]),
        "composite_score": composite,
        "total_weighted": round(total_weighted, 2),
        "total_weight": round(total_weight, 2),
    }


INSIGHTS_PROMPT = """You are a senior AI maturity assessment consultant generating diagnostic findings for a GARIX-style assessment.

Your task is to produce structured, evidence-based findings for EACH dimension using provided scoring data.

### OBJECTIVE:
For EACH dimension, generate exactly 4 findings in this exact order:
1. STRENGTH
2. STAGE-PROGRESSION BLOCKER
3. CRITICAL GAP
4. RISK

### STRICT LOGIC RULES:
- STRENGTH: Identify an area of high maturity or solid baseline (e.g., STAGE 2 BASELINE ESTABLISHED).
- STAGE-PROGRESSION BLOCKER: Identify what is preventing them from moving to the next stage (e.g., INVESTMENT COMMITMENT).
- CRITICAL GAP: Identify the most critical deficiency requiring immediate attention (e.g., LEADERSHIP ALIGNMENT).
- RISK: Identify an exposure or risk area (e.g., BUDGET GOVERNANCE GAP).

### STRUCTURE AND FORMATTING RULES:
For each finding, you must provide:
- "label": The category (e.g., "STRENGTH", "STAGE-PROGRESSION BLOCKER", "CRITICAL GAP", "RISK").
- "title": A short thematic title in all caps (e.g., "LEADERSHIP ALIGNMENT" or "BUDGET GOVERNANCE GAP").
- "subtitle": A 1-sentence summary of the finding.
- "points": An array of 2 to 3 strings, where each string is a distinct bullet point explaining the context, impact, and required action. 
  **CRITICAL:** Do NOT include any specific numeric scores (e.g., "scored 4.0") in your points. Keep it qualitative, observational, and professional.

### OUTPUT FORMAT:
Return ONLY a JSON object where keys are the dimension_id (as strings) and values follow this exact format:
{
  "1": {
    "dimension": "<name>",
    "findings": [
      {
        "label": "STRENGTH",
        "title": "...",
        "subtitle": "...",
        "points": ["...", "..."]
      },
      ... (all 4 findings)
    ]
  }
}
"""

def generate_insights(persona: str, role: str, sector: str, scores: dict) -> dict:
    benchmark_data = compute_benchmark(role, sector)
    
    dims_data = []
    for d in scores.get("dimensions", []):
        dim_id_str = str(d['dimension_id'])
        dim_bm = benchmark_data.get("dimensions", {}).get(dim_id_str, {})
        median = dim_bm.get("median", 0)
        p75 = dim_bm.get("leading_quartile", 0)
        p25 = dim_bm.get("lagging_quartile", 0)
        gap = d['score'] - median

        sub_dims_text = "\n    ".join([f"- {sd['sub_dimension_name']}: {sd['score']}" for sd in d.get('sub_dimensions', [])])
        
        dims_data.append(f"""Dimension: {d['dimension_name']} (ID: {d['dimension_id']})
  Score: {d['score']}/5
  Maturity Stage: {_get_stage(d['score'])}
  Benchmark Median: {median} | P75: {p75} | P25: {p25}
  Gap vs Median: {gap:.2f}
  Sub-dimensions:
    {sub_dims_text}""")

    dims_data_str = "\n\n".join(dims_data)
    user_prompt = f"""Persona: {persona}
Role: {role}
Sector: {sector}
Composite GARIX Score: {scores.get('composite_score', 0)}/5

DIMENSIONS DATA:
{dims_data_str}
"""

    try:
        response = get_client().chat.completions.create(
            model=get_deployment(),
            messages=[
                {"role": "system", "content": INSIGHTS_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.4,
            response_format={"type": "json_object"},
            max_tokens=4096,
        )

        content = response.choices[0].message.content or ""
        return json.loads(content)
    except Exception:
        return {}


def update_benchmark_aggregates(role: str, sector: str, scores: dict):
    db = get_db()
    
    role_key = role.replace(" ", "_").lower()
    sector_key = sector.replace(" ", "_").lower()
    
    keys = [
        f"{role_key}_{sector_key}",
        f"{role_key}_all",
        f"all_{sector_key}",
        "all_all"
    ]
    
    composite = scores["composite_score"]
    dim_scores = {str(d["dimension_id"]): d["score"] for d in scores["dimensions"]}
    
    @firestore.transactional
    def update_in_transaction(transaction, doc_ref, key):
        snapshot = doc_ref.get(transaction=transaction)
        if snapshot.exists:
            data = snapshot.to_dict()
            count = data.get("response_count", 0) + 1
            comp_scores = data.get("composite_scores", [])
            
            if len(comp_scores) < 2000:
                comp_scores.append(composite)
            
            d_scores = data.get("dimension_scores", {})
            for dim_id, score in dim_scores.items():
                ds = d_scores.setdefault(dim_id, [])
                if len(ds) < 2000:
                    ds.append(score)
                    
            transaction.update(doc_ref, {
                "response_count": count,
                "composite_scores": comp_scores,
                "dimension_scores": d_scores,
                "last_updated": datetime.now(timezone.utc).isoformat()
            })
        else:
            transaction.set(doc_ref, {
                "role": role if not key.startswith("all_") else "all",
                "sector": sector if not key.endswith("_all") else "all",
                "response_count": 1,
                "composite_scores": [composite],
                "dimension_scores": {k: [v] for k, v in dim_scores.items()},
                "last_updated": datetime.now(timezone.utc).isoformat()
            })

    for key in keys:
        doc_ref = db.collection("benchmark_aggregates").document(key)
        transaction = db.transaction()
        try:
            update_in_transaction(transaction, doc_ref, key)
        except Exception as e:
            print(f"Error updating aggregate {key}: {e}")

def generate_insights_background(survey_id: str, uid: str, persona: str, role: str, sector: str, scores: dict):
    """Background task to generate insights after survey submission"""
    try:
        db = get_db()
        insights = generate_insights(persona, role, sector, scores)
        
        # Update both collections
        db.collection("surveys").document(survey_id).update({"insights": insights})
        db.collection("users").document(uid).collection("surveys").document(survey_id).update({"insights": insights})
    except Exception as e:
        print(f"Error generating insights in background: {e}")

@router.post("/survey/submit")
async def submit_survey(submission: SurveySubmission, background_tasks: BackgroundTasks):
    try:
        db = get_db()
        scores = compute_scores(submission.answers)

        user_doc = db.collection("users").document(submission.uid).get()
        user_data = user_doc.to_dict() if user_doc.exists else {}
        user_name = user_data.get("name", "Unknown User")
        user_email = user_data.get("email", "Unknown Email")
        user_company = user_data.get("company", "")
        user_location = user_data.get("location", "")
        user_size = user_data.get("size", "")
        user_industry = user_data.get("industry", "")

        benchmark_data = compute_benchmark(submission.role, submission.sector)

        survey_data = {
            "uid": submission.uid,
            "user_name": user_name,
            "user_email": user_email,
            "company": user_company,
            "location": user_location,
            "size": user_size,
            "industry": user_industry,
            "persona": submission.persona,
            "role": submission.role,
            "sector": submission.sector,
            "answers": [a.model_dump() for a in submission.answers],
            "scores": scores,
            "insights": None,  # Will be generated in background
            "benchmarks": benchmark_data,
            "roadmap": None,
            "submitted_at": datetime.now(timezone.utc).isoformat(),
        }

        _, doc_ref = (
            db.collection("users")
            .document(submission.uid)
            .collection("surveys")
            .add(survey_data)
        )

        db.collection("surveys").document(doc_ref.id).set(survey_data)
        
        # Generate insights in background (this takes 2-5 seconds)
        background_tasks.add_task(generate_insights_background, doc_ref.id, submission.uid, submission.persona, submission.role, submission.sector, scores)
        background_tasks.add_task(update_benchmark_aggregates, submission.role, submission.sector, scores)

        return {
            "status": "ok",
            "survey_id": doc_ref.id,
            "scores": scores,
            "insights": None,  # Frontend will show loading state
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/survey/{survey_id}")
async def get_survey(survey_id: str):
    try:
        db = get_db()
        doc_ref = db.collection("surveys").document(survey_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Survey not found")
            
        return doc.to_dict()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class SendReportRequest(BaseModel):
    uid: str
    persona: str
    role: str
    scores: dict
    insights: dict | None = None
    roadmap: dict | None = None
    answers: list | None = None


@router.post("/survey/send-report")
async def send_report(req: SendReportRequest, background_tasks: BackgroundTasks):
    try:
        db = get_db()
        user_doc = db.collection("users").document(req.uid).get()
        user_data = user_doc.to_dict() if user_doc.exists else {}

        user_name = user_data.get("name", "Participant")
        user_email = user_data.get("email", "")

        if not user_email:
            raise HTTPException(status_code=400, detail="User email not found")

        composite_score = req.scores.get("composite_score", 0)

        db.collection("diagnostic_reports").add({
            "uid": req.uid,
            "user_name": user_name,
            "user_email": user_email,
            "persona": req.persona,
            "role": req.role,
            "composite_score": composite_score,
            "stage": _get_stage(composite_score),
            "scores": req.scores,
            "insights": req.insights,
            "roadmap": req.roadmap,
            "answers": req.answers,
            "requested_at": datetime.now(timezone.utc).isoformat(),
        })

        background_tasks.add_task(
            send_survey_completion_emails,
            user_name=user_name,
            user_email=user_email,
            persona=req.persona,
            role=req.role,
            composite_score=composite_score,
            dimensions=req.scores.get("dimensions", []),
            insights=req.insights,
            roadmap=req.roadmap,
            answers=req.answers,
        )

        return {"status": "ok", "message": "Report email queued"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))