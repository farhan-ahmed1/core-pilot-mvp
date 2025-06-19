// User service for managing user profiles and backend registration
import { apiRequest, handleApiError } from './apiClient';

export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  photo_url?: string;
  created_at: string;
  last_login?: string;
  courses_count?: number;
  assignments_count?: number;
  verified?: boolean;
}

export interface UserRegistration {
  email: string;
  full_name: string;
  photo_url?: string;
}

// Register/login user in backend database
export async function registerUserInBackend(): Promise<UserProfile> {
  try {
    // The apiRequest function will automatically add the Authorization header
    // from the current Firebase user, so we don't need to pass it manually
    return await apiRequest<UserProfile>('POST', '/auth/register');
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// Get current user profile
export async function getUserProfile(): Promise<UserProfile> {
  try {
    return await apiRequest<UserProfile>('GET', '/auth/profile');
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// Update user profile
export async function updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  try {
    return await apiRequest<UserProfile>('PUT', '/auth/profile', data);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// Get user statistics (for dashboard)
export async function getUserStats(): Promise<{
  courses_count: number;
  assignments_count: number;
  recent_activity?: any[];
}> {
  try {
    const profile = await getUserProfile();
    return {
      courses_count: profile.courses_count || 0,
      assignments_count: profile.assignments_count || 0
    };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}