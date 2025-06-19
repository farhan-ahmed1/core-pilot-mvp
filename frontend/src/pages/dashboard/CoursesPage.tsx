import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
  useTheme,
  alpha,
  Fade,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Add as AddIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
} from '@mui/icons-material';

import CourseGrid from '../../components/courses/CourseGrid';
import CourseList from '../../components/courses/CourseList';
import CourseDialogs from '../../components/courses/CourseDialogs';
import { Course, getCourses, createCourse, updateCourse, deleteCourse } from '../../services/courseService';

interface Assignment {
  id: number;
  courseId: number;
  title: string;
  dueDate: string;
  status: 'no_draft' | 'draft_saved' | 'feedback_ready';
}

const CoursesPage: React.FC = () => {
  const theme = useTheme();

  // State management
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Create dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseTerm, setNewCourseTerm] = useState('');
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editCourseName, setEditCourseName] = useState('');
  const [editCourseTerm, setEditCourseTerm] = useState('');
  const [editCourseDescription, setEditCourseDescription] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Load courses on component mount
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const coursesData = await getCourses();
      setCourses(coursesData);
    } catch (err) {
      setError('Failed to load courses. Please try again.');
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    if (!newCourseName.trim() || !newCourseTerm.trim()) return;

    try {
      setCreateLoading(true);
      const newCourse = await createCourse({
        name: newCourseName.trim(),
        term: newCourseTerm.trim(),
        description: newCourseDescription.trim()
      });
      
      setCourses(prev => [newCourse, ...prev]);
      setCreateDialogOpen(false);
      setNewCourseName('');
      setNewCourseTerm('');
      setNewCourseDescription('');
      
      setSnackbar({
        open: true,
        message: `Course "${newCourse.name}" created successfully!`,
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to create course. Please try again.',
        severity: 'error'
      });
      console.error('Error creating course:', err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditCourse = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setEditingCourse(course);
      setEditCourseName(course.name);
      setEditCourseTerm(course.term);
      setEditCourseDescription(course.description || '');
      setEditDialogOpen(true);
    }
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse || !editCourseName.trim() || !editCourseTerm.trim()) return;

    try {
      setEditLoading(true);
      const updatedCourse = await updateCourse(editingCourse.id, {
        name: editCourseName.trim(),
        term: editCourseTerm.trim(),
        description: editCourseDescription.trim()
      });
      
      setCourses(prev => prev.map(c => 
        c.id === editingCourse.id ? updatedCourse : c
      ));
      setEditDialogOpen(false);
      
      setSnackbar({
        open: true,
        message: `Course "${updatedCourse.name}" updated successfully!`,
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to update course. Please try again.',
        severity: 'error'
      });
      console.error('Error updating course:', err);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.name}"? This action cannot be undone and will remove all associated assignments.`
    );
    
    if (!confirmed) return;

    try {
      await deleteCourse(courseId);
      setCourses(prev => prev.filter(c => c.id !== courseId));
      
      setSnackbar({
        open: true,
        message: `Course "${course.name}" deleted successfully.`,
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete course. Please try again.',
        severity: 'error'
      });
      console.error('Error deleting course:', err);
    }
  };

  const handleViewModeChange = (_: React.MouseEvent<HTMLElement>, newViewMode: 'grid' | 'list') => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={48} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Fade in timeout={600}>
        <Box mb={4}>
          <Typography variant="h4" fontWeight="700" color="text.primary" gutterBottom>
            My Courses
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Manage your courses and assignments in one place. Create new courses to organize your academic work.
          </Typography>
          
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
              }}
            >
              Create Course
            </Button>

            {courses.length > 0 && (
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                aria-label="view mode"
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    '&.Mui-selected': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <ToggleButton value="grid" aria-label="grid view">
                  <ViewModuleIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="list" aria-label="list view">
                  <ViewListIcon fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          </Box>
        </Box>
      </Fade>

      {/* Error Alert */}
      {error && (
        <Fade in timeout={300}>
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
            {error}
          </Alert>
        </Fade>
      )}

      {/* Courses Display */}
      {courses.length > 0 ? (
        viewMode === 'grid' ? (
          <CourseGrid
            courses={courses}
            assignments={assignments}
            onCourseEdit={handleEditCourse}
            onCourseDelete={handleDeleteCourse}
            onAssignmentClick={() => {}}
            onAddAssignment={() => {}}
          />
        ) : (
          <CourseList
            onCourseEdit={(course) => handleEditCourse(course.id)}
            onCourseDelete={handleDeleteCourse}
            onCreateCourse={() => setCreateDialogOpen(true)}
          />
        )
      ) : (
        <Fade in timeout={800}>
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 4,
              border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
              bgcolor: alpha(theme.palette.primary.main, 0.02)
            }}
          >
            <Typography variant="h6" fontWeight="600" gutterBottom>
              No courses yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first course to start organizing your assignments and academic work.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
              }}
            >
              Create Your First Course
            </Button>
          </Paper>
        </Fade>
      )}

      {/* Course Dialogs */}
      <CourseDialogs
        // Create dialog props
        createDialogOpen={createDialogOpen}
        newCourseName={newCourseName}
        newCourseTerm={newCourseTerm}
        newCourseDescription={newCourseDescription}
        createLoading={createLoading}
        onCreateDialogClose={() => setCreateDialogOpen(false)}
        onNewCourseNameChange={setNewCourseName}
        onNewCourseTermChange={setNewCourseTerm}
        onNewCourseDescriptionChange={setNewCourseDescription}
        onCreateCourse={handleCreateCourse}

        // Edit dialog props
        editDialogOpen={editDialogOpen}
        editCourseName={editCourseName}
        editCourseTerm={editCourseTerm}
        editCourseDescription={editCourseDescription}
        editLoading={editLoading}
        onEditDialogClose={() => setEditDialogOpen(false)}
        onEditCourseNameChange={setEditCourseName}
        onEditCourseTermChange={setEditCourseTerm}
        onEditCourseDescriptionChange={setEditCourseDescription}
        onUpdateCourse={handleUpdateCourse}
      />

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 3 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CoursesPage;