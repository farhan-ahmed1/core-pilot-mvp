from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.base import get_db
from database.models import User, Course, Assignment
from datetime import datetime
from typing import Optional
from utils.firebase_admin import firebase_auth
from utils.auth_middleware import get_current_user
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])

# --- Schemas ---
class RegisterRequest(BaseModel):
    # No fields needed - we'll extract user info from the Authorization header
    pass

class UserResponse(BaseModel):
    id: int  # Changed from str to int to match database
    email: str
    full_name: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserProfileResponse(BaseModel):
    id: int  # Changed from str to int
    email: str
    full_name: str
    photo_url: Optional[str] = None
    created_at: datetime
    last_login: Optional[datetime] = None
    courses_count: Optional[int] = 0
    assignments_count: Optional[int] = 0
    verified: Optional[bool] = True
    
    class Config:
        from_attributes = True

class UserProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    photo_url: Optional[str] = None

# --- Firebase token verification ---
async def verify_firebase_token_from_header(request: Request):
    """Extract and verify Firebase token from Authorization header"""
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing or invalid Authorization header"
            )
        
        token = auth_header.split(" ")[1]
        decoded_token = firebase_auth.verify_id_token(token)
        
        return {
            "uid": decoded_token["uid"],
            "email": decoded_token.get("email"),
            "name": decoded_token.get("name", ""),
            "picture": decoded_token.get("picture")
        }
    except Exception as e:
        logger.error(f"Firebase token verification failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token"
        )

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(request: Request, db: Session = Depends(get_db)):
    """Register or login user using Firebase authentication"""
    try:
        # Verify Firebase token and get user info
        firebase_user = await verify_firebase_token_from_header(request)
        
        logger.info(f"Registering/logging in user: {firebase_user['email']}")
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == firebase_user["email"]).first()
        
        if existing_user:
            # Update last login time
            existing_user.last_login = datetime.utcnow()
            db.commit()
            db.refresh(existing_user)
            logger.info(f"User {firebase_user['email']} logged in successfully")
            return existing_user
        
        # Create new user using SQLAlchemy ORM
        full_name = firebase_user.get("name") or firebase_user["email"].split("@")[0]
        
        new_user = User(
            email=firebase_user["email"],
            full_name=full_name,
            photo_url=firebase_user.get("picture"),
            created_at=datetime.utcnow(),
            last_login=datetime.utcnow(),
            is_active=True
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        logger.info(f"New user {firebase_user['email']} registered successfully with ID: {new_user.id}")
        return new_user
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Registration/login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to register/login user"
        )

@router.get("/profile", response_model=UserProfileResponse)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user profile with enhanced statistics"""
    try:
        logger.info(f"Getting profile for user {current_user.id}")
        
        # Get user statistics
        courses_count = db.query(Course).filter(Course.user_id == current_user.id).count()
        
        assignments_count = db.query(Assignment).join(Course).filter(
            Course.user_id == current_user.id
        ).count()
        
        return UserProfileResponse(
            id=current_user.id,
            email=current_user.email,
            full_name=current_user.full_name,
            photo_url=current_user.photo_url,
            created_at=current_user.created_at,
            last_login=current_user.last_login,
            courses_count=courses_count,
            assignments_count=assignments_count,
            verified=True  # Since they're authenticated via Firebase
        )
    except Exception as e:
        logger.error(f"Error getting profile for user {current_user.id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve profile"
        )

@router.put("/profile", response_model=UserProfileResponse)
def update_profile(
    update_data: UserProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user profile"""
    try:
        logger.info(f"Updating profile for user {current_user.id}")
        
        # Update user fields if provided
        if update_data.full_name is not None:
            current_user.full_name = update_data.full_name
        if update_data.photo_url is not None:
            current_user.photo_url = update_data.photo_url
        
        # Update timestamp
        current_user.updated_at = datetime.utcnow()
        
        # Save changes
        db.commit()
        db.refresh(current_user)
        
        # Get updated statistics
        courses_count = db.query(Course).filter(Course.user_id == current_user.id).count()
        assignments_count = db.query(Assignment).join(Course).filter(
            Course.user_id == current_user.id
        ).count()
        
        logger.info(f"Profile updated successfully for user {current_user.id}")
        
        return UserProfileResponse(
            id=current_user.id,
            email=current_user.email,
            full_name=current_user.full_name,
            photo_url=current_user.photo_url,
            created_at=current_user.created_at,
            last_login=current_user.last_login,
            courses_count=courses_count,
            assignments_count=assignments_count,
            verified=True
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating profile for user {current_user.id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile"
        )
