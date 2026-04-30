import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

def _init_firebase():
    if not firebase_admin._apps:
        # Try loading from env variable as JSON string first (for serverless)
        cred_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY", "")
        if cred_json:
            cred_dict = json.loads(cred_json)
            cred = credentials.Certificate(cred_dict)
        else:
            # Fallback to file path (for local development)
            cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "")
            if not cred_path:
                raise RuntimeError("FIREBASE_SERVICE_ACCOUNT_KEY or GOOGLE_APPLICATION_CREDENTIALS must be set")
            cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)

_init_firebase()

def get_db():
    return firestore.client()