// Assignment service for FRE-2.1, 2.2, 2.3 - Assignment CRUD operations with authentication
import { apiRequest, handleApiError } from './apiClient';

export interface Assignment {
  id: number;
  title: string;
  description: string;
  prompt: string;
  due_date: string;
  course_id: number;
  created_at: string;
  updated_at?: string;
  is_overdue: boolean;
  days_until_due?: number;
  // FRE-3.1: Add draft and feedback status for status indicators
  has_draft?: boolean;
  has_feedback?: boolean;
}

export interface AssignmentCreate {
  title: string;
  description?: string;
  prompt: string;
  due_date: string;
  course_id: number;
}

export interface AssignmentUpdate {
  title?: string;
  description?: string;
  prompt?: string;
  due_date?: string;
}

export interface AssignmentListItem {
  id: number;
  title: string;
  due_date: string;
  course_id: number;
  is_overdue: boolean;
  days_until_due?: number;
  // FRE-3.1: Add draft and feedback status for status indicators
  has_draft?: boolean;
  has_feedback?: boolean;
}

// FRE-2.1: List assignments for a course
export async function getAssignmentsByCourse(courseId: number): Promise<AssignmentListItem[]> {
  try {
    return await apiRequest<AssignmentListItem[]>('GET', `/courses/${courseId}/assignments`);
  } catch (error) {
    handleApiError(error);
    return [];
  }
}

// Get a single assignment by ID
export async function getAssignment(id: number): Promise<Assignment> {
  try {
    return await apiRequest<Assignment>('GET', `/assignments/${id}`);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// FRE-2.2: Create a new assignment
export async function createAssignment(data: AssignmentCreate): Promise<Assignment> {
  try {
    return await apiRequest<Assignment>('POST', '/assignments/', data);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// FRE-2.3: Update an assignment
export async function updateAssignment(id: number, data: AssignmentUpdate): Promise<Assignment> {
  try {
    return await apiRequest<Assignment>('PUT', `/assignments/${id}`, data);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// FRE-2.3: Delete an assignment
export async function deleteAssignment(id: number): Promise<void> {
  try {
    await apiRequest<void>('DELETE', `/assignments/${id}`);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// Additional utility functions
export async function getUpcomingAssignments(limit: number = 10): Promise<AssignmentListItem[]> {
  try {
    return await apiRequest<AssignmentListItem[]>('GET', `/assignments/upcoming?limit=${limit}`);
  } catch (error) {
    handleApiError(error);
    return [];
  }
}

export async function getOverdueAssignments(): Promise<AssignmentListItem[]> {
  try {
    return await apiRequest<AssignmentListItem[]>('GET', '/assignments/overdue');
  } catch (error) {
    handleApiError(error);
    return [];
  }
}

// Enhanced API functions for professional assignment management
export interface AssignmentFilters {
  status?: 'overdue' | 'due_soon' | 'upcoming';
  course_id?: number;
  search?: string;
  sort_by?: 'due_date' | 'title' | 'created_at';
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface AssignmentStats {
  total_assignments: number;
  overdue: number;
  due_soon: number;
  upcoming: number;
  by_course: Array<{
    course_name: string;
    count: number;
  }>;
}

export async function getAllAssignments(filters?: AssignmentFilters): Promise<AssignmentListItem[]> {
  try {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.course_id) params.append('course_id', filters.course_id.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.sort_by) params.append('sort_by', filters.sort_by);
      if (filters.order) params.append('order', filters.order);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());
    }
    
    const endpoint = `/assignments/${params.toString() ? `?${params.toString()}` : ''}`;
    return await apiRequest<AssignmentListItem[]>('GET', endpoint);
  } catch (error) {
    handleApiError(error);
    return [];
  }
}

export async function getAssignmentStats(): Promise<AssignmentStats> {
  try {
    return await apiRequest<AssignmentStats>('GET', '/assignments/stats');
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// Helper functions for date handling
export function formatDueDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getDueDateStatus(assignment: AssignmentListItem): 'overdue' | 'due-soon' | 'upcoming' {
  if (assignment.is_overdue) {
    return 'overdue';
  }
  if (assignment.days_until_due !== undefined && assignment.days_until_due <= 3) {
    return 'due-soon';
  }
  return 'upcoming';
}

export function getDueDateColor(status: string): 'error' | 'warning' | 'success' {
  switch (status) {
    case 'overdue': return 'error';
    case 'due-soon': return 'warning';
    case 'upcoming': default: return 'success';
  }
}