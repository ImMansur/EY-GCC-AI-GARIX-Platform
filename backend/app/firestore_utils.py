from datetime import datetime, timezone
from app.firebase import get_db

def update_survey_record(survey_id: str, uid: str, update_data: dict):
    """
    Cleaner way to update survey data in both the global 'surveys' 
    collection and the user's private sub-collection.
    """
    try:
        db = get_db()
        # Ensure we don't overwrite the whole doc, just update fields
        db.collection("surveys").document(survey_id).update(update_data)
        
        if uid and uid != "anon":
            db.collection("users").document(uid).collection("surveys").document(survey_id).update(update_data)
        return True
    except Exception as e:
        print(f"Firestore Update Error [{survey_id}]: {e}")
        return False

def create_survey_record(uid: str, survey_data: dict) -> str:
    """
    Creates a consistent survey record across both required collections.
    Returns the newly generated survey_id.
    """
    db = get_db()
    
    # Ensure timestamps are present
    if "submitted_at" not in survey_data:
        survey_data["submitted_at"] = datetime.now(timezone.utc).isoformat()

    # 1. Create in users/{uid}/surveys first to get the auto-ID
    user_surveys_ref = db.collection("users").document(uid).collection("surveys")
    _, doc_ref = user_surveys_ref.add(survey_data)
    survey_id = doc_ref.id

    # 2. Sync to global surveys/{id} using the EXACT SAME ID
    db.collection("surveys").document(survey_id).set(survey_data)
    
    return survey_id

def save_roadmap_record(survey_id: str, uid: str, roadmap_data: dict):
    """
    Saves the roadmap to its own dedicated collection 'roadmaps' 
    rather than nesting it inside the survey document.
    """
    try:
        db = get_db()
        payload = {
            "survey_id": survey_id,
            "uid": uid,
            "data": roadmap_data,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        # Use survey_id as the doc ID for easy 1:1 mapping
        db.collection("roadmaps").document(survey_id).set(payload)
        return True
    except Exception as e:
        print(f"Firestore Roadmap Save Error [{survey_id}]: {e}")
        return False
