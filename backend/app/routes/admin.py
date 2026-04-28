import os
from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional
from firebase_admin import auth as firebase_auth
from app.firebase import get_db

router = APIRouter()

def verify_admin_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    id_token = authorization.split(" ", 1)[1]
    try:
        db = get_db()
        decoded = firebase_auth.verify_id_token(id_token)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    uid = decoded.get("uid", "")
    try:
        doc = db.collection("users").document(uid).get()
        role = doc.to_dict().get("role", "") if doc.exists else ""
    except Exception:
        role = ""
    if role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized as admin")
    return decoded

@router.post("/admin/verify")
async def admin_verify(decoded=Depends(verify_admin_token)):
    return {"status": "ok", "email": decoded.get("email")}