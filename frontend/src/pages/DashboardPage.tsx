// Enhanced Dashboard Page showing user-specific courses and assignments
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Paper,
  Avatar,
  Chip,
  Fab,
  Zoom,
  Fade,
  alpha,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  RocketLaunch as RocketIcon,
  CalendarToday as CalendarIcon} from '@mui/icons-material';

// Import services and components
import { useAuth } from '../contexts/AuthContext';
import { 
  getAssignmentStats, 
  getUpcomingAssignments, 
  AssignmentStats, 
  AssignmentListItem,
  formatDueDate,
  getDueDateStatus,
  getDueDateColor
} from '../services/assignmentService';
import CourseGrid from '../components/CourseGrid';
import CourseDialogs from '../components/CourseDialogs';
import CourseActions from '../components/CourseActions';
import AssignmentDialog from '../components/AssignmentDialog';
import LoadingScreen from '../components/LoadingScreen';
import { useCourseManagement } from '../hooks/useCourseManagement';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { userProfile } = useAuth();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AssignmentStats | null>(null);
  const [upcomingAssignments, setUpcomingAssignments] = useState<AssignmentListItem[]>([]);
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

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load stats and upcoming assignments in parallel
      const [statsData, upcomingData] = await Promise.all([
        getAssignmentStats(),
        getUpcomingAssignments(5)
      ]);
      
      setStats(statsData);
      setUpcomingAssignments(upcomingData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCreateAssignment = (courseId?: number) => {
    setPreselectedCourseId(courseId);
    setAssignmentDialogOpen(true);
  };

  const handleAssignmentCreated = () => {
    // Refresh dashboard data
    loadDashboardData();
    setAssignmentDialogOpen(false);
    setPreselectedCourseId(undefined);
  };

  const handleAssignmentClick = (assignmentId: number) => {
    navigate(`/assignments/${assignmentId}`);
  };

  const renderWelcomeSection = () => (
    <Fade in timeout={800}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative background elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: alpha('#fff', 0.1),
            zIndex: 0
          }}
        />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h3" component="h1" fontWeight="800" gutterBottom>
                Welcome back, {userProfile?.full_name?.split(' ')[0] || 'Student'}!
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400, mb: 3 }}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
              
              {/* Quick stats */}
              <Box display="flex" gap={3} alignItems="center">
                <Box display="flex" alignItems="center" gap={1}>
                  <SchoolIcon />
                  <Typography variant="body1" fontWeight={600}>
                    {courses.length} Courses
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <AssignmentIcon />
                  <Typography variant="body1" fontWeight={600}>
                    {stats?.total_assignments || 0} Assignments
                  </Typography>
                </Box>
                {stats && stats.overdue > 0 && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <WarningIcon color="warning" />
                    <Typography variant="body1" fontWeight={600} color="warning.light">
                      {stats.overdue} Overdue
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
            
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: alpha('#fff', 0.15),
                border: `3px solid ${alpha('#fff', 0.3)}`
              }}
            >
              <RocketIcon sx={{ fontSize: 50 }} />
            </Avatar>
          </Box>
        </Box>
      </Paper>
    </Fade>
  );

  const renderStatsGrid = () => {
    if (!stats) return null;

    const statCards = [
      {
        title: 'Total Assignments',
        value: stats.total_assignments,
        icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
        color: theme.palette.primary.main,
        bgColor: alpha(theme.palette.primary.main, 0.1)
      },
      {
        title: 'Overdue',
        value: stats.overdue,
        icon: <WarningIcon sx={{ fontSize: 40 }} />,
        color: theme.palette.error.main,
        bgColor: alpha(theme.palette.error.main, 0.1)
      },
      {
        title: 'Due Soon',
        value: stats.due_soon,
        icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
        color: theme.palette.warning.main,
        bgColor: alpha(theme.palette.warning.main, 0.1)
      },
      {
        title: 'Upcoming',
        value: stats.upcoming,
        icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
        color: theme.palette.success.main,
        bgColor: alpha(theme.palette.success.main, 0.1)
      }
    ];

    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid key={stat.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <Fade in timeout={600 + (index * 100)}>
              <Card
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 30px ${alpha(stat.color, 0.2)}`
                  }
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h3" fontWeight="800" color={stat.color}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" fontWeight={600} color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      bgcolor: stat.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {React.cloneElement(stat.icon, { sx: { ...stat.icon.props.sx, color: stat.color } })}
                  </Box>
                </Box>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderUpcomingAssignments = () => (
    <Card elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: theme.palette.info.main }}>
              <CalendarIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="700">
                Upcoming Assignments
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your next {upcomingAssignments.length} assignments
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            onClick={() => navigate('/assignments')}
            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
          >
            View All
          </Button>
        </Box>

        {upcomingAssignments.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
              <CheckCircleIcon color="primary" />
            </Avatar>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              All caught up!
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              You have no upcoming assignments. Create a new one to get started.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleQuickCreateAssignment()}
              sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700 }}
            >
              Create Assignment
            </Button>
          </Box>
        ) : (
          <Box>
            {upcomingAssignments.map((assignment, index) => {
              const status = getDueDateStatus(assignment);
              const statusColor = getDueDateColor(status);
              const course = courses.find(c => c.id === assignment.course_id);

              return (
                <Fade key={assignment.id} in timeout={400 + (index * 100)}>
                  <Card
                    elevation={1}
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateX(8px)',
                        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`
                      }
                    }}
                    onClick={() => handleAssignmentClick(assignment.id)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box flex={1}>
                          <Box display="flex" alignItems="center" gap={2} mb={1}>
                            <Chip
                              label={course?.name || 'Unknown Course'}
                              size="small"
                              variant="outlined"
                              sx={{ borderRadius: 2 }}
                            />
                            <Chip
                              label={status === 'overdue' ? 'Overdue' : status === 'due-soon' ? 'Due Soon' : 'Upcoming'}
                              color={statusColor}
                              size="small"
                              variant="filled"
                              sx={{ borderRadius: 2, fontWeight: 600 }}
                            />
                          </Box>
                          <Typography variant="h6" fontWeight="600" gutterBottom>
                            {assignment.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Due: {formatDueDate(assignment.due_date)}
                          </Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                          <AssignmentIcon color="primary" />
                        </Avatar>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              );
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (loading || coursesLoading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  return (
    <>
      {/* Welcome Section */}
      {renderWelcomeSection()}

      {/* Statistics Grid */}
      {renderStatsGrid()}

      {/* Upcoming Assignments */}
      {renderUpcomingAssignments()}

      {/* Courses Section */}
      <Card elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                <SchoolIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="700">
                  Your Courses
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your {courses.length} active courses
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreateDialog}
              sx={{ 
                borderRadius: 3, 
                textTransform: 'none', 
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`
              }}
            >
              Add Course
            </Button>
          </Box>

          {courses.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: alpha(theme.palette.secondary.main, 0.1), width: 64, height: 64 }}>
                <SchoolIcon sx={{ fontSize: 32 }} color="secondary" />
              </Avatar>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                No courses yet
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Create your first course to start organizing your assignments
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenCreateDialog}
                size="large"
                sx={{ 
                  borderRadius: 3, 
                  textTransform: 'none', 
                  fontWeight: 700,
                  px: 4,
                  py: 1.5 
                }}
              >
                Create Your First Course
              </Button>
            </Box>
          ) : (
            <CourseGrid
              courses={courses}
              assignments={[]} // Will be populated from backend
              onCourseEdit={handleOpenEditDialog}
              onCourseDelete={handleDeleteCourse}
              onAssignmentClick={handleAssignmentClick}
              onAddAssignment={handleQuickCreateAssignment}
            />
          )}
        </CardContent>
      </Card>

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

      {/* Floating Action Button for Quick Assignment Creation */}
      <Zoom in={true}>
        <Fab
          color="primary"
          onClick={() => handleQuickCreateAssignment()}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            boxShadow: theme.shadows[12]
          }}
        >
          <AddIcon />
        </Fab>
      </Zoom>
    </>
  );
};

export default DashboardPage;