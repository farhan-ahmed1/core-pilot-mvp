import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllAssignments,
  getAssignmentStats,
  AssignmentFilters,
  AssignmentStats,
  AssignmentListItem,
} from '../services/assignmentService';
import { getCourses, Course } from '../services/courseService';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

export const useAssignmentList = () => {
  const navigate = useNavigate();

  // State management
  const [assignments, setAssignments] = useState<AssignmentListItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<AssignmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  
  // Filter and search state
  const [filters, setFilters] = useState<AssignmentFilters>({
    sort_by: 'due_date',
    order: 'asc',
    limit: 50
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<number | ''>('');
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Memoized filtered assignments for better performance
  const filteredAssignments = useMemo(() => {
    return assignments;
  }, [assignments]);

  // Load data on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Reload assignments when filters change
  useEffect(() => {
    loadAssignments();
  }, [filters, activeTab]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setStatsLoading(true);
      
      // Load courses and stats in parallel
      const [coursesData, statsData] = await Promise.all([
        getCourses(),
        getAssignmentStats()
      ]);
      
      setCourses(coursesData);
      setStats(statsData);
      setStatsLoading(false);
      
      // Load assignments
      await loadAssignments();
    } catch (error) {
      console.error('Failed to load initial data:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load assignments data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAssignments = async () => {
    try {
      const currentFilters: AssignmentFilters = {
        ...filters,
        search: searchQuery || undefined,
        course_id: selectedCourse || undefined,
        status: getStatusFilter()
      };
      
      const assignmentsData = await getAllAssignments(currentFilters);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error('Failed to load assignments:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load assignments',
        severity: 'error'
      });
    }
  };

  const getStatusFilter = (): 'overdue' | 'due_soon' | 'upcoming' | undefined => {
    switch (activeTab) {
      case 1: return 'overdue';
      case 2: return 'due_soon';
      case 3: return 'upcoming';
      default: return undefined;
    }
  };

  const getCourseById = (courseId: number) => {
    return courses.find(course => course.id === courseId);
  };

  // Event handlers
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    loadAssignments();
  };

  const handleCourseFilter = (courseId: number | '') => {
    setSelectedCourse(courseId);
    setFilters(prev => ({ ...prev, course_id: courseId || undefined }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({ ...prev, sort_by: sortBy as any }));
  };

  const handleOrderChange = () => {
    setFilters(prev => ({ 
      ...prev, 
      order: prev.order === 'asc' ? 'desc' : 'asc' 
    }));
  };

  const handleViewModeChange = (_: React.MouseEvent<HTMLElement>, newViewMode: 'list' | 'grid') => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const handleAssignmentClick = (assignmentId: number) => {
    navigate(`/assignments/${assignmentId}`, {
      state: { from: '/assignments' }
    });
  };

  const handleCreateAssignment = () => {
    setAssignmentDialogOpen(true);
  };

  const handleAssignmentCreated = () => {
    setSnackbar({
      open: true,
      message: 'Assignment created successfully!',
      severity: 'success'
    });
    loadInitialData(); // Refresh data
  };

  return {
    // State
    assignments: filteredAssignments,
    courses,
    stats,
    loading,
    statsLoading,
    activeTab,
    viewMode,
    assignmentDialogOpen,
    filters,
    searchQuery,
    selectedCourse,
    snackbar,
    
    // Actions
    handleTabChange,
    handleSearchChange,
    handleSearchSubmit,
    handleCourseFilter,
    handleSortChange,
    handleOrderChange,
    handleViewModeChange,
    handleAssignmentClick,
    handleCreateAssignment,
    handleAssignmentCreated,
    setAssignmentDialogOpen,
    setSnackbar,
    getCourseById,
    loadInitialData
  };
};