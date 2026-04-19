# EY GCC AI — GARIX Platform 

**GARIX (GCC AI Readiness Index)** is a proprietary 5-stage diagnostic platform that helps Global Capability Centers (GCCs) assess where they stand on the path to AI maturity — from *AI Aware* to *AI Realized*.

## Overview

The platform enables GCCs to:

- Assess their AI maturity across key dimensions (Strategy, Data, Talent, Governance, Technology)
- Visualize their current stage on the GARIX framework
- Benchmark against industry peers
- Get a tailored roadmap to advance toward AI at scale

## Project Structure

```
EY GCC AI/
├── frontend/       # React frontend application
│   ├── src/
│   │   ├── pages/          # Route pages (Index, Login, Dashboard, Assessment, etc.)
│   │   ├── components/
│   │   │   ├── garix/      # GARIX-specific components (Hero, Framework, Diagnostic, etc.)
│   │   │   ├── ui/         # Reusable UI components (shadcn/ui)
│   │   │   └── dashboard/  # Dashboard visualizations (HeatMap, Radar, Roadmap, etc.)
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
│   └── public/
├── backend/        # Backend application (coming soon)
├── .gitignore
└── README.md
```

## Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** — build tool & dev server
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — component library (Radix UI primitives)
- **React Router** — client-side routing
- **TanStack React Query** — server state management
- **Recharts** — charting & data visualization
- **Vitest** — unit testing

### Backend

*To be added.*

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Bun](https://bun.sh/) or npm

### Run the Frontend

```bash
cd frontend
npm install    # or: bun install
npm run dev    # starts dev server at http://localhost:5173
```

### Other Commands

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run build`   | Production build         |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |
| `npm run test`    | Run tests with Vitest    |

## Pages

| Route          | Description                              |
| -------------- | ---------------------------------------- |
| `/`            | Landing page — GARIX overview & framework |
| `/login`       | User login                               |
| `/signup`      | User registration                        |
| `/onboarding`  | Initial onboarding flow                  |
| `/assessment`  | AI maturity assessment                   |
| `/dashboard`   | Results dashboard with benchmarks        |

## GARIX Framework — 5 Stages

| Stage | Name          | Score   | Summary                              |
| ----- | ------------- | ------- | ------------------------------------ |
| 01    | AI Aware      | 1.0–2.0 | Curious but uncommitted              |
| 02    | AI Embedded   | 2.0–3.0 | Structured & intentional             |
| 03    | AI Scaled     | 3.0–4.0 | Systematic & production-grade        |
| 04    | AI Native     | 4.0–4.5 | AI-first culture & decision-making   |
| 05    | AI Realized   | 4.5–5.0 | Compounding, measurable value at scale |
