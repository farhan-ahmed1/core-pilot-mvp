// Enhanced Dashboard Page showing user-specific courses and assignments
import React, { useState } from 'react';
import {
  Grid,
  Stack,
  Fab,
  Zoom,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
} from '@mui/icons-material';

// Import modular components
import DashboardWelcome from '../../components/dashboard/DashboardWelcome';
import DashboardStats from '../../components/dashboard/DashboardStats';
import UpcomingAssignments from '../../components/dashboard/UpcomingAssignments';
import CourseSidebar from '../../components/dashboard/CourseSidebar';
import QuickActions from '../../components/dashboard/QuickActions';
import CourseDialogs from '../../components/courses/CourseDialogs';
import CourseActions from '../../components/courses/CourseActions';
import AssignmentDialog from '../../components/assignments/AssignmentDialog';
import LoadingScreen from '../../components/common/LoadingScreen';

// Import hooks and services
import { useAuth } from '../../contexts/AuthContext';
import { useCourseManagement } from '../../hooks/useCourseManagement';
import { useDashboardData } from '../../hooks/useDashboardData';

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const { userProfile } = useAuth();
  
  // Dashboard data hook
  const { loading, stats, upcomingAssignments, refreshData } = useDashboardData();
  
  // Assignment dialog state
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [preselectedCourseId, setPreselectedCourseId] = useState<number | undefined>();
  
  // Course management hook
  const {
    courses,
    loading: coursesLoading,
    createDialogOpen,
    editDialogOpen,
    menuAnchorEl,
    snackbar,
    newCourseName,
    newCourseTerm,
    newCourseDescription,
    createLoading,
    editCourseName,
    editCourseTerm,
    editCourseDescription,
    editLoading,
    handleCourseMenuClose,
    handleOpenCreateDialog,
    handleCreateCourse,
    handleOpenEditDialog,
    handleUpdateCourse,
    handleDeleteCourse,
    handleSnackbarClose,
    setCreateDialogOpen,
    setEditDialogOpen,
    setNewCourseName,
    setNewCourseTerm,
    setNewCourseDescription,
    setEditCourseName,
    setEditCourseTerm,
    setEditCourseDescription,
  } = useCourseManagement();

  const handleQuickCreateAssignment = (courseId?: number) => {
    setPreselectedCourseId(courseId);
    setAssignmentDialogOpen(true);
  };

  const handleAssignmentCreated = () => {
    refreshData();
    setAssignmentDialogOpen(false);
    setPreselectedCourseId(undefined);
  };

  if (loading || coursesLoading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  return (
    <>
      {/* Welcome Section */}
      <DashboardWelcome 
        userDisplayName={userProfile?.full_name}
        stats={stats}
      />

      {/* Statistics Grid */}
      <DashboardStats 
        stats={stats}
        loading={loading}
      />

      {/* Main Content Grid */}
      <Grid container spacing={4}>
        {/* Left Column - Upcoming Assignments */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <UpcomingAssignments 
            assignments={upcomingAssignments}
            courses={courses}
          />
        </Grid>

        {/* Right Column - Sidebar */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            <CourseSidebar 
              courses={courses}
              onCreateCourse={handleOpenCreateDialog}
            />
            <QuickActions 
              onCreateAssignment={() => handleQuickCreateAssignment()}
            />
          </Stack>
        </Grid>
      </Grid>

      {/* Course Management Dialogs */}
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

      {/* Course Actions Menu and Snackbar */}
      <CourseActions
        menuAnchorEl={menuAnchorEl}
        onMenuClose={handleCourseMenuClose}
        onEditCourse={() => handleOpenEditDialog()}
        onDeleteCourse={() => handleDeleteCourse()}
        onCreateCourse={handleOpenCreateDialog}
        snackbar={snackbar}
        onSnackbarClose={handleSnackbarClose}
      />

      {/* Assignment Creation Dialog */}
      <AssignmentDialog
        open={assignmentDialogOpen}
        onClose={() => {
          setAssignmentDialogOpen(false);
          setPreselectedCourseId(undefined);
        }}
        preselectedCourseId={preselectedCourseId}
        onAssignmentCreated={handleAssignmentCreated}
      />

      {/* Floating Action Button */}
      <Zoom in={true}>
        <Fab
          onClick={() => handleQuickCreateAssignment()}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: 'grey.900',
            color: 'white',
            boxShadow: theme.shadows[6],
            '&:hover': {
              bgcolor: 'grey.800',
              transform: 'scale(1.05)',
              boxShadow: theme.shadows[8]
            }
          }}
        >
          <AddIcon />
        </Fab>
      </Zoom>
    </>
  );
};

export default DashboardPage;