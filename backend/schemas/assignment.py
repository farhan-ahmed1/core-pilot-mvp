from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime, timezone

class AssignmentBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Assignment title")
    description: Optional[str] = Field(default="", max_length=2000, description="Assignment description")
    prompt: str = Field(..., min_length=1, description="Assignment prompt text or instructions")
    due_date: datetime = Field(..., description="Due date and time for the assignment")
    course_id: int = Field(..., gt=0, description="ID of the course this assignment belongs to")

    @validator('due_date')
    def validate_due_date(cls, v):
        # Make datetime timezone-aware for comparison
        now = datetime.now(timezone.utc)
        if v.tzinfo is None:
            # If input datetime is naive, assume UTC
            v = v.replace(tzinfo=timezone.utc)
        if v < now:
            raise ValueError('Due date must be in the future')
        return v

class AssignmentCreate(AssignmentBase):
    pass

class AssignmentUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    prompt: Optional[str] = Field(None, min_length=1)
    due_date: Optional[datetime] = None

    @validator('due_date')
    def validate_due_date(cls, v):
        if v:
            # Make datetime timezone-aware for comparison
            now = datetime.now(timezone.utc)
            if v.tzinfo is None:
                # If input datetime is naive, assume UTC
                v = v.replace(tzinfo=timezone.utc)
            if v < now:
                raise ValueError('Due date must be in the future')
        return v

class AssignmentResponse(BaseModel):
    id: int
    title: str
    description: str
    prompt: str
    due_date: datetime
    course_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Additional computed fields
    is_overdue: bool = False
    days_until_due: Optional[int] = None
    
    model_config = {
        "from_attributes": True
    }

    def __init__(self, **data):
        super().__init__(**data)
        # Calculate computed fields with timezone-aware comparison
        now = datetime.now(timezone.utc)
        due_date = self.due_date
        if due_date.tzinfo is None:
            due_date = due_date.replace(tzinfo=timezone.utc)
        
        self.is_overdue = due_date < now
        delta = due_date - now
        self.days_until_due = delta.days if delta.days >= 0 else None

class AssignmentListResponse(BaseModel):
    id: int
    title: str
    due_date: datetime
    course_id: int
    is_overdue: bool = False
    days_until_due: Optional[int] = None
    
    model_config = {
        "from_attributes": True
    }

    def __init__(self, **data):
        super().__init__(**data)
        # Calculate computed fields with timezone-aware comparison
        now = datetime.now(timezone.utc)
        due_date = self.due_date
        if due_date.tzinfo is None:
            due_date = due_date.replace(tzinfo=timezone.utc)
            
        self.is_overdue = due_date < now
        delta = due_date - now
        self.days_until_due = delta.days if delta.days >= 0 else None