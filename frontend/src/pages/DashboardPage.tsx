import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Divider,
  Button,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  ListItemButton,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Fab,
  Tooltip,
  Paper,
  Avatar,
  LinearProgress,
  Skeleton,
  Fade,
  Slide,
  Zoom,
  Grid
} from '@mui/material';
import { 
  Add as AddIcon, 
  MoreVert as MoreVertIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MenuBook as MenuBookIcon,
  GradingOutlined as GradingIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';

// Import shared components
import Header from '../components/Header';

// Import API functions with proper types
import { 
  getCourses, 
  createCourse, 
  updateCourse, 
  deleteCourse, 
  Course,
  CourseCreate,
  CourseUpdate 
} from '../services/courseService';

// Animation variants for Framer Motion-like effects
const fadeInUp = {
  initial: { opacity: 0, transform: 'translateY(20px)' },
  animate: { opacity: 1, transform: 'translateY(0px)' },
  transition: { duration: 0.5 }
};

interface Assignment {
  id: number;
  courseId: number;
  title: string;
  dueDate: string;
  status: 'no_draft' | 'draft_saved' | 'feedback_ready';
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourseOpen, setNewCourseOpen] = useState(false);
  const [editCourseOpen, setEditCourseOpen] = useState(false);
  const [courseForm, setCourseForm] = useState<CourseCreate>({ name: '', term: '', description: '' });
  const [editCourseId, setEditCourseId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Mock assignment data with better structure
  const [assignments] = useState<Assignment[]>([
    { id: 1, courseId: 1, title: 'Advanced Algorithm Design', dueDate: '2025-06-25', status: 'feedback_ready' },
    { id: 2, courseId: 1, title: 'Data Structures Implementation', dueDate: '2025-07-01', status: 'draft_saved' },
    { id: 3, courseId: 2, title: 'Responsive Web Components', dueDate: '2025-06-20', status: 'no_draft' },
    { id: 4, courseId: 2, title: 'Advanced CSS Animations', dueDate: '2025-06-28', status: 'draft_saved' },
    { id: 5, courseId: 3, title: 'Neural Network Architecture', dueDate: '2025-07-05', status: 'no_draft' },
  ]);

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await getCourses();
        setCourses(coursesData);
        setSnackbar({ open: true, message: 'Courses loaded successfully!', severity: 'success' });
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setSnackbar({ open: true, message: 'Failed to load courses', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Utility functions
  const getAssignmentsForCourse = (courseId: number) => {
    return assignments.filter(assignment => assignment.courseId === courseId);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'feedback_ready': return 'success';
      case 'draft_saved': return 'warning';
      case 'no_draft': default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'feedback_ready': return 'Feedback Ready';
      case 'draft_saved': return 'Draft Saved';
      case 'no_draft': default: return 'Not Started';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'feedback_ready': return <GradingIcon fontSize="small" />;
      case 'draft_saved': return <EditIcon fontSize="small" />;
      case 'no_draft': default: return <AssignmentIcon fontSize="small" />;
    }
  };

  // Event handlers
  const handleCourseMenuOpen = (event: React.MouseEvent<HTMLElement>, courseId: number) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedCourseId(courseId);
  };

  const handleCourseMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedCourseId(null);
  };

  const handleNavigateToAssignment = (assignmentId: number) => {
    navigate(`/assignments/${assignmentId}`);
  };

  const handleOpenNewCourse = () => {
    setCourseForm({ name: '', term: '', description: '' });
    setFormError(null);
    setNewCourseOpen(true);
  };

  const handleCloseNewCourse = () => setNewCourseOpen(false);

  const handleCreateCourse = async () => {
    if (!courseForm.name || !courseForm.term) {
      setFormError('Name and term are required');
      return;
    }
    
    try {
      const newCourse = await createCourse(courseForm);
      setCourses(prev => [newCourse, ...prev]);
      setNewCourseOpen(false);
      setSnackbar({ open: true, message: 'Course created successfully!', severity: 'success' });
    } catch (error: any) {
      setFormError(error.message || 'Failed to create course');
    }
  };

  const handleOpenEditCourse = (course: Course) => {
    setEditCourseId(course.id);
    setCourseForm({ name: course.name, term: course.term, description: course.description });
    setFormError(null);
    setEditCourseOpen(true);
  };

  const handleCloseEditCourse = () => setEditCourseOpen(false);

  const handleEditCourse = async () => {
    if (!editCourseId) return;
    
    try {
      const updated = await updateCourse(editCourseId, courseForm);
      setCourses(prev => prev.map(c => c.id === updated.id ? updated : c));
      setEditCourseOpen(false);
      setSnackbar({ open: true, message: 'Course updated successfully!', severity: 'success' });
    } catch (error: any) {
      setFormError(error.message || 'Failed to update course');
    }
  };

  const handleDeleteCourse = async (id: number) => {
    try {
      await deleteCourse(id);
      setCourses(prev => prev.filter(c => c.id !== id));
      setSnackbar({ open: true, message: 'Course deleted successfully!', severity: 'success' });
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message || 'Failed to delete course', severity: 'error' });
    }
  };

  // Statistics calculations
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === 'feedback_ready').length;
  const inProgressAssignments = assignments.filter(a => a.status === 'draft_saved').length;
  const completionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Header title="Core Pilot" />
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Hero Section with Statistics */}
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                Welcome to Your Learning Hub
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
                Track your progress, manage assignments, and excel in your courses
              </Typography>
              
              <Grid container spacing={3}>
                <Grid size={{xs:12, sm:6, md:3}}>
                  <Card sx={{ bgcolor: alpha('#fff', 0.15), backdropFilter: 'blur(10px)' }}>
                    <CardContent sx={{ textAlign: 'center', color: 'white' }}>
                      <SchoolIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold">{courses.length}</Typography>
                      <Typography variant="body2">Active Courses</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{xs:12, sm:6, md:3}}>
                  <Card sx={{ bgcolor: alpha('#fff', 0.15), backdropFilter: 'blur(10px)' }}>
                    <CardContent sx={{ textAlign: 'center', color: 'white' }}>
                      <AssignmentIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold">{totalAssignments}</Typography>
                      <Typography variant="body2">Total Assignments</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{xs:12, sm:6, md:3}}>
                  <Card sx={{ bgcolor: alpha('#fff', 0.15), backdropFilter: 'blur(10px)' }}>
                    <CardContent sx={{ textAlign: 'center', color: 'white' }}>
                      <TrendingUpIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold">{Math.round(completionRate)}%</Typography>
                      <Typography variant="body2">Completion Rate</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{xs:12, sm:6, md:3}}>
                  <Card sx={{ bgcolor: alpha('#fff', 0.15), backdropFilter: 'blur(10px)' }}>
                    <CardContent sx={{ textAlign: 'center', color: 'white' }}>
                      <ScheduleIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold">{inProgressAssignments}</Typography>
                      <Typography variant="body2">In Progress</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
            
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
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 150,
                height: 150,
                borderRadius: '50%',
                bgcolor: alpha('#fff', 0.05),
                zIndex: 0
              }}
            />
          </Paper>
        </Fade>

        {/* Page Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h2" fontWeight="bold" color="text.primary">
            Your Courses
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleOpenNewCourse}
            size="large"
            sx={{ 
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Create Course
          </Button>
        </Box>
        
        {/* Courses Grid */}
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid key={item} size={{xs:12, sm:6, md:3}}>
                <Card elevation={2}>
                  <CardContent>
                    <Skeleton variant="text" height={40} />
                    <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" height={120} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {courses.map((course, index) => (
              <Grid key={course.id} size={{xs:12, sm:6, md:3}}>
                <Slide direction="up" in timeout={600 + index * 100}>
                  <Card 
                    elevation={3}
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: theme.shadows[8]
                      },
                      borderRadius: 2,
                      overflow: 'hidden'
                    }}
                  >
                    {/* Course Header */}
                    <Box
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                        color: 'white',
                        p: 3,
                        position: 'relative'
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box flex={1}>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {course.name}
                          </Typography>
                          <Chip 
                            label={course.term} 
                            size="small" 
                            sx={{ 
                              bgcolor: alpha('#fff', 0.2),
                              color: 'white',
                              fontWeight: 500
                            }} 
                          />
                        </Box>
                        <IconButton 
                          onClick={(e) => handleCourseMenuOpen(e, course.id)}
                          sx={{ color: 'white' }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                      
                      {course.description && (
                        <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                          {course.description}
                        </Typography>
                      )}
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 0 }}>
                      {/* Assignment Progress */}
                      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Assignment Progress
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {getAssignmentsForCourse(course.id).filter(a => a.status === 'feedback_ready').length}/
                            {getAssignmentsForCourse(course.id).length}
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={
                            getAssignmentsForCourse(course.id).length > 0 
                              ? (getAssignmentsForCourse(course.id).filter(a => a.status === 'feedback_ready').length / 
                                 getAssignmentsForCourse(course.id).length) * 100 
                              : 0
                          }
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: alpha(theme.palette.primary.main, 0.1)
                          }}
                        />
                      </Box>

                      {/* Assignments List */}
                      <List dense sx={{ p: 0 }}>
                        {getAssignmentsForCourse(course.id).length > 0 ? (
                          getAssignmentsForCourse(course.id).slice(0, 3).map((assignment) => (
                            <ListItem key={assignment.id} disablePadding>
                              <ListItemButton 
                                onClick={() => handleNavigateToAssignment(assignment.id)}
                                sx={{ px: 2 }}
                              >
                                <Avatar 
                                  sx={{ 
                                    mr: 2, 
                                    width: 32, 
                                    height: 32,
                                    bgcolor: theme.palette.primary.main
                                  }}
                                >
                                  {getStatusIcon(assignment.status)}
                                </Avatar>
                                <ListItemText 
                                  primary={
                                    <Typography variant="body2" fontWeight={500}>
                                      {assignment.title}
                                    </Typography>
                                  }
                                  secondary={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                                />
                                <ListItemSecondaryAction>
                                  <Chip 
                                    size="small" 
                                    label={getStatusText(assignment.status)} 
                                    color={getStatusBadgeColor(assignment.status) as any}
                                    variant="filled"
                                  />
                                </ListItemSecondaryAction>
                              </ListItemButton>
                            </ListItem>
                          ))
                        ) : (
                          <ListItem>
                            <ListItemText 
                              primary={
                                <Typography variant="body2" color="text.secondary" textAlign="center">
                                  No assignments yet
                                </Typography>
                              }
                            />
                          </ListItem>
                        )}
                      </List>

                      <Divider />
                      
                      {/* Action Button */}
                      <Box sx={{ p: 2 }}>
                        <Button 
                          variant="outlined" 
                          startIcon={<AddIcon />} 
                          fullWidth
                          sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500
                          }}
                        >
                          Add Assignment
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty State */}
        {!loading && courses.length === 0 && (
          <Fade in timeout={800}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 8, 
                textAlign: 'center',
                bgcolor: 'background.paper',
                borderRadius: 3,
                border: 2,
                borderColor: 'divider',
                borderStyle: 'dashed'
              }}
            >
              <SchoolIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight="bold">
                No Courses Yet
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Get started by creating your first course and begin your learning journey!
              </Typography>
              <Button 
                variant="contained" 
                size="large" 
                startIcon={<AddIcon />}
                onClick={handleOpenNewCourse}
                sx={{ 
                  borderRadius: 2,
                  px: 4,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Create Your First Course
              </Button>
            </Paper>
          </Fade>
        )}
      </Container>

      {/* Floating Action Button */}
      <Zoom in timeout={1000}>
        <Fab
          color="primary"
          aria-label="add course"
          onClick={handleOpenNewCourse}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            boxShadow: theme.shadows[8]
          }}
        >
          <AddIcon />
        </Fab>
      </Zoom>

      {/* Course Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCourseMenuClose}
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: 2,
            minWidth: 180,
            '& .MuiMenuItem-root': {
              borderRadius: 1,
              mx: 1,
              my: 0.5
            }
          }
        }}
      >
        <MenuItem onClick={() => {
          const course = courses.find(c => c.id === selectedCourseId);
          if (course) handleOpenEditCourse(course);
          handleCourseMenuClose();
        }}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Edit Course
        </MenuItem>
        <MenuItem 
          onClick={() => {
            if (selectedCourseId) handleDeleteCourse(selectedCourseId);
            handleCourseMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Delete Course
        </MenuItem>
      </Menu>

      {/* New Course Dialog */}
      <Dialog 
        open={newCourseOpen} 
        onClose={handleCloseNewCourse}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" fontWeight="bold">Create New Course</Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField 
              label="Course Name" 
              value={courseForm.name} 
              onChange={e => setCourseForm({ ...courseForm, name: e.target.value })} 
              fullWidth 
              margin="normal"
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField 
              label="Term" 
              value={courseForm.term} 
              onChange={e => setCourseForm({ ...courseForm, term: e.target.value })} 
              fullWidth 
              margin="normal"
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField 
              label="Description" 
              value={courseForm.description} 
              onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} 
              fullWidth 
              margin="normal"
              multiline
              rows={3}
              variant="outlined"
              placeholder="Brief description of the course..."
            />
            {formError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {formError}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseNewCourse} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateCourse} 
            variant="contained"
            sx={{ 
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2
            }}
          >
            Create Course
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog 
        open={editCourseOpen} 
        onClose={handleCloseEditCourse}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" fontWeight="bold">Edit Course</Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField 
              label="Course Name" 
              value={courseForm.name} 
              onChange={e => setCourseForm({ ...courseForm, name: e.target.value })} 
              fullWidth 
              margin="normal"
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField 
              label="Term" 
              value={courseForm.term} 
              onChange={e => setCourseForm({ ...courseForm, term: e.target.value })} 
              fullWidth 
              margin="normal"
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField 
              label="Description" 
              value={courseForm.description} 
              onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} 
              fullWidth 
              margin="normal"
              multiline
              rows={3}
              variant="outlined"
              placeholder="Brief description of the course..."
            />
            {formError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {formError}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseEditCourse} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleEditCourse} 
            variant="contained"
            sx={{ 
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

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
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardPage;