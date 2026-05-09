STAGE_THRESHOLDS = {
    "AI Aware": {"min": 1.0, "max": 1.9},
    "AI Embedded": {"min": 2.0, "max": 2.9},
    "AI Scaled": {"min": 3.0, "max": 3.9},
    "AI Native": {"min": 4.0, "max": 4.4},
    "AI Realized": {"min": 4.5, "max": 5.0}
}

def get_stage_name(score: float) -> str:
    if score < 2.0: return "AI Aware"
    elif score < 3.0: return "AI Embedded"
    elif score < 4.0: return "AI Scaled"
    elif score < 4.5: return "AI Native"
    else: return "AI Realized"

def get_next_stage_name(score: float) -> str | None:
    current = get_stage_name(score)
    stages = list(STAGE_THRESHOLDS.keys())
    try:
        idx = stages.index(current)
        if idx < len(stages) - 1:
            return stages[idx + 1]
    except ValueError:
        pass
    return None

def validate_transformation_feasibility(current_score: float, target_stage: str, duration_months: int) -> dict:
    if target_stage not in STAGE_THRESHOLDS:
        return {"is_valid": False, "feasibility_status": "Invalid Stage"}

    target_min_req = STAGE_THRESHOLDS[target_stage]["min"]
    headroom = 5.0 - current_score
    
    # Roadmap Guardrail: If headroom is very low (<0.5), 3 months is often too short for meaningful shift
    if headroom <= 0.5 and duration_months == 3:
        return {"is_valid": False, "feasibility_status": "Too Short", "target_min": current_score, "target_max": current_score, "required_score": target_min_req}

    time_factor = duration_months / 12.0
    
    # Standard EY Feasibility Formula (Matches Roadmap.tsx)
    capture_conservative = 0.45 * (time_factor ** 0.65)
    capture_optimistic = 0.65 * (time_factor ** 0.55)
    
    target_min = round(min(5.0, current_score + (headroom * capture_conservative)), 1)
    target_max = round(min(5.0, current_score + (headroom * capture_optimistic)), 1)
    
    rounded_score = round(current_score, 1)
    if target_min <= rounded_score:
        target_min = min(5.0, rounded_score + 0.1)
    if target_max <= target_min:
        target_max = target_min

    if current_score >= target_min_req:
        feasibility = "Maintenance"
    elif target_max >= target_min_req:
        feasibility = "Achievable"
    else:
        feasibility = "Impossible"

    return {
        "is_valid": feasibility in ["Achievable", "Maintenance"],
        "feasibility_status": feasibility,
        "target_min": target_min,
        "target_max": target_max,
        "required_score": target_min_req
    }

def estimate_months_to_stage(current_score: float, target_stage: str) -> int | str:
    """Calculates the minimum months (3, 6, 9, 12) to reach a stage."""
    target_min_req = STAGE_THRESHOLDS.get(target_stage, {}).get("min", 5.1)
    if current_score >= target_min_req:
        return 0
        
    for months in [3, 6, 9, 12]:
        feas = validate_transformation_feasibility(current_score, target_stage, months)
        if feas["feasibility_status"] == "Achievable":
            return months
            
    return "12+" # If not achievable in 12 months

def get_transformation_summary(current_score: float) -> dict:
    """Returns a summary of months to reach all future stages, prioritized like the roadmap."""
    stages = list(STAGE_THRESHOLDS.keys())
    current_stage_name = get_stage_name(current_score)
    current_idx = stages.index(current_stage_name)
    
    # 1. Calculate all achievable targets
    future_stages = []
    for i in range(current_idx + 1, len(stages)):
        stage_name = stages[i]
        months = estimate_months_to_stage(current_score, stage_name)
        future_stages.append({
            "stage": stage_name,
            "months": months,
            "score_required": STAGE_THRESHOLDS[stage_name]["min"]
        })
    
    # 2. Pick the 'Best Suggestion' (Shortest duration that hits the highest possible stage)
    # This matches the Roadmap's targetOptions logic.
    next_stage = None
    for months in [3, 6, 9, 12]:
        # For this month, what is the best stage we can hit?
        best_stage_for_this_month = None
        for i in range(len(stages) - 1, current_idx, -1):
            s_name = stages[i]
            feas = validate_transformation_feasibility(current_score, s_name, months)
            if feas["feasibility_status"] == "Achievable":
                best_stage_for_this_month = {
                    "stage": s_name,
                    "months": months,
                    "score_required": STAGE_THRESHOLDS[s_name]["min"]
                }
                break
        
        if best_stage_for_this_month:
            next_stage = best_stage_for_this_month
            break
    
    return {
        "current_stage": current_stage_name,
        "next_stage": next_stage,
        "all_targets": future_stages
    }
