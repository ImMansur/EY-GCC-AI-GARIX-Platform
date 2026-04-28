from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional
from firebase_admin import auth as firebase_auth
from app.firebase import get_db

router = APIRouter()

def verify_specialist_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    id_token = authorization.split(" ", 1)[1]
    try:
        db = get_db()
        decoded = firebase_auth.verify_id_token(id_token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    uid = decoded.get("uid", "")
    try:
        doc = db.collection("users").document(uid).get()
        role = doc.to_dict().get("role", "") if doc.exists else ""
    except Exception:
        role = ""
    if role != "specialist":
        raise HTTPException(status_code=403, detail="Not authorized as specialist")
    return decoded

@router.post("/specialist/verify")
async def specialist_verify(decoded=Depends(verify_specialist_token)):
    return {"status": "ok", "email": decoded.get("email")}