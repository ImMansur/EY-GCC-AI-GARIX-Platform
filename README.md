# EY GCC AI Realized Index — AI-Powered Survey Platform

A full-stack AI survey application that assesses organizational readiness using intelligent questionnaires, generates diagnostic results, and produces personalized roadmaps. Built with **React + TypeScript** on the frontend and **FastAPI + Python** on the backend, powered by **Azure OpenAI** and **Firebase**.

## Tech Stack

| Layer    | Technology                                                    |
| -------- | ------------------------------------------------------------- |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Recharts |
| Backend  | Python, FastAPI, Uvicorn                                      |
| AI       | Azure OpenAI                                                  |
| Auth/DB  | Firebase (Authentication + Firestore)                         |
| Storage  | Azure Blob Storage                                            |
| Reports  | ReportLab (PDF generation)                                    |

## Project Structure

```
├── package.json          # Root scripts (dev, build, install)
├── frontend/             # React SPA
│   ├── src/
│   │   ├── pages/        # Route pages (Survey, Results, Roadmap, Admin…)
│   │   ├── components/   # UI components (shadcn/ui)
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Firebase config, utilities
│   └── ...
├── backend/              # FastAPI API server
│   └── app/
│       ├── main.py       # App entry point & middleware
│       ├── dimensions.py # Survey dimension definitions
│       ├── firebase.py   # Firebase Admin SDK setup
│       └── routes/       # API route handlers
│           ├── admin.py
│           ├── firebase.py
│           ├── specialist.py
│           └── ...
└── ...
```

## Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.10
- **Firebase** project with Firestore & Authentication enabled
- **Azure OpenAI** deployment
- **Azure Blob Storage** account (for report storage)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ImMansur/EY-GCC-AI-GARIX-Platform.git
cd EY-GCC-AI-GARIX-Platform
```

### 2. Set up environment variables

Copy the example files and fill in your credentials:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**Backend** (`backend/.env`):
```
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_DEPLOYMENT=
AZURE_OPENAI_API_VERSION=
GOOGLE_APPLICATION_CREDENTIALS=
SMTP_EMAIL=
SMTP_PASSWORD=
ADMIN_EMAIL=
AZURE_STORAGE_CONNECTION_STRING=
BLOB_CONTAINER_NAME=gcc-ai
```

**Frontend** (`frontend/.env`):
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

### 3. Place your Firebase Admin SDK key

Download your service account key from the Firebase Console and save it as:

```
backend/serviceAccountKey.json
```

### 4. Install dependencies

```bash
npm run install:all
```

Or manually:

```bash
cd frontend && npm install
cd ../backend && pip install -r requirements.txt
```

### 5. Run the development servers

From the project root:

```bash
# Frontend (port 8080)
npm run dev:frontend

# Backend (port 8000)
npm run dev:backend
```

> **Note:** The `install:all`, `dev:frontend`, and `dev:backend` scripts are defined in the root `package.json` for convenience. Make sure your `package.json` includes these scripts to streamline setup and development.

## API Endpoints

| Method | Endpoint        | Description             |
| ------ | --------------- | ----------------------- |
| GET    | `/api/health`   | Health check            |
| *      | `/api/questions` | Survey questions        |
| *      | `/api/surveys`   | Survey submissions      |
| *      | `/api/users`     | User management         |
| *      | `/api/roadmap`   | AI-generated roadmaps   |
| *      | `/api/admin`     | Admin operations        |
| *      | `/api/diagnostic`| Diagnostic analysis     |

## Scripts

| Command                | Description                        |
| ---------------------- | ---------------------------------- |
| `npm run dev:frontend` | Start frontend dev server          |
| `npm run dev:backend`  | Start backend with hot reload      |
| `npm run build:frontend` | Build frontend for production    |
| `npm run install:all`  | Install all dependencies           |

## License

This project is private.
