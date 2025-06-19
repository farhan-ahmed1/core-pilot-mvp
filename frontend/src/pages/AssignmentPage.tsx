import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Paper,
  Grid,
  Skeleton,
  Stack,
  Avatar
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  LibraryBooks as AssignmentIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  EventNote as CalendarIcon,
  Description as DescriptionIcon,
  School as SchoolIcon,
  AutoStories as BookIcon,
  Timeline as ProgressIcon,
  Insights as AnalyticsIcon
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Import shared components
import Header from '../components/Header';

// Import API functions
import {
  getAssignment,
  updateAssignment,
  deleteAssignment,
  formatDueDate,
  getDueDateStatus,
  getDueDateColor,
  Assignment,
  AssignmentUpdate
} from '../services/assignmentService';
import { getCourse, Course } from '../services/courseService';

const AssignmentPage: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // State management
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Form state for editing
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    prompt: '',
    due_date: ''
  });

  // Get the referrer from location state or default to assignments list
  const getReferrerPath = () => {
    // Check if we have navigation state indicating where we came from
    if (location.state?.from) {
      return location.state.from;
    }
    
    // Check browser history to see if we came from dashboard or assignments
    const referrer = document.referrer;
    if (referrer.includes('/dashboard')) {
      return '/dashboard';
    } else if (referrer.includes('/assignments')) {
      return '/assignments';
    }
    
    // Default fallback to assignments list
    return '/assignments';
  };

  // Fetch assignment and course data
  useEffect(() => {
    const fetchData = async () => {
      if (!assignmentId) {
        setError('Assignment ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const assignmentData = await getAssignment(parseInt(assignmentId));
        setAssignment(assignmentData);
        
        // Initialize edit form
        setEditForm({
          title: assignmentData.title,
          description: assignmentData.description,
          prompt: assignmentData.prompt,
          due_date: assignmentData.due_date
        });

        // Fetch course data
        const courseData = await getCourse(assignmentData.course_id);
        setCourse(courseData);
      } catch (error: any) {
        setError(error.message || 'Failed to load assignment');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assignmentId]);

  // Event handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleEditClick = () => {
    setEditMode(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleSaveEdit = async () => {
    if (!assignment) return;

    try {
      setSaving(true);
      const updateData: AssignmentUpdate = {};
      
      if (editForm.title !== assignment.title) updateData.title = editForm.title;
      if (editForm.description !== assignment.description) updateData.description = editForm.description;
      if (editForm.prompt !== assignment.prompt) updateData.prompt = editForm.prompt;
      if (editForm.due_date !== assignment.due_date) updateData.due_date = editForm.due_date;

      const updatedAssignment = await updateAssignment(assignment.id, updateData);
      setAssignment(updatedAssignment);
      setEditMode(false);
      setSnackbar({
        open: true,
        message: 'Assignment updated successfully!',
        severity: 'success'
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update assignment',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (!assignment) return;
    
    setEditForm({
      title: assignment.title,
      description: assignment.description,
      prompt: assignment.prompt,
      due_date: assignment.due_date
    });
    setEditMode(false);
  };

  const handleDeleteConfirm = async () => {
    if (!assignment) return;

    try {
      await deleteAssignment(assignment.id);
      setSnackbar({
        open: true,
        message: 'Assignment deleted successfully!',
        severity: 'success'
      });
      setTimeout(() => {
        navigate(getReferrerPath());
      }, 1000);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to delete assignment',
        severity: 'error'
      });
    }
    setDeleteDialogOpen(false);
  };

  const handleBack = () => {
    navigate(getReferrerPath());
  };

  if (loading) {
    return (
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'grey.50' }}>
        <Header title="Core Pilot" />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Skeleton variant="rectangular" height={60} sx={{ mb: 3, borderRadius: 3 }} />
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
        </Container>
      </Box>
    );
  }

  if (error || !assignment || !course) {
    return (
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'grey.50' }}>
        <Header title="Core Pilot" />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Alert severity="error">{error || 'Assignment not found'}</Alert>
        </Container>
      </Box>
    );
  }

  const dueDateStatus = getDueDateStatus(assignment);
  const dueDateColor = getDueDateColor(dueDateStatus);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'grey.50' }}>
        <Header title="Core Pilot" />
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* Header with navigation and actions */}
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
                top: -30,
                right: -30,
                width: 120,
                height: 120,
                borderRadius: '50%',
                bgcolor: alpha('#fff', 0.1),
                zIndex: 0
              }}
            />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center">
                  <IconButton 
                    onClick={handleBack} 
                    sx={{ 
                      mr: 2, 
                      color: 'white',
                      bgcolor: alpha('#fff', 0.1),
                      '&:hover': { bgcolor: alpha('#fff', 0.2) }
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <Box>
                    <Typography variant="h4" component="h1" fontWeight="800" gutterBottom>
                      {assignment.title}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Chip
                        icon={<SchoolIcon />}
                        label={`${course.name} • ${course.term}`}
                        sx={{
                          bgcolor: alpha('#fff', 0.15),
                          color: 'white',
                          fontWeight: 600,
                          '& .MuiChip-icon': { color: 'white' }
                        }}
                      />
                      <Chip
                        label={dueDateStatus === 'overdue' ? 'Overdue' : dueDateStatus === 'due-soon' ? 'Due Soon' : 'Upcoming'}
                        color={dueDateColor}
                        icon={<ScheduleIcon />}
                        variant="filled"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Box>
                </Box>
                
                <Box display="flex" alignItems="center" gap={2}>
                  {!editMode && (
                    <IconButton 
                      onClick={handleMenuOpen}
                      sx={{ 
                        color: 'white',
                        bgcolor: alpha('#fff', 0.1),
                        '&:hover': { bgcolor: alpha('#fff', 0.2) }
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  )}
                  
                  {editMode && (
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleCancelEdit}
                        disabled={saving}
                        sx={{
                          color: 'white',
                          borderColor: alpha('#fff', 0.3),
                          '&:hover': {
                            borderColor: 'white',
                            bgcolor: alpha('#fff', 0.1)
                          }
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveEdit}
                        disabled={saving}
                        sx={{
                          bgcolor: 'white',
                          color: theme.palette.primary.main,
                          '&:hover': {
                            bgcolor: alpha('#fff', 0.9)
                          }
                        }}
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Stack>
                  )}
                </Box>
              </Box>
            </Box>
          </Paper>

          <Grid container spacing={3}>
            {/* Main content */}
            <Grid size={{xs:12, md:8}}>
              <Card elevation={3} sx={{ mb: 3, borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  {/* Due Date */}
                  <Box display="flex" alignItems="center" mb={3}>
                    <Avatar sx={{ 
                      mr: 2, 
                      bgcolor: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      width: 48,
                      height: 48
                    }}>
                      <CalendarIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                        Due Date
                      </Typography>
                      {editMode ? (
                        <DateTimePicker
                          value={new Date(editForm.due_date)}
                          onChange={(date) => setEditForm({ ...editForm, due_date: date?.toISOString() || '' })}
                          sx={{ mt: 1 }}
                        />
                      ) : (
                        <Typography variant="h6" fontWeight="700">
                          {formatDueDate(assignment.due_date)}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Title */}
                  <Box display="flex" alignItems="center" mb={3}>
                    <Avatar sx={{ 
                      mr: 2, 
                      bgcolor: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`,
                      width: 48,
                      height: 48
                    }}>
                      <AssignmentIcon />
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                        Assignment Title
                      </Typography>
                      {editMode ? (
                        <TextField
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          fullWidth
                          variant="outlined"
                          sx={{ mt: 1 }}
                        />
                      ) : (
                        <Typography variant="h5" fontWeight="700">
                          {assignment.title}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Description */}
                  <Box display="flex" alignItems="flex-start" mb={3}>
                    <Avatar sx={{ 
                      mr: 2, 
                      bgcolor: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.light})`,
                      width: 48,
                      height: 48
                    }}>
                      <DescriptionIcon />
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight={600}>
                        Description
                      </Typography>
                      {editMode ? (
                        <TextField
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          fullWidth
                          multiline
                          rows={3}
                          variant="outlined"
                          placeholder="Assignment description..."
                        />
                      ) : (
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {assignment.description || 'No description provided.'}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Prompt */}
                  <Box>
                    <Typography variant="h6" gutterBottom fontWeight="700" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BookIcon />
                      Assignment Instructions
                    </Typography>
                    {editMode ? (
                      <TextField
                        value={editForm.prompt}
                        onChange={(e) => setEditForm({ ...editForm, prompt: e.target.value })}
                        fullWidth
                        multiline
                        rows={8}
                        variant="outlined"
                        placeholder="Enter assignment instructions and requirements..."
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    ) : (
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          border: 1,
                          borderColor: alpha(theme.palette.primary.main, 0.2),
                          borderRadius: 3
                        }}
                      >
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                          {assignment.prompt}
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Sidebar */}
            <Grid size={{xs:12, md:4}}>
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom fontWeight="700" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AnalyticsIcon />
                    Assignment Details
                  </Typography>
                  
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                        Course
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {course.name}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                        Term
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {course.term}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                        Created
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {new Date(assignment.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>

                    {assignment.updated_at && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                          Last Updated
                        </Typography>
                        <Typography variant="body1" fontWeight="600">
                          {new Date(assignment.updated_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}

                    <Divider />

                    <Button
                      variant="contained"
                      startIcon={<ProgressIcon />}
                      fullWidth
                      size="large"
                      sx={{ 
                        borderRadius: 3,
                        py: 2,
                        textTransform: 'none',
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                      }}
                    >
                      Start Working
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Action Menu */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 8,
            sx: {
              borderRadius: 3,
              minWidth: 160,
              '& .MuiMenuItem-root': {
                borderRadius: 1,
                mx: 1,
                my: 0.5
              }
            }
          }}
        >
          <MenuItem onClick={handleEditClick}>
            <EditIcon sx={{ mr: 1 }} fontSize="small" />
            Edit Assignment
          </MenuItem>
          <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
            Delete Assignment
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight="700">Delete Assignment</Typography>
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{assignment.title}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error" 
              variant="contained"
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
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
      </Box>
    </LocalizationProvider>
  );
};

export default AssignmentPage;