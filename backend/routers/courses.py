# FastAPI router for FRE-1.3 Courses CRUD - Completely rebuilt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database.base import get_db
from schemas.course import CourseCreate, CourseUpdate, CourseResponse
from crud.course import get_courses, get_course_by_id, create_course, update_course, delete_course
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/courses", tags=["courses"])

# --- Dummy user auth for Sprint 0 ---
def get_current_user_id():
    # In Sprint 0, always return user_id=1
    return 1

@router.get("/", response_model=List[CourseResponse])
def list_courses(db: Session = Depends(get_db)):
    """Get all courses for the authenticated user"""
    try:
        user_id = get_current_user_id()  # For Sprint 0
        courses = get_courses(db, user_id=None)  # Get all courses for now
        logger.info(f"Retrieved {len(courses)} courses")
        return courses
    except Exception as e:
        logger.error(f"Error listing courses: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve courses"
        )

@router.post("/", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def create_new_course(course: CourseCreate, db: Session = Depends(get_db)):
    """Create a new course"""
    try:
        user_id = get_current_user_id()  # For Sprint 0
        logger.info(f"Creating course: {course.name} for term: {course.term}")
        
        db_course = create_course(db, course, user_id=None)  # No user association for Sprint 0
        logger.info(f"Successfully created course with ID: {db_course.id}")
        return db_course
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating course: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create course"
        )

@router.get("/{course_id}", response_model=CourseResponse)
def get_course(course_id: int, db: Session = Depends(get_db)):
    """Get a specific course by ID"""
    try:
        course = get_course_by_id(db, course_id)
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found"
            )
        return course
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving course {course_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve course"
        )

@router.put("/{course_id}", response_model=CourseResponse)
def update_existing_course(course_id: int, course_update: CourseUpdate, db: Session = Depends(get_db)):
    """Update an existing course"""
    try:
        logger.info(f"Updating course {course_id}")
        updated_course = update_course(db, course_id, course_update)
        if not updated_course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found"
            )
        logger.info(f"Successfully updated course {course_id}")
        return updated_course
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating course {course_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update course"
        )

@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_course(course_id: int, db: Session = Depends(get_db)):
    """Delete a course"""
    try:
        logger.info(f"Deleting course {course_id}")
        success = delete_course(db, course_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found"
            )
        logger.info(f"Successfully deleted course {course_id}")
        return None
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting course {course_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete course"
        )
