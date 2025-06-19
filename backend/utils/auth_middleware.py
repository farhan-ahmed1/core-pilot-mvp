"""
Authentication middleware for extracting current user from Firebase JWT tokens
Implements NFRE-4.1: All API endpoints must require Firebase JWT authentication
"""
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database.base import get_db
from database.models import User
from utils.firebase_admin import firebase_auth
from typing import Optional
import logging

logger = logging.getLogger(__name__)

# HTTP Bearer token scheme
security = HTTPBearer()

async def verify_firebase_token(token: str) -> dict:
    """
    Verify Firebase ID token and return user info
    """
    try:
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
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"}
        )

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current authenticated user from Firebase JWT token
    This replaces the dummy get_current_user_id() function
    """
    try:
        # Verify the Firebase token
        firebase_user = await verify_firebase_token(credentials.credentials)
        
        # Find user in database by email
        user = db.query(User).filter(User.email == firebase_user["email"]).first()
        
        if not user:
            logger.error(f"User not found in database: {firebase_user['email']}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found. Please register first."
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is disabled"
            )
        
        logger.info(f"Authenticated user: {user.email} (ID: {user.id})")
        return user
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"}
        )

async def get_current_user_id(
    current_user: User = Depends(get_current_user)
) -> int:
    """
    Get current user ID - convenience function for backward compatibility
    """
    return current_user.id

# Optional dependency - for endpoints that can work with or without auth
async def get_current_user_optional(
    request: Request,
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Get current user if authenticated, otherwise return None
    Useful for endpoints that have different behavior for authenticated vs anonymous users
    """
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None
            
        token = auth_header.split(" ")[1]
        firebase_user = await verify_firebase_token(token)
        user = db.query(User).filter(User.email == firebase_user["email"]).first()
        
        return user if user and user.is_active else None
        
    except Exception:
        return None