from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String, index=True)  # Added for profile
    photo_url = Column(String, nullable=True)  # Added for profile photo
    username = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=True)
    role = Column(String(32), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    courses = relationship("Course", back_populates="owner", cascade="all, delete-orphan")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)  # Changed from title to name to match frontend
    term = Column(String, index=True)
    description = Column(Text, default="")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # For Sprint 0, nullable
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="courses")
    assignments = relationship("Assignment", back_populates="course", cascade="all, delete-orphan")

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    due_date = Column(DateTime)
    course_id = Column(Integer, ForeignKey("courses.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    course = relationship("Course", back_populates="assignments")

class Draft(Base):
    __tablename__ = "drafts"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    version = Column(Integer, default=1)
    assignment_id = Column(Integer, ForeignKey("assignments.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    draft_id = Column(Integer, ForeignKey("drafts.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())