# CRUD operations for Assignment management - FRE-2.1, 2.2, 2.3
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from database.models import Assignment, Course
from schemas.assignment import AssignmentCreate, AssignmentUpdate
from typing import List, Optional

def get_assignments_by_course(db: Session, course_id: int) -> List[Assignment]:
    """Get all assignments for a specific course (FRE-2.1)"""
    return db.query(Assignment).filter(Assignment.course_id == course_id).order_by(Assignment.due_date.asc()).all()

def get_assignment_by_id(db: Session, assignment_id: int) -> Optional[Assignment]:
    """Get a single assignment by ID"""
    return db.query(Assignment).filter(Assignment.id == assignment_id).first()

def create_assignment(db: Session, assignment: AssignmentCreate) -> Assignment:
    """Create a new assignment (FRE-2.2)"""
    try:
        # Verify course exists
        course = db.query(Course).filter(Course.id == assignment.course_id).first()
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found"
            )
        
        db_assignment = Assignment(
            title=assignment.title,
            description=assignment.description or "",
            prompt=assignment.prompt,
            due_date=assignment.due_date,
            course_id=assignment.course_id
        )
        db.add(db_assignment)
        db.commit()
        db.refresh(db_assignment)
        return db_assignment
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create assignment"
        )

def update_assignment(db: Session, assignment_id: int, assignment_update: AssignmentUpdate) -> Optional[Assignment]:
    """Update an existing assignment (FRE-2.3)"""
    try:
        db_assignment = get_assignment_by_id(db, assignment_id)
        if not db_assignment:
            return None
        
        update_data = assignment_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_assignment, field, value)
        
        db.commit()
        db.refresh(db_assignment)
        return db_assignment
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update assignment"
        )

def delete_assignment(db: Session, assignment_id: int) -> bool:
    """Delete an assignment (FRE-2.3)"""
    try:
        db_assignment = get_assignment_by_id(db, assignment_id)
        if not db_assignment:
            return False
        
        db.delete(db_assignment)
        db.commit()
        return True
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete assignment with existing drafts"
        )

def get_assignments_by_user(db: Session, user_id: int) -> List[Assignment]:
    """Get all assignments for courses owned by a specific user"""
    return db.query(Assignment).join(Course).filter(
        Course.user_id == user_id
    ).order_by(Assignment.due_date.asc()).all()

def get_upcoming_assignments(db: Session, user_id: Optional[int] = None, course_id: Optional[int] = None, limit: int = 10) -> List[Assignment]:
    """Get upcoming assignments, optionally filtered by user or course"""
    from datetime import datetime
    
    query = db.query(Assignment).filter(Assignment.due_date > datetime.now())
    
    if user_id:
        # Filter by user's courses
        query = query.join(Course).filter(Course.user_id == user_id)
    elif course_id:
        query = query.filter(Assignment.course_id == course_id)
    
    return query.order_by(Assignment.due_date.asc()).limit(limit).all()

def get_overdue_assignments(db: Session, user_id: Optional[int] = None, course_id: Optional[int] = None) -> List[Assignment]:
    """Get overdue assignments, optionally filtered by user or course"""
    from datetime import datetime
    
    query = db.query(Assignment).filter(Assignment.due_date < datetime.now())
    
    if user_id:
        # Filter by user's courses
        query = query.join(Course).filter(Course.user_id == user_id)
    elif course_id:
        query = query.filter(Assignment.course_id == course_id)
    
    return query.order_by(Assignment.due_date.desc()).all()

def get_assignments_with_status(db: Session, user_id: int, status: str) -> List[Assignment]:
    """Get assignments filtered by status for a specific user"""
    from datetime import datetime, timedelta
    
    now = datetime.now()
    query = db.query(Assignment).join(Course).filter(Course.user_id == user_id)
    
    if status == "overdue":
        query = query.filter(Assignment.due_date < now)
    elif status == "due_soon":
        soon_threshold = now + timedelta(days=7)
        query = query.filter(
            Assignment.due_date >= now,
            Assignment.due_date <= soon_threshold
        )
    elif status == "upcoming":
        soon_threshold = now + timedelta(days=7)
        query = query.filter(Assignment.due_date > soon_threshold)
    
    return query.order_by(Assignment.due_date.asc()).all()

def get_assignment_count_by_user(db: Session, user_id: int) -> dict:
    """Get assignment counts by status for a specific user"""
    from datetime import datetime, timedelta
    
    now = datetime.now()
    soon_threshold = now + timedelta(days=7)
    
    user_assignments = db.query(Assignment).join(Course).filter(Course.user_id == user_id)
    
    total = user_assignments.count()
    overdue = user_assignments.filter(Assignment.due_date < now).count()
    due_soon = user_assignments.filter(
        Assignment.due_date >= now,
        Assignment.due_date <= soon_threshold
    ).count()
    upcoming = user_assignments.filter(Assignment.due_date > soon_threshold).count()
    
    return {
        "total": total,
        "overdue": overdue,
        "due_soon": due_soon,
        "upcoming": upcoming
    }