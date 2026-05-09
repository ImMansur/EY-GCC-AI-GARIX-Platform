import json
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.firebase import get_db
from app.routes.surveys import get_client, get_deployment
from app.firestore_utils import update_survey_record, save_roadmap_record

router = APIRouter()

from app.transformation import STAGE_THRESHOLDS, get_stage_name, validate_transformation_feasibility

def _build_consulting_prompt(current_stage: str, target_stage: str, duration: int, feasibility: str, target_range: str) -> str:
    return f"""You are a Lead Partner at a top-tier management consulting firm specializing in Enterprise AI Transformation.

TASK:
Develop a {duration}-month target-state transformation roadmap moving a GCC from '{current_stage}' to '{target_stage}'.
Feasibility Assessment: {feasibility.upper()}.

CRITICAL CONSULTING RULES:
1. DEPENDENCY SEQUENCING: Strategy MUST precede Platform/Tech scaling. Data Architecture MUST precede AI Native operations.
2. Provide macro actions across the timeline, but ALSO provide 1 specific tactical initiative for EVERY sub-dimension.

REQUIRED JSON OUTPUT FORMAT:
{{
  "target_range": "{target_range}",
  "path_title": "<A strong consulting title for this specific transformation>",
  "strategic_narrative": "<Executive summary of the journey>",
  "dimension_targets":[
    {{
      "dimension_name": "<name>",
      "current_score": <number>,
      "target_score": <number>,
      "sub_dimensions":[
        {{
          "sub_dimension_name": "<name>",
          "current_score": <number>,
          "target_score": <number>,
          "key_initiative": "<1 highly specific, practical sentence on what action to take to improve this specific sub-dimension>"
        }}
      ]
    }}
  ],
  "actions":[
    {{ "num": 1, "title": "<Short Actionable Title>", "description": "<2-3 sentence strategic description>", "term": "Early-term action" }},
    {{ "num": 2, "title": "...", "description": "...", "term": "Mid-term action" }},
    {{ "num": 3, "title": "...", "description": "...", "term": "Long-term action" }}
  ],
  "phases":[
    {{ "months": "Months 1-X", "title": "<Phase Title>", "bullets":["<milestone 1>", "<milestone 2>"] }}
  ],
  "projected_landing": "<1 paragraph explaining what the organization will look like at the end of this roadmap>"
}}
"""

# --- NEW: Added SubDimension model to capture nested data ---
class SubDimensionScoreItem(BaseModel):
    sub_dimension_id: str
    sub_dimension_name: str
    score: float

class DimensionScoreItem(BaseModel):
    dimension_id: int
    dimension_name: str
    score: float
    sub_dimensions: list[SubDimensionScoreItem] =[]

class FullRoadmapRequest(BaseModel):
    persona: str
    role: str
    composite_score: float
    target_stage: str
    duration_months: int
    dimensions: list[DimensionScoreItem]
    survey_id: Optional[str] = None   # If provided, roadmap is saved to Firestore
    uid: Optional[str] = None         # Required alongside survey_id to update user sub-collection

@router.post("/roadmap/diagnostic/generate")
async def generate_diagnostic_roadmap(req: FullRoadmapRequest):
    try:
        current_stage = get_stage_name(req.composite_score)
        
        # ── Feasibility Validation ──────────────
        try:
            validation = validate_transformation_feasibility(req.composite_score, req.target_stage, req.duration_months)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

        t_min = validation["target_min"]
        t_max = validation["target_max"]
        target_range_str = f"{t_min:.1f}" if t_min == t_max else f"{t_min:.1f} - {t_max:.1f}"

        # Build prompt showing the LLM the exact sub-dimension scores
        dims_data =[]
        for d in req.dimensions:
            sub_str = "\n  ".join([f"- {sd.sub_dimension_name}: {sd.score}/5" for sd in d.sub_dimensions])
            dims_data.append(f"Dimension: {d.dimension_name} ({d.score}/5)\n  Sub-dimensions:\n  {sub_str}")
        dims_summary = "\n\n".join(dims_data)

        system_prompt = _build_consulting_prompt(
            current_stage=current_stage,
            target_stage=req.target_stage,
            duration=req.duration_months,
            feasibility=validation["feasibility_status"],
            target_range=target_range_str
        )

        user_prompt = f"Current Score: {req.composite_score} ({current_stage})\n\nDIMENSION & SUB-DIMENSION SCORES:\n{dims_summary}\n\nGenerate the strict JSON transformation roadmap."

        response = get_client().chat.completions.create(
            model=get_deployment(),
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            max_tokens=3500, # Increased tokens to handle sub-dimension payload
        )

        content = response.choices[0].message.content.strip()
        if content.startswith("```"): content = content.split("\n", 1)[1]
        if content.endswith("```"): content = content[:-3]

        roadmap_json = json.loads(content)
        roadmap_json["target_stage"] = req.target_stage
        roadmap_json["duration"] = req.duration_months

        # ── Persist roadmap to its own dedicated collection ──────────────
        if req.survey_id:
            save_roadmap_record(req.survey_id, req.uid, roadmap_json)

        return {"status": "ok", "validation": validation, "roadmap": roadmap_json}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))