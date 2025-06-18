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

class UserProfileResponse(BaseModel):
    id: str
    email: str
    full_name: str
    photo_url: Optional[str] = None
    created_at: datetime

class UserProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    photo_url: Optional[str] = None

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

@router.get("/profile", response_model=UserProfileResponse)
def get_profile(request: Request, db: Session = Depends(get_db)):
    # Assume user is authenticated and email is in request.state.user_email
    # For Sprint 0, stub: get first user
    user = db.execute(text("SELECT id, email, full_name, photo_url, created_at FROM users LIMIT 1")).fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return row_to_dict(user)

@router.put("/profile", response_model=UserProfileResponse)
def update_profile(update: UserProfileUpdateRequest, db: Session = Depends(get_db)):
    # For Sprint 0, update first user only
    user = db.execute(text("SELECT id FROM users LIMIT 1")).fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    update_fields = []
    params = {"id": user.id}
    if update.full_name is not None:
        update_fields.append("full_name = :full_name")
        params["full_name"] = update.full_name
    if update.photo_url is not None:
        update_fields.append("photo_url = :photo_url")
        params["photo_url"] = update.photo_url
    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update")
    db.execute(text(f"UPDATE users SET {', '.join(update_fields)}, updated_at = now() WHERE id = :id"), params)
    db.commit()
    user = db.execute(text("SELECT id, email, full_name, photo_url, created_at FROM users WHERE id = :id"), {"id": user.id}).fetchone()
    return row_to_dict(user)
