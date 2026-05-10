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
from app.firestore_utils import update_survey_record, create_survey_record
from app.transformation import get_transformation_summary
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
    session_id: Optional[str] = None  # If set, merge pre-computed insights from session cache


class DimensionProcessRequest(BaseModel):
    uid: str
    session_id: str
    persona: str
    role: str
    sector: str
    dimension_id: int
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

def generate_insights(persona: str, role: str, sector: str, scores: dict, only_dimension_ids: list[str] = None) -> dict:
    benchmark_data = compute_benchmark(role, sector)
    
    dims_data = []
    for d in scores.get("dimensions", []):
        dim_id_str = str(d['dimension_id'])
        if only_dimension_ids and dim_id_str not in only_dimension_ids:
            continue
            
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




def generate_insights_background(survey_id: str, uid: str, persona: str, role: str, sector: str, scores: dict, existing_insights: dict = None):
    """Background task to generate insights after survey submission.
    Only generates missing insights if existing_insights is provided.
    """
    try:
        db = get_db()
        
        all_dim_ids = [str(d["dimension_id"]) for d in scores.get("dimensions", [])]
        existing_keys = set(existing_insights.keys()) if existing_insights else set()
        missing_keys = [k for k in all_dim_ids if k not in existing_keys]

        if not missing_keys and existing_insights:
            print(f"✅ All insights already present for survey {survey_id}")
            return

        print(f"🔄 Generating insights for missing dimensions: {missing_keys}")
        new_insights = generate_insights(persona, role, sector, scores, only_dimension_ids=missing_keys)
        
        # Merge with existing
        final_insights = existing_insights.copy() if existing_insights else {}
        final_insights.update(new_insights)
        
        # Update both collections via helper
        update_survey_record(survey_id, uid, {"insights": final_insights})
        print(f"✅ Background insights complete for survey {survey_id}")
    except Exception as e:
        print(f"Error generating insights in background: {e}")


def generate_dimension_insights_background(session_id: str, uid: str, persona: str, role: str, sector: str, dimension_id: int, answers: list):
    """Pre-compute and cache insights for a single dimension directly in the surveys collection."""
    try:
        db = get_db()
        # Convert raw dicts back to AnswerItem objects for scoring
        answer_items = [AnswerItem(**a) if isinstance(a, dict) else a for a in answers]
        dim_scores = compute_scores(answer_items)

        # Generate insights only for this dimension
        dim_insight = generate_insights(persona, role, sector, dim_scores)

        # Write directly to the surveys collection with session_id as doc_id
        # Mark as draft so it doesn't show in dashboard until submitted
        survey_ref = db.collection("surveys").document(session_id)
        dim_key = str(dimension_id)
        
        dim_data = next((d for d in dim_scores["dimensions"] if d["dimension_id"] == dimension_id), {})
        
        survey_ref.set(
            {
                "uid": uid,
                "status": "draft",
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "insights": {dim_key: dim_insight.get(dim_key, {})},
                "partial_scores": {dim_key: dim_data},
            },
            merge=True,
        )
        print(f"✅ Pre-computed insights for dimension {dimension_id} in surveys/{session_id}")
    except Exception as e:
        print(f"Error pre-computing dimension {dimension_id} insights: {e}")

@router.post("/survey/process-dimension")
async def process_dimension(req: DimensionProcessRequest, background_tasks: BackgroundTasks):
    """Start background pre-computation of insights for a completed dimension."""
    background_tasks.add_task(
        generate_dimension_insights_background,
        req.session_id,
        req.uid,
        req.persona,
        req.role,
        req.sector,
        req.dimension_id,
        [a.model_dump() for a in req.answers],
    )
    return {"status": "processing", "dimension_id": req.dimension_id}


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

        # ── Try to reuse pre-computed insights from draft document ──────────────
        merged_insights: dict = {}
        if submission.session_id:
            try:
                session_doc = db.collection("surveys").document(submission.session_id).get()
                if session_doc.exists:
                    session_data = session_doc.to_dict() or {}
                    merged_insights = session_data.get("insights", {})
                    print(f"♻️  Reusing {len(merged_insights)} pre-computed dimension insights from draft {submission.session_id}")
            except Exception as e:
                print(f"Warning: could not read draft cache: {e}")

        # Determine which dimensions still need insights (the last one + any not cached)
        all_dim_ids = {str(d["dimension_id"]) for d in scores["dimensions"]}
        missing_dims = all_dim_ids - set(merged_insights.keys())

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
            "insights": merged_insights if merged_insights else None,
            "benchmarks": benchmark_data,
            "roadmap": None,
            "submitted_at": datetime.now(timezone.utc).isoformat(),
            "status": "completed"
        }

        # 3. Use session_id as the final survey_id if provided, otherwise generate one
        survey_id = submission.session_id if submission.session_id else "survey_" + datetime.now().strftime("%y%m%d%H%M") + submission.uid[:4]
        
        # Save/Sync to both required locations
        db.collection("surveys").document(survey_id).set(survey_data)
        if submission.uid and submission.uid != "anon":
            db.collection("users").document(submission.uid).collection("surveys").document(survey_id).set(survey_data)

        if missing_dims:
            # Only regenerate insights for dimensions not yet cached (incl. last dimension)
            print(f"🔄 Generating insights for {len(missing_dims)} uncached dimensions in background")
            background_tasks.add_task(
                generate_insights_background,
                survey_id, submission.uid, submission.persona, submission.role, submission.sector, scores, merged_insights
            )
        else:
            # All dimensions already have insights – still update to ensure Firestore is in sync
            background_tasks.add_task(
                generate_insights_background,
                survey_id, submission.uid, submission.persona, submission.role, submission.sector, scores, merged_insights
            )




        return {
            "status": "ok",
            "survey_id": survey_id,
            "scores": scores,
            "insights": merged_insights if merged_insights else None,
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
            
        data = doc.to_dict()

        # ── Fetch roadmap from its own dedicated collection ──────────────
        try:
            roadmap_doc = db.collection("roadmaps").document(survey_id).get()
            if roadmap_doc.exists:
                roadmap_payload = roadmap_doc.to_dict()
                # The actual roadmap JSON is stored in the 'data' field of the roadmap doc
                data["roadmap"] = roadmap_payload.get("data")
        except Exception as e:
            print(f"Warning: could not fetch separate roadmap doc: {e}")

        # ── Add Transformation Summary for Dashboard ──────────────
        try:
            composite_score = data.get("scores", {}).get("composite_score", 0)
            if composite_score > 0:
                data["transformation_summary"] = get_transformation_summary(composite_score)
        except Exception as e:
            print(f"Warning: could not generate transformation summary: {e}")

        return data
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