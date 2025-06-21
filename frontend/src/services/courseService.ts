// Course service for FRE-1.3 Course CRUD operations with authentication
import { apiRequest, handleApiError } from './apiClient';

export interface Course {
  id: number;
  name: string;
  term: string;
  description?: string;
  user_id?: number;
  created_at: string;
  updated_at?: string;
}

export interface CourseCreate {
  name: string;
  term: string;
  description?: string;
}

export interface CourseUpdate {
  name?: string;
  term?: string;
  description?: string;
}

export interface Assignment {
  id: number;
  title: string;
  description?: string;
  prompt: string;
  due_date: string;
  course_id: number;
  created_at: string;
  updated_at?: string;
}

// FRE-1.3: Get all courses for the authenticated user
export async function getCourses(): Promise<Course[]> {
  try {
    return await apiRequest<Course[]>('GET', '/courses/');
  } catch (error) {
    handleApiError(error);
    return [];
  }
}

// FRE-1.3: Get a specific course by ID
export async function getCourse(id: number): Promise<Course> {
  try {
    return await apiRequest<Course>('GET', `/courses/${id}`);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// FRE-2.1: Get assignments for a specific course
export async function getCourseAssignments(courseId: number): Promise<Assignment[]> {
  try {
    return await apiRequest<Assignment[]>('GET', `/courses/${courseId}/assignments`);
  } catch (error) {
    handleApiError(error);
    return [];
  }
}

// FRE-1.3: Create a new course
export async function createCourse(data: CourseCreate): Promise<Course> {
  try {
    return await apiRequest<Course>('POST', '/courses/', data);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// FRE-1.3: Update an existing course
export async function updateCourse(id: number, data: CourseUpdate): Promise<Course> {
  try {
    return await apiRequest<Course>('PUT', `/courses/${id}`, data);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// FRE-1.3: Delete a course
export async function deleteCourse(id: number): Promise<void> {
  try {
    await apiRequest<void>('DELETE', `/courses/${id}`);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
