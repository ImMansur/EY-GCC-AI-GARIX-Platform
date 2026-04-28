import os
import firebase_admin
from firebase_admin import credentials, firestore

def _init_firebase():
    if not firebase_admin._apps:
        cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "")
        if not cred_path:
            raise RuntimeError("GOOGLE_APPLICATION_CREDENTIALS not set in .env")
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)

_init_firebase()

def get_db():
    return firestore.client()