import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Fab,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Import shared components
import Header from '../components/Header';
import DashboardStats from '../components/DashboardStats';
import CourseGrid from '../components/CourseGrid';
import CourseDialogs from '../components/CourseDialogs';

// Import hooks and services
import { useCourseManagement } from '../hooks/useCourseManagement';
import { getAllAssignments, AssignmentListItem } from '../services/assignmentService';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Use the course management hook
  const {
    courses,
    loading,
    snackbar,
    handleSnackbarClose,
    // Create dialog props
    createDialogOpen,
    newCourseName,
    newCourseTerm,
    newCourseDescription,
    createLoading,
    setCreateDialogOpen,
    setNewCourseName,
    setNewCourseTerm,
    setNewCourseDescription,
    handleCreateCourse,
    // Edit dialog props
    editDialogOpen,
    editingCourse,
    editCourseName,
    editCourseTerm,
    editCourseDescription,
    editLoading,
    setEditDialogOpen,
    setEditCourseName,
    setEditCourseTerm,
    setEditCourseDescription,
    handleUpdateCourse,
    handleOpenCreateDialog,
    handleOpenEditDialog,
    handleDeleteCourse,
  } = useCourseManagement();

  // Local state for assignments and UI
  const [assignments, setAssignments] = useState<AssignmentListItem[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  // Load assignments on component mount
  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const allAssignments = await getAllAssignments();
        setAssignments(allAssignments);
      } catch (error) {
        console.error('Error loading assignments:', error);
      }
    };

    if (courses.length > 0) {
      loadAssignments();
    }
  }, [courses]);

  // Calculate dashboard stats
  const totalCourses = courses.length;
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => !a.is_overdue).length;
  const inProgressAssignments = assignments.filter(a => a.is_overdue).length;
  const completionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;

  // Handle FAB menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleCreateCourseClick = () => {
    handleOpenCreateDialog();
    handleMenuClose();
  };

  const handleCreateAssignment = () => {
    navigate('/assignments');
    handleMenuClose();
  };

  // Assignment click handler for CourseGrid
  const handleAssignmentClick = (assignmentId: number) => {
    navigate(`/assignments/${assignmentId}`);
  };

  // Add assignment handler for CourseGrid
  const handleAddAssignment = (courseId: number) => {
    navigate('/assignments', { state: { preselectedCourseId: courseId } });
  };

  if (loading) {
    return (
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'grey.50' }}>
        <Header title="Core Pilot" />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Header title="Core Pilot" />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Dashboard Stats */}
        <DashboardStats 
          totalCourses={totalCourses}
          totalAssignments={totalAssignments}
          completedAssignments={completedAssignments}
          inProgressAssignments={inProgressAssignments}
          completionRate={completionRate}
        />

        {/* Courses Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
            Your Courses
          </Typography>
          
          {courses.length === 0 ? (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                backgroundColor: 'background.paper',
                borderRadius: 4,
                border: 2,
                borderColor: 'divider',
                borderStyle: 'dashed'
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No courses yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Get started by creating your first course
              </Typography>
            </Box>
          ) : (
            <CourseGrid 
              courses={courses}
              assignments={assignments.map(a => ({
                id: a.id,
                courseId: a.course_id,
                title: a.title,
                dueDate: a.due_date,
                status: a.is_overdue ? 'no_draft' : 'feedback_ready'
              }))}
              onCourseEdit={handleOpenEditDialog}
              onCourseDelete={handleDeleteCourse}
              onAssignmentClick={handleAssignmentClick}
              onAddAssignment={handleAddAssignment}
            />
          )}
        </Box>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          onClick={handleMenuOpen}
        >
          <AddIcon />
        </Fab>

        {/* FAB Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={handleCreateCourseClick}>
            Create Course
          </MenuItem>
          <MenuItem onClick={handleCreateAssignment} disabled={courses.length === 0}>
            Create Assignment
          </MenuItem>
        </Menu>

        {/* Course Dialogs */}
        <CourseDialogs
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
          editDialogOpen={editDialogOpen}
          editingCourse={editingCourse}
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

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            variant="filled"
            sx={{ borderRadius: 3 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default DashboardPage;