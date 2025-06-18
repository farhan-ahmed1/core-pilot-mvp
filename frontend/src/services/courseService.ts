// Course service for FRE-1.3 Courses CRUD - Completely rebuilt
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Configure axios defaults
axios.defaults.timeout = 10000;

export interface Course {
  id: number;
  name: string;
  term: string;
  description: string;
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

// Error handling wrapper
const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    throw new Error(error.response.data?.detail || 'Server error occurred');
  } else if (error.request) {
    // Network error
    throw new Error('Network error - please check your connection');
  } else {
    // Other error
    throw new Error('An unexpected error occurred');
  }
};

export async function getCourses(): Promise<Course[]> {
  try {
    const response = await axios.get(`${API_BASE}/courses/`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    return []; // This won't be reached due to throw, but TypeScript needs it
  }
}

export async function getCourse(id: number): Promise<Course> {
  try {
    const response = await axios.get(`${API_BASE}/courses/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error; // Re-throw for caller to handle
  }
}

export async function createCourse(data: CourseCreate): Promise<Course> {
  try {
    const response = await axios.post(`${API_BASE}/courses/`, data);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function updateCourse(id: number, data: CourseUpdate): Promise<Course> {
  try {
    const response = await axios.put(`${API_BASE}/courses/${id}`, data);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function deleteCourse(id: number): Promise<void> {
  try {
    await axios.delete(`${API_BASE}/courses/${id}`);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
