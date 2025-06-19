import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Alert,
  Snackbar,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

// Import components
import CourseAssignmentList from '../../components/courses/CourseAssignmentList';
import AssignmentDialog from '../../components/assignments/AssignmentDialog';
import LoadingScreen from '../../components/common/LoadingScreen';

// Import services
import { getCourse, getCourseAssignments, Course, Assignment } from '../../services/courseService';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

const CourseAssignmentsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();

  // State management
  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Load course and assignments data
  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) {
        setError('Course ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch course and assignments in parallel
        const [courseData, assignmentsData] = await Promise.all([
          getCourse(parseInt(courseId)),
          getCourseAssignments(parseInt(courseId))
        ]);

        setCourse(courseData);
        setAssignments(assignmentsData);
      } catch (error: any) {
        console.error('Error fetching course data:', error);
        setError(error.message || 'Failed to load course assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  // Event handlers
  const handleCreateAssignment = () => {
    setAssignmentDialogOpen(true);
  };

  const handleAssignmentCreated = async () => {
    setSnackbar({
      open: true,
      message: 'Assignment created successfully!',
      severity: 'success'
    });
    setAssignmentDialogOpen(false);

    // Refresh assignments list
    if (courseId) {
      try {
        const updatedAssignments = await getCourseAssignments(parseInt(courseId));
        setAssignments(updatedAssignments);
      } catch (error) {
        console.error('Error refreshing assignments:', error);
      }
    }
  };

  const handleBackToCourses = () => {
    navigate('/courses');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Loading state
  if (loading) {
    return <LoadingScreen message="Loading course assignments..." />;
  }

  // Error state
  if (error || !course) {
    return (
      <Box textAlign="center" py={6}>
        <Alert severity="error" sx={{ borderRadius: 3, mb: 3 }}>
          {error || 'Course not found'}
        </Alert>
        <Button
          variant="outlined"
          onClick={handleBackToCourses}
          sx={{ borderRadius: 3 }}
        >
          Back to Courses
        </Button>
      </Box>
    );
  }

  return (
    <>
      {/* Enhanced Navigation Header */}
      <Box sx={{ mb: 4 }}>
        {/* Breadcrumb Navigation */}
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs
            separator={<ChevronRightIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{
              '& .MuiBreadcrumbs-separator': {
                color: 'text.secondary',
                mx: 1
              }
            }}
          >
            <Link
              component="button"
              variant="body2"
              onClick={handleBackToDashboard}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline'
                }
              }}
            >
              <HomeIcon sx={{ fontSize: 16 }} />
              Dashboard
            </Link>
            <Link
              component="button"
              variant="body2"
              onClick={handleBackToCourses}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline'
                }
              }}
            >
              <SchoolIcon sx={{ fontSize: 16 }} />
              Courses
            </Link>
            <Typography variant="body2" color="text.primary" fontWeight={500}>
              {course.name}
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* Page Header */}
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={3}>
          <Box flex={1}>
            <Typography variant="overline" color="text.secondary" fontWeight={600} letterSpacing={1}>
              Course Assignments
            </Typography>
            <Typography variant="h4" fontWeight="700" color="text.primary" sx={{ lineHeight: 1.2, mb: 1 }}>
              {course.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ mb: 2 }}>
              {course.term}
            </Typography>
            {course.description && (
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px' }}>
                {course.description}
              </Typography>
            )}
          </Box>

          {/* Action Controls */}
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateAssignment}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 3,
                px: 3,
                py: 1.5,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: theme.shadows[2]
                }
              }}
            >
              Create Assignment
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Assignments Content */}
      <Box>
        {assignments.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 4,
              borderRadius: 4,
              border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
              bgcolor: alpha(theme.palette.primary.main, 0.02)
            }}
          >
            <SchoolIcon sx={{ fontSize: 64, color: alpha(theme.palette.primary.main, 0.3), mb: 2 }} />
            <Typography variant="h6" fontWeight="600" gutterBottom>
              No assignments yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
              Get started by creating your first assignment for this course. You can add prompts, set due dates, and track student progress.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateAssignment}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 3,
                px: 4
              }}
            >
              Create First Assignment
            </Button>
          </Box>
        ) : (
          <CourseAssignmentList assignments={assignments} />
        )}
      </Box>

      {/* Assignment Creation Dialog */}
      <AssignmentDialog
        open={assignmentDialogOpen}
        onClose={() => setAssignmentDialogOpen(false)}
        preselectedCourseId={courseId ? parseInt(courseId) : undefined}
        onAssignmentCreated={handleAssignmentCreated}
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
    </>
  );
};

export default CourseAssignmentsPage;