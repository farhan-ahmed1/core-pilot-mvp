# Core Pilot MVP

An AI-enhanced educational platform for assignment management, feedback, and course organization.

## Overview
Core Pilot helps students and educators manage courses, assignments, and receive AI-powered feedback. The MVP implements authentication, course/assignment CRUD, AI breakdowns, and draft feedback using modern web and cloud technologies.

## Tech Stack
- **Frontend:** React (TypeScript), Material UI, React Router v6, Axios, Firebase Auth
- **Backend:** FastAPI (Python 3.11+), Pydantic, SQLAlchemy, Alembic, PostgreSQL, Firebase Admin SDK, OpenAI API
- **Infrastructure:** Docker, Docker Compose, GitHub Actions, environment variables for secrets

## Key Features (Sprint 0)
- User authentication (Firebase Auth)
- Course and assignment CRUD endpoints
- AI-powered assignment breakdown and feedback (OpenAI GPT-4)
- Draft editor and versioning
- Dashboard for courses and assignments
- Secure, modular backend with CORS and token verification

## Folder Structure
```
core-pilot-mvp/
├── backend/         # FastAPI app, routers, models, schemas, utils
├── frontend/        # React app, components, pages, services
├── infra/           # Infrastructure as code (Terraform, etc.)
├── docker-compose.yml
├── README.md
└── ...
```

## Getting Started
### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose

### Local Development
1. **Backend:**
   ```sh
   cd backend
   python -m venv venv && source venv/bin/activate
   pip install -r requirements.txt -r requirements-dev.txt
   uvicorn main:app --reload
   ```
2. **Frontend:**
   ```sh
   cd frontend
   npm install
   npm run dev
   ```
3. **Docker Compose:**
   ```sh
   docker-compose up --build
   ```

### Environment Variables
- Copy `.env.example` to `.env` in both backend and frontend, and fill in secrets as needed.

## CI/CD
- Linting and build checks via GitHub Actions for both backend (flake8, mypy) and frontend (eslint, prettier, build).

## Contribution & Best Practices
- Follow PEP 8 (Python) and TypeScript strict mode
- Use Material UI for all React UI
- Store secrets in `.env` (never commit secrets)
- Organize code by feature/module as per project structure
- See `.github/copilot/copilot_instructions.md` for detailed guidelines

---

© 2025 Core Pilot Team