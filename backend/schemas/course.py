from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class CourseBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200, description="Course name")
    term: str = Field(..., min_length=1, max_length=50, description="Academic term")
    description: Optional[str] = Field(default="", max_length=1000, description="Course description")

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    term: Optional[str] = Field(None, min_length=1, max_length=50)
    description: Optional[str] = Field(None, max_length=1000)

class CourseResponse(BaseModel):
    id: int
    name: str
    term: str
    description: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {
        "from_attributes": True
    }