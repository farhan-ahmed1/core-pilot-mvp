import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
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
  Stack,
  Avatar,
  Breadcrumbs,
  Link,
  CircularProgress
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
  Insights as AnalyticsIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Import shared components
import LoadingScreen from '../components/LoadingScreen';

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
    return <LoadingScreen message="Loading assignment..." />;
  }

  if (error || !assignment || !course) {
    return (
      <Alert severity="error" sx={{ borderRadius: 3 }}>
        {error || 'Assignment not found'}
      </Alert>
    );
  }

  const dueDateStatus = getDueDateStatus(assignment);
  const dueDateColor = getDueDateColor(dueDateStatus);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* Enhanced Navigation Header */}
      <Box sx={{ mb: 3 }}>
        {/* Breadcrumb Navigation */}
        <Box sx={{ mb: 2 }}>
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
              onClick={() => navigate('/dashboard')}
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
              onClick={() => navigate('/assignments')}
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline'
                }
              }}
            >
              Assignments
            </Link>
            <Typography variant="body2" color="text.primary" fontWeight={500}>
              {assignment.title}
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* Page Header */}
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={3}>
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <IconButton
                onClick={handleBack}
                size="small"
                sx={{
                  bgcolor: 'grey.100',
                  '&:hover': {
                    bgcolor: 'grey.200'
                  }
                }}
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
              <Box>
                <Typography variant="overline" color="text.secondary" fontWeight={600} letterSpacing={1}>
                  {course.name} • {course.term}
                </Typography>
                <Typography variant="h4" fontWeight="700" color="text.primary" sx={{ lineHeight: 1.2 }}>
                  {editMode ? (
                    <TextField
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      variant="standard"
                      sx={{
                        '& .MuiInput-input': {
                          fontSize: '2.125rem',
                          fontWeight: 700,
                          p: 0
                        },
                        '& .MuiInput-underline:before': {
                          borderBottomColor: 'divider'
                        }
                      }}
                      fullWidth
                      autoFocus
                    />
                  ) : (
                    assignment.title
                  )}
                </Typography>
              </Box>
            </Box>
            
            {/* Status and Due Date Row */}
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Chip
                label={dueDateStatus === 'overdue' ? 'Overdue' : dueDateStatus === 'due-soon' ? 'Due Soon' : 'Upcoming'}
                color={dueDateColor}
                variant="filled"
                size="medium"
                sx={{ fontWeight: 600 }}
              />
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Due {editMode ? (
                    <DateTimePicker
                      value={new Date(editForm.due_date)}
                      onChange={(date) => setEditForm({ ...editForm, due_date: date?.toISOString() || '' })}
                      slotProps={{
                        textField: {
                          size: 'small',
                          sx: { ml: 1, minWidth: 200 }
                        }
                      }}
                    />
                  ) : (
                    formatDueDate(assignment.due_date)
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Action Controls */}
          <Box display="flex" alignItems="center" gap={1}>
            {editMode ? (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEdit}
                  disabled={saving}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                  onClick={handleSaveEdit}
                  disabled={saving}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Stack>
            ) : (
              <>
                <Button
                  variant="contained"
                  startIcon={<ProgressIcon />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                  }}
                >
                  Start Working
                </Button>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    bgcolor: 'grey.100',
                    '&:hover': {
                      bgcolor: 'grey.200'
                    }
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main content */}
        <Grid size={{xs:12, md:8}}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'grey.200', borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              {/* Description Section */}
              {(assignment.description || editMode) && (
                <>
                  <Box mb={4}>
                    <Typography variant="h6" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DescriptionIcon sx={{ fontSize: 20 }} />
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
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    ) : (
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                        {assignment.description || 'No description provided.'}
                      </Typography>
                    )}
                  </Box>
                  <Divider sx={{ my: 3 }} />
                </>
              )}

              {/* Instructions Section */}
              <Box>
                <Typography variant="h6" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BookIcon sx={{ fontSize: 20 }} />
                  Assignment Instructions
                </Typography>
                {editMode ? (
                  <TextField
                    value={editForm.prompt}
                    onChange={(e) => setEditForm({ ...editForm, prompt: e.target.value })}
                    fullWidth
                    multiline
                    rows={12}
                    variant="outlined"
                    placeholder="Enter assignment instructions and requirements..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: 'grey.50'
                      }
                    }}
                  />
                ) : (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      bgcolor: 'grey.50',
                      borderRadius: 2,
                      border: 1,
                      borderColor: 'grey.200'
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
          <Card elevation={0} sx={{ border: 1, borderColor: 'grey.200', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AnalyticsIcon sx={{ fontSize: 20 }} />
                Assignment Details
              </Typography>
              
              <Stack spacing={3}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={1}>
                    Course
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {course.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.term}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={1}>
                    Created
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {new Date(assignment.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>

                {assignment.updated_at && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={1}>
                      Last Updated
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {new Date(assignment.updated_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Typography>
                  </Box>
                )}

                <Divider />

                {/* Quick Actions */}
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={1} gutterBottom>
                    Quick Actions
                  </Typography>
                  <Stack spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        borderRadius: 2,
                        justifyContent: 'flex-start'
                      }}
                    >
                      Generate AI Breakdown
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        borderRadius: 2,
                        justifyContent: 'flex-start'
                      }}
                    >
                      View Similar Assignments
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
    </LocalizationProvider>
  );
};

export default AssignmentPage;