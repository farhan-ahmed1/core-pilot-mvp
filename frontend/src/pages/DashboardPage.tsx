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
  Avatar,
  Chip,
  Fab,
  Zoom,
  Fade,
  Skeleton,
  IconButton,
  LinearProgress,
  Stack,
  alpha,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  ArrowForward as ArrowForwardIcon,
  Timeline as TimelineIcon,
  TrackChanges as TargetIcon,
  MoreHoriz as MoreHorizIcon,
  Analytics as ActivityIcon
} from '@mui/icons-material';

// Import services and hooks
import { useAuth } from '../contexts/AuthContext';
import { 
  getAssignmentStats, 
  getUpcomingAssignments, 
  AssignmentStats, 
  AssignmentListItem,
  getDueDateStatus,
  getDueDateColor
} from '../services/assignmentService';
import { useCourseManagement } from '../hooks/useCourseManagement';

// Import dialogs and components
import CourseDialogs from '../components/CourseDialogs';
import CourseActions from '../components/CourseActions';
import AssignmentDialog from '../components/AssignmentDialog';
import LoadingScreen from '../components/LoadingScreen';

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
      const [statsData, upcomingData] = await Promise.all([
        getAssignmentStats(),
        getUpcomingAssignments(4)
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
    loadDashboardData();
    setAssignmentDialogOpen(false);
    setPreselectedCourseId(undefined);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusMessage = () => {
    if (!stats) return 'Ready to learn something new today?';
    const messages = [];
    if (stats.due_soon > 0) messages.push(`${stats.due_soon} assignments due soon`);
    if (stats.overdue > 0) messages.push(`${stats.overdue} overdue items that need attention`);
    
    if (messages.length === 0) return 'You\'re all caught up! Great work staying organized.';
    return `You have ${messages.join(' and ')}.`;
  };

  const getPriorityBorder = (assignment: AssignmentListItem) => {
    const status = getDueDateStatus(assignment);
    if (status === 'overdue') return 'error.main';
    if (status === 'due-soon') return 'warning.main';
    return 'grey.200';
  };

  const getPriorityBackground = (assignment: AssignmentListItem) => {
    const status = getDueDateStatus(assignment);
    if (status === 'overdue') return alpha(theme.palette.error.main, 0.05);
    if (status === 'due-soon') return alpha(theme.palette.warning.main, 0.05);
    return 'grey.50';
  };

  const formatDueDateMessage = (assignment: AssignmentListItem) => {
    const date = new Date(assignment.due_date);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  // Component for welcome section
  const WelcomeSection = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" fontWeight="600" color="text.primary" gutterBottom>
        {getGreeting()}, {userProfile?.full_name?.split(' ')[0] || 'Student'}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {getStatusMessage()}
      </Typography>
    </Box>
  );

  // Component for statistics cards
  const StatsGrid = () => {
    if (!stats) return <StatsGridSkeleton />;

    const statCards = [
      {
        title: 'Total Assignments',
        value: stats.total_assignments,
        icon: <TargetIcon />,
        bgColor: 'grey.100',
        iconColor: 'grey.600',
      },
      {
        title: 'Completed',
        value: stats.total_assignments - stats.overdue - stats.due_soon - stats.upcoming,
        icon: <CheckCircleIcon />,
        bgColor: 'success.50',
        iconColor: 'success.600',
      },
      {
        title: 'Due Soon',
        value: stats.due_soon,
        icon: <AccessTimeIcon />,
        bgColor: 'warning.50',
        iconColor: 'warning.600',
      },
      {
        title: 'Completion Rate',
        value: stats.total_assignments > 0 ? Math.round(((stats.total_assignments - stats.overdue - stats.due_soon - stats.upcoming) / stats.total_assignments) * 100) : 0,
        suffix: '%',
        icon: <TrendingUpIcon />,
        bgColor: 'primary.50',
        iconColor: 'primary.600',
      }
    ];

    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
            <Fade in timeout={400 + (index * 100)}>
              <Card
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: 'grey.200',
                  borderRadius: 3,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: theme.shadows[2]
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="caption" fontWeight="500" color="text.secondary" gutterBottom>
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" fontWeight="600" color="text.primary">
                        {stat.value}{stat.suffix || ''}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: stat.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {React.cloneElement(stat.icon, { 
                        sx: { fontSize: 24, color: stat.iconColor } 
                      })}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Skeleton for loading state
  const StatsGridSkeleton = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {[1, 2, 3, 4].map((item) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
          <Card sx={{ p: 3, border: 1, borderColor: 'grey.200' }}>
            <Skeleton variant="rectangular" height={60} />
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  // Main content grid
  const MainContent = () => (
    <Grid container spacing={4}>
      {/* Left Column - Upcoming Assignments */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <Card elevation={0} sx={{ border: 1, borderColor: 'grey.200', borderRadius: 3 }}>
          <Box sx={{ p: 3, borderBottom: 1, borderColor: 'grey.200' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Upcoming Assignments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your next deadlines and priorities
                </Typography>
              </Box>
              <Button
                variant="text"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/assignments')}
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 500,
                  color: 'text.secondary'
                }}
              >
                View all
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ p: 3 }}>
            {upcomingAssignments.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: 'success.50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  <CheckCircleIcon sx={{ color: 'success.600', fontSize: 24 }} />
                </Box>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  All caught up!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No upcoming deadlines. Great work staying organized!
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {upcomingAssignments.map((assignment, index) => {
                  const status = getDueDateStatus(assignment);
                  const statusColor = getDueDateColor(status);
                  const course = courses.find(c => c.id === assignment.course_id);

                  return (
                    <Fade key={assignment.id} in timeout={300 + (index * 100)}>
                      <Card
                        elevation={0}
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          border: 1,
                          borderColor: 'grey.200',
                          borderRadius: 2,
                          borderLeftWidth: 4,
                          borderLeftColor: getPriorityBorder(assignment),
                          bgcolor: getPriorityBackground(assignment),
                          '&:hover': {
                            boxShadow: theme.shadows[2],
                            transform: 'translateY(-1px)'
                          }
                        }}
                        onClick={() => navigate(`/assignments/${assignment.id}`)}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Box display="flex" alignItems="start" justifyContent="space-between">
                            <Box flex={1}>
                              <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <Chip
                                  label={status === 'overdue' ? 'Overdue' : status === 'due-soon' ? 'Due Soon' : 'Upcoming'}
                                  color={statusColor}
                                  size="small"
                                  variant="filled"
                                  sx={{ 
                                    borderRadius: 1, 
                                    fontWeight: 500, 
                                    fontSize: '0.6875rem',
                                    height: 20
                                  }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  {course?.name || 'Unknown Course'}
                                </Typography>
                              </Box>
                              <Typography variant="subtitle1" fontWeight="500" gutterBottom>
                                {assignment.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {formatDueDateMessage(assignment)}
                              </Typography>
                              
                              {/* Progress bar placeholder - could be implemented with assignment progress */}
                              <Box sx={{ mt: 2 }}>
                                <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                                  <Typography variant="caption" color="text.secondary">
                                    Progress
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    65%
                                  </Typography>
                                </Box>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={65} 
                                  sx={{ 
                                    height: 4, 
                                    borderRadius: 2,
                                    bgcolor: 'grey.200',
                                    '& .MuiLinearProgress-bar': {
                                      bgcolor: 'grey.900',
                                      borderRadius: 2
                                    }
                                  }} 
                                />
                              </Box>
                            </Box>
                            <IconButton 
                              size="small" 
                              sx={{ 
                                opacity: 0, 
                                '.MuiCard-root:hover &': { opacity: 1 },
                                transition: 'opacity 0.2s'
                              }}
                            >
                              <MoreHorizIcon sx={{ fontSize: 16, color: 'grey.400' }} />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </Fade>
                  );
                })}
              </Stack>
            )}
          </Box>
        </Card>
      </Grid>

      {/* Right Column - Sidebar */}
      <Grid size={{ xs: 12, lg: 4 }}>
        <Stack spacing={3}>
          {/* Active Courses */}
          <Card elevation={0} sx={{ border: 1, borderColor: 'grey.200', borderRadius: 3 }}>
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'grey.200' }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Active Courses
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your current semester
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              {courses.length === 0 ? (
                <Box textAlign="center" py={2}>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    No courses yet
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleOpenCreateDialog}
                    sx={{ textTransform: 'none', fontWeight: 500 }}
                  >
                    Add Course
                  </Button>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {courses.slice(0, 4).map((course) => (
                    <Box key={course.id} sx={{ cursor: 'pointer' }}>
                      <Box 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="space-between" 
                        p={1.5} 
                        borderRadius={2}
                        sx={{
                          '&:hover': {
                            bgcolor: 'grey.50'
                          }
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: theme.palette.primary.main
                            }}
                          />
                          <Box>
                            <Typography variant="body2" fontWeight="500">
                              {course.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {course.term}
                            </Typography>
                          </Box>
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="body2" fontWeight="500">
                            0/5
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            assignments
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ mx: 1.5, mt: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={0} 
                          sx={{ 
                            height: 2, 
                            borderRadius: 1,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: 'grey.900',
                              borderRadius: 1
                            }
                          }} 
                        />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Card>

          {/* Quick Actions */}
          <Card elevation={0} sx={{ border: 1, borderColor: 'grey.200', borderRadius: 3 }}>
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'grey.200' }}>
              <Typography variant="h6" fontWeight="600">
                Quick Actions
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <Stack spacing={1}>
                <Button
                  fullWidth
                  variant="text"
                  startIcon={<AddIcon />}
                  onClick={() => handleQuickCreateAssignment()}
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    fontWeight: 500,
                    py: 1.5,
                    px: 2,
                    borderRadius: 2,
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'grey.50'
                    }
                  }}
                >
                  Add Assignment
                </Button>
                <Button
                  fullWidth
                  variant="text"
                  startIcon={<CalendarIcon />}
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    fontWeight: 500,
                    py: 1.5,
                    px: 2,
                    borderRadius: 2,
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'grey.50'
                    }
                  }}
                >
                  View Calendar
                </Button>
                <Button
                  fullWidth
                  variant="text"
                  startIcon={<ActivityIcon />}
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    fontWeight: 500,
                    py: 1.5,
                    px: 2,
                    borderRadius: 2,
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'grey.50'
                    }
                  }}
                >
                  View Analytics
                </Button>
              </Stack>
            </Box>
          </Card>
        </Stack>
      </Grid>
    </Grid>
  );

  if (loading || coursesLoading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  return (
    <>
      {/* Welcome Section */}
      <WelcomeSection />

      {/* Statistics Grid */}
      <StatsGrid />

      {/* Main Content */}
      <MainContent />

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