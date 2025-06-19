// API client for making authenticated requests to the backend
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { auth } from './firebase';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Added auth token to request:', config.url);
      } else {
        console.log('No Firebase user found for request:', config.url);
      }
    } catch (error) {
      console.error('Failed to get auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      console.error('Authentication failed, redirecting to login');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API request function
export async function apiRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    console.log(`Making ${method} request to ${endpoint}`, data ? { data } : '');
    
    const response: AxiosResponse<T> = await apiClient.request({
      method,
      url: endpoint,
      data,
      ...config,
    });
    
    console.log(`${method} ${endpoint} - Success:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${method} ${endpoint} - Error:`, error);
    handleApiError(error);
    throw error;
  }
}

// Enhanced error handler for API requests
export function handleApiError(error: any): void {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      // Server responded with error status
      const status = axiosError.response.status;
      const data = axiosError.response.data as any;

      console.error(`API Error ${status}:`, data);
      
      // Log the full response for debugging
      console.error('Full error response:', {
        status,
        statusText: axiosError.response.statusText,
        headers: axiosError.response.headers,
        data: data,
        url: axiosError.config?.url,
        method: axiosError.config?.method?.toUpperCase()
      });

      // Handle specific error cases
      switch (status) {
        case 401:
          console.error('Unauthorized - invalid or expired token');
          break;
        case 403:
          console.error('Forbidden - insufficient permissions');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 422:
          console.error('Validation error:', data);
          // Log detailed validation errors if available
          if (data.detail && Array.isArray(data.detail)) {
            console.error('Validation details:', data.detail);
            data.detail.forEach((validationError: any, index: number) => {
              console.error(`Validation error ${index + 1}:`, validationError);
            });
          }
          break;
        case 500:
          console.error('Internal server error');
          break;
        default:
          console.error('API request failed:', data);
      }
    } else if (axiosError.request) {
      // Network error
      console.error('Network error - no response received:', axiosError.message);
      console.error('Request details:', {
        url: axiosError.config?.url,
        method: axiosError.config?.method?.toUpperCase(),
        timeout: axiosError.config?.timeout,
        headers: axiosError.config?.headers
      });
    } else {
      // Request setup error
      console.error('Request setup error:', axiosError.message);
    }
  } else {
    // Non-axios error
    console.error('Unexpected error:', error);
  }
}

export default apiClient;