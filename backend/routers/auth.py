from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text
from database.base import get_db
from database.models import User
from datetime import datetime
from typing import Optional
from utils.firebase_admin import firebase_auth

router = APIRouter(prefix="/auth", tags=["auth"])

# --- Schemas ---
class RegisterRequest(BaseModel):
    id_token: str  # Firebase ID token

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    created_at: datetime

# --- Firebase token verification ---
def verify_firebase_token(id_token: str):
    try:
        decoded_token = firebase_auth.verify_id_token(id_token)
        return {
            "uid": decoded_token["uid"],
            "email": decoded_token.get("email"),
            "displayName": decoded_token.get("name", "")
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

def row_to_dict(row):
    d = dict(row._mapping)
    if "id" in d and not isinstance(d["id"], str):
        d["id"] = str(d["id"])
    return d

@router.post("/register", response_model=UserResponse, status_code=201)
def register_user(req: RegisterRequest, db: Session = Depends(get_db)):
    firebase_user = verify_firebase_token(req.id_token)
    user = db.execute(
        text("SELECT * FROM users WHERE email = :email"),
        {"email": firebase_user["email"]}
    ).fetchone()
    if user:
        return row_to_dict(user)
    # Create new user
    full_name = firebase_user["displayName"] or firebase_user["email"]
    result = db.execute(
        text("""
        INSERT INTO users (email, full_name, role, created_at, updated_at)
        VALUES (:email, :full_name, :role, now(), now())
        RETURNING id, email, full_name, role, created_at
        """),
        {
            "email": firebase_user["email"],
            "full_name": full_name,
            "role": "student"
        }
    )
    db.commit()
    row = result.fetchone()
    if row:
        return row_to_dict(row)

@router.post("/login", response_model=UserResponse)
def login_user(req: RegisterRequest, db: Session = Depends(get_db)):
    firebase_user = verify_firebase_token(req.id_token)
    user = db.execute(
        text("SELECT id, email, full_name, role, created_at FROM users WHERE email = :email"),
        {"email": firebase_user["email"]}
    ).fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return row_to_dict(user)
