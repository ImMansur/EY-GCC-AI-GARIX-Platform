import os
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from azure.storage.blob import BlobServiceClient

# Load env
load_dotenv()

# Routers
from app.routes import admin, specialist, surveys, benchmarks

# Utils
from generate_questions import generate_questions

# -------------------- APP INIT --------------------
app = FastAPI(title="GARIX Backend")

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://192.168.1.47:8080",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- ROUTES --------------------
app.include_router(admin.router, prefix="/api")
app.include_router(specialist.router, prefix="/api")
app.include_router(surveys.router, prefix="/api")
app.include_router(benchmarks.router, prefix="/api")

@app.get("/")
def root():
    return {"status": "GARIX backend running"}

# -------------------- AZURE BLOB SETUP --------------------
CONTAINER_NAME = "full-version"

blob_service_client = BlobServiceClient(
    account_url=os.getenv("AZURE_STORAGE_SAS_URL")
)

# -------------------- REQUEST MODEL --------------------
class AssessmentRequest(BaseModel):
    persona: str
    role: str

# -------------------- HELPERS --------------------
def get_blob_name(persona: str, role: str) -> str:
    persona_folder = persona.replace(" ", "_").replace("/", "-")
    role_file = role.replace(" ", "_").replace("/", "-")
    return f"questions/{persona_folder}/{role_file}.json"

def read_from_blob(blob_name: str):
    try:
        blob_client = blob_service_client.get_blob_client(
            container=CONTAINER_NAME,
            blob=blob_name
        )
        data = blob_client.download_blob().readall()
        return json.loads(data)
    except Exception:
        return None

def write_to_blob(blob_name: str, data: dict):
    blob_client = blob_service_client.get_blob_client(
        container=CONTAINER_NAME,
        blob=blob_name
    )
    blob_client.upload_blob(json.dumps(data), overwrite=True)

# -------------------- MAIN API --------------------
@app.post("/generate-questions")
def get_questions(req: AssessmentRequest):
    blob_name = get_blob_name(req.persona, req.role)

    # Check cache
    cached = read_from_blob(blob_name)
    if cached:
        print(f"✅ Blob cache hit: {blob_name}")
        return cached

    # Generate
    print(f"🔄 Generating for {req.persona} / {req.role}...")
    questions = generate_questions(req.persona, req.role)
    data = {"questions": questions}

    # Save
    write_to_blob(blob_name, data)
    print(f"✅ Saved to blob: {blob_name}")

    return data