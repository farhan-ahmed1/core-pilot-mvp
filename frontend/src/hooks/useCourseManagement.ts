import { useState, useEffect } from 'react';
import { getCourses, createCourse, updateCourse, deleteCourse, Course, CourseCreate } from '../services/courseService';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

export const useCourseManagement = () => {
  // Course state
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form states for create
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseTerm, setNewCourseTerm] = useState('');
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  // Form states for edit
  const [editCourseName, setEditCourseName] = useState('');
  const [editCourseTerm, setEditCourseTerm] = useState('');
  const [editCourseDescription, setEditCourseDescription] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Load courses on mount
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const coursesData = await getCourses();
      setCourses(coursesData);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to load courses',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Course menu handlers
  const handleCourseMenuOpen = (event: React.MouseEvent<HTMLElement>, courseId: number) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedCourseId(courseId);
  };

  const handleCourseMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedCourseId(null);
  };

  // Create course handlers
  const handleOpenCreateDialog = () => {
    setNewCourseName('');
    setNewCourseTerm('');
    setNewCourseDescription('');
    setCreateDialogOpen(true);
  };

  const handleCreateCourse = async () => {
    if (!newCourseName.trim() || !newCourseTerm.trim()) return;
    
    try {
      setCreateLoading(true);
      const courseData: CourseCreate = {
        name: newCourseName,
        term: newCourseTerm,
        description: newCourseDescription
      };
      const newCourse = await createCourse(courseData);
      setCourses(prev => [...prev, newCourse]);
      setCreateDialogOpen(false);
      setSnackbar({ open: true, message: 'Course created successfully!', severity: 'success' });
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Failed to create course', severity: 'error' });
    } finally {
      setCreateLoading(false);
    }
  };

  // Edit course handlers
  const handleOpenEditDialog = (courseId?: number) => {
    const targetCourseId = courseId || selectedCourseId;
    const course = courses.find(c => c.id === targetCourseId);
    if (course) {
      setEditingCourse(course);
      setEditCourseName(course.name);
      setEditCourseTerm(course.term);
      setEditCourseDescription(course.description || '');
      setEditDialogOpen(true);
    }
    handleCourseMenuClose();
  };

  const handleUpdateCourse = async () => {
    if (!editCourseName.trim() || !editCourseTerm.trim() || !editingCourse) return;
    
    try {
      setEditLoading(true);
      const courseData: CourseCreate = {
        name: editCourseName,
        term: editCourseTerm,
        description: editCourseDescription
      };
      const updatedCourse = await updateCourse(editingCourse.id, courseData);
      setCourses(prev => prev.map(c => c.id === editingCourse.id ? updatedCourse : c));
      setEditDialogOpen(false);
      setSnackbar({ open: true, message: 'Course updated successfully!', severity: 'success' });
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Failed to update course', severity: 'error' });
    } finally {
      setEditLoading(false);
    }
  };

  // Delete course handler with confirmation
  const handleDeleteCourse = async (courseId?: number) => {
    const targetCourseId = courseId || selectedCourseId;
    if (!targetCourseId) return;
    
    // Show confirmation dialog
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this course? This action cannot be undone and will also delete all associated assignments.'
    );
    
    if (!confirmDelete) return;
    
    try {
      await deleteCourse(targetCourseId);
      setCourses(prev => prev.filter(c => c.id !== targetCourseId));
      setSnackbar({ open: true, message: 'Course deleted successfully!', severity: 'success' });
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Failed to delete course', severity: 'error' });
    }
    handleCourseMenuClose();
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return {
    // State
    courses,
    loading,
    createDialogOpen,
    editDialogOpen,
    editingCourse,
    menuAnchorEl,
    selectedCourseId,
    snackbar,

    // Create form state
    newCourseName,
    newCourseTerm,
    newCourseDescription,
    createLoading,

    // Edit form state
    editCourseName,
    editCourseTerm,
    editCourseDescription,
    editLoading,

    // Handlers
    handleCourseMenuOpen,
    handleCourseMenuClose,
    handleOpenCreateDialog,
    handleCreateCourse,
    handleOpenEditDialog,
    handleUpdateCourse,
    handleDeleteCourse,
    handleSnackbarClose,

    // Setters
    setCreateDialogOpen,
    setEditDialogOpen,
    setNewCourseName,
    setNewCourseTerm,
    setNewCourseDescription,
    setEditCourseName,
    setEditCourseTerm,
    setEditCourseDescription,
  };
};