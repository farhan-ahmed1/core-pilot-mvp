# FastAPI router for Assignment management - FRE-2.1, 2.2, 2.3
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database.base import get_db
from schemas.assignment import (
    AssignmentCreate, 
    AssignmentUpdate, 
    AssignmentResponse, 
    AssignmentListResponse
)
from crud.assignment import (
    get_assignments_by_course,
    get_assignment_by_id,
    create_assignment,
    update_assignment,
    delete_assignment,
    get_upcoming_assignments,
    get_overdue_assignments
)
from database.models import Assignment, Course
from sqlalchemy import func
from datetime import datetime, timedelta, timezone
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/assignments", tags=["assignments"])

# --- Dummy user auth for Sprint 0 ---
def get_current_user_id():
    # In Sprint 0, always return user_id=1
    return 1

# IMPORTANT: Define specific routes BEFORE parameterized routes to avoid conflicts

@router.get("/stats", response_model=dict)
def get_assignment_statistics(db: Session = Depends(get_db)):
    """Get assignment statistics and analytics"""
    try:
        now = datetime.now(timezone.utc)
        soon_threshold = now + timedelta(days=7)
        
        total_assignments = db.query(Assignment).count()
        overdue_count = db.query(Assignment).filter(Assignment.due_date < now).count()
        due_soon_count = db.query(Assignment).filter(
            Assignment.due_date >= now,
            Assignment.due_date <= soon_threshold
        ).count()
        upcoming_count = db.query(Assignment).filter(Assignment.due_date > soon_threshold).count()
        
        # Course distribution
        course_stats = db.query(
            Course.name,
            func.count(Assignment.id).label('assignment_count')
        ).join(Assignment).group_by(Course.id, Course.name).all()
        
        return {
            "total_assignments": total_assignments,
            "overdue": overdue_count,
            "due_soon": due_soon_count,
            "upcoming": upcoming_count,
            "by_course": [{"course_name": stat[0], "count": stat[1]} for stat in course_stats]
        }
        
    except Exception as e:
        logger.error(f"Error getting assignment statistics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve assignment statistics"
        )

@router.get("/upcoming", response_model=List[AssignmentListResponse])
def list_upcoming_assignments(limit: int = 10, db: Session = Depends(get_db)):
    """Get upcoming assignments across all courses"""
    try:
        assignments = get_upcoming_assignments(db, limit=limit)
        logger.info(f"Retrieved {len(assignments)} upcoming assignments")
        return assignments
    except Exception as e:
        logger.error(f"Error listing upcoming assignments: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve upcoming assignments"
        )

@router.get("/overdue", response_model=List[AssignmentListResponse])
def list_overdue_assignments(db: Session = Depends(get_db)):
    """Get overdue assignments across all courses"""
    try:
        assignments = get_overdue_assignments(db)
        logger.info(f"Retrieved {len(assignments)} overdue assignments")
        return assignments
    except Exception as e:
        logger.error(f"Error listing overdue assignments: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve overdue assignments"
        )

@router.get("/", response_model=List[AssignmentListResponse])
def list_all_assignments(
    status: Optional[str] = Query(None, description="Filter by status: overdue, due_soon, upcoming"),
    course_id: Optional[int] = Query(None, description="Filter by course ID"),
    search: Optional[str] = Query(None, description="Search assignments by title"),
    sort_by: str = Query("due_date", description="Sort by: due_date, title, created_at"),
    order: str = Query("asc", description="Sort order: asc, desc"),
    limit: int = Query(50, le=100, description="Maximum number of assignments to return"),
    offset: int = Query(0, ge=0, description="Number of assignments to skip"),
    db: Session = Depends(get_db)
):
    """Get all assignments with advanced filtering, search, and sorting (Enhanced FRE-2.1)"""
    try:
        logger.info(f"Listing assignments with filters - status: {status}, course_id: {course_id}, search: {search}")
        
        # Start with base query
        query = db.query(Assignment).join(Course)
        
        # Apply filters
        if course_id:
            query = query.filter(Assignment.course_id == course_id)
        
        if search:
            query = query.filter(Assignment.title.ilike(f"%{search}%"))
        
        # Apply status filter (computed based on due_date)
        if status:
            now = datetime.now(timezone.utc)
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
        
        # Apply sorting
        if sort_by == "due_date":
            sort_field = Assignment.due_date
        elif sort_by == "title":
            sort_field = Assignment.title
        elif sort_by == "created_at":
            sort_field = Assignment.created_at
        else:
            sort_field = Assignment.due_date
        
        if order == "desc":
            query = query.order_by(sort_field.desc())
        else:
            query = query.order_by(sort_field.asc())
        
        # Apply pagination
        assignments = query.offset(offset).limit(limit).all()
        
        logger.info(f"Retrieved {len(assignments)} assignments")
        return assignments
        
    except Exception as e:
        logger.error(f"Error listing assignments: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve assignments"
        )

@router.get("/courses/{course_id}/assignments", response_model=List[AssignmentListResponse])
def list_assignments_for_course(course_id: int, db: Session = Depends(get_db)):
    """Get all assignments for a specific course (FRE-2.1)"""
    try:
        logger.info(f"Retrieving assignments for course {course_id}")
        assignments = get_assignments_by_course(db, course_id)
        logger.info(f"Retrieved {len(assignments)} assignments for course {course_id}")
        return assignments
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error listing assignments for course {course_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve assignments"
        )

@router.post("/", response_model=AssignmentResponse, status_code=status.HTTP_201_CREATED)
def create_new_assignment(assignment: AssignmentCreate, db: Session = Depends(get_db)):
    """Create a new assignment (FRE-2.2)"""
    try:
        logger.info(f"Creating assignment: {assignment.title} for course {assignment.course_id}")
        
        db_assignment = create_assignment(db, assignment)
        logger.info(f"Successfully created assignment with ID: {db_assignment.id}")
        return db_assignment
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating assignment: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create assignment"
        )

# NOTE: Place parameterized routes AFTER specific routes
@router.get("/{assignment_id}", response_model=AssignmentResponse)
def get_assignment(assignment_id: int, db: Session = Depends(get_db)):
    """Get a specific assignment by ID"""
    try:
        assignment = get_assignment_by_id(db, assignment_id)
        if not assignment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assignment not found"
            )
        return assignment
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving assignment {assignment_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve assignment"
        )

@router.put("/{assignment_id}", response_model=AssignmentResponse)
def update_existing_assignment(
    assignment_id: int, 
    assignment_update: AssignmentUpdate, 
    db: Session = Depends(get_db)
):
    """Update an existing assignment (FRE-2.3)"""
    try:
        logger.info(f"Updating assignment {assignment_id}")
        updated_assignment = update_assignment(db, assignment_id, assignment_update)
        if not updated_assignment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assignment not found"
            )
        logger.info(f"Successfully updated assignment {assignment_id}")
        return updated_assignment
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating assignment {assignment_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update assignment"
        )

@router.delete("/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_assignment(assignment_id: int, db: Session = Depends(get_db)):
    """Delete an assignment (FRE-2.3)"""
    try:
        logger.info(f"Deleting assignment {assignment_id}")
        success = delete_assignment(db, assignment_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assignment not found"
            )
        logger.info(f"Successfully deleted assignment {assignment_id}")
        return None
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting assignment {assignment_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete assignment"
        )