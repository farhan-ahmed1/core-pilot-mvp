from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database.base import get_db
from routers.auth import router as auth_router
from routers.courses import router as courses_router

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev: allow all origins to fix CORS policy errors
    allow_credentials=False,  # no cookies used, so disable credentials
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(courses_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI application!"}

@app.get("/health/db")
def health_db(db: Session = Depends(get_db)):
    try:
        db.execute("SELECT 1")
        return {"db": "ok"}
    except Exception:
        raise HTTPException(status_code=503, detail="DB connection failed")