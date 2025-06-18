# CRUD operations for Course management
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from database.models import Course
from schemas.course import CourseCreate, CourseUpdate
from typing import List, Optional

def get_courses(db: Session, user_id: Optional[int] = None) -> List[Course]:
    """Get all courses, optionally filtered by user_id"""
    query = db.query(Course)
    if user_id:
        query = query.filter(Course.user_id == user_id)
    return query.order_by(Course.created_at.desc()).all()

def get_course_by_id(db: Session, course_id: int) -> Optional[Course]:
    """Get a single course by ID"""
    return db.query(Course).filter(Course.id == course_id).first()

def create_course(db: Session, course: CourseCreate, user_id: Optional[int] = None) -> Course:
    """Create a new course"""
    try:
        db_course = Course(
            name=course.name,
            term=course.term,
            description=course.description or "",
            user_id=user_id
        )
        db.add(db_course)
        db.commit()
        db.refresh(db_course)
        return db_course
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to create course")

def update_course(db: Session, course_id: int, course_update: CourseUpdate) -> Optional[Course]:
    """Update an existing course"""
    try:
        db_course = get_course_by_id(db, course_id)
        if not db_course:
            return None
        
        update_data = course_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_course, field, value)
        
        db.commit()
        db.refresh(db_course)
        return db_course
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to update course")

def delete_course(db: Session, course_id: int) -> bool:
    """Delete a course by ID"""
    try:
        db_course = get_course_by_id(db, course_id)
        if not db_course:
            return False
        
        db.delete(db_course)
        db.commit()
        return True
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Cannot delete course with existing assignments")