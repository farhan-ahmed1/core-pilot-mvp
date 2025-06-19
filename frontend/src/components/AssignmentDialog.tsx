import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  Chip,
  Stack,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  LibraryBooks as AssignmentIcon,
  AutoStories as SchoolIcon,
  EventNote as ScheduleIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  NoteAdd as CreateIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { alpha, useTheme } from '@mui/material/styles';

// Import API functions
import { createAssignment, AssignmentCreate } from '../services/assignmentService';
import { getCourses, Course } from '../services/courseService';

interface AssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  preselectedCourseId?: number;
  onAssignmentCreated: (assignment: any) => void;
}

const AssignmentDialog: React.FC<AssignmentDialogProps> = ({
  open,
  onClose,
  preselectedCourseId,
  onAssignmentCreated
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  
  // Set default due date to tomorrow at 11:59 PM
  const getDefaultDueDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 0, 0);
    return tomorrow;
  };
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    prompt: '',
    due_date: getDefaultDueDate(),
    course_id: 0
  });

  const selectedCourse = courses.find(c => c.id === form.course_id);

  // Load courses when dialog opens
  useEffect(() => {
    if (open) {
      loadCourses();
      // Reset form when dialog opens
      setForm({
        title: '',
        description: '',
        prompt: '',
        due_date: getDefaultDueDate(),
        course_id: preselectedCourseId || 0
      });
      setError(null);
    }
  }, [open, preselectedCourseId]);

  // Set preselected course after courses are loaded
  useEffect(() => {
    if (courses.length > 0 && preselectedCourseId) {
      const courseExists = courses.find(c => c.id === preselectedCourseId);
      if (courseExists) {
        setForm(prev => ({ ...prev, course_id: preselectedCourseId }));
      }
    }
  }, [courses, preselectedCourseId]);

  const loadCourses = async () => {
    try {
      setCoursesLoading(true);
      const coursesData = await getCourses();
      setCourses(coursesData);
    } catch (error: any) {
      setError('Failed to load courses');
    } finally {
      setCoursesLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim()) {
      setError('Assignment title is required');
      return;
    }
    
    if (!form.prompt.trim()) {
      setError('Assignment prompt is required');
      return;
    }
    
    if (!form.course_id) {
      setError('Please select a course');
      return;
    }

    // Validate due date is in the future
    const now = new Date();
    if (form.due_date <= now) {
      setError('Due date must be in the future');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const assignmentData: AssignmentCreate = {
        title: form.title.trim(),
        description: form.description.trim(),
        prompt: form.prompt.trim(),
        due_date: form.due_date.toISOString(),
        course_id: form.course_id
      };

      const newAssignment = await createAssignment(assignmentData);
      onAssignmentCreated(newAssignment);
      handleClose();
    } catch (error: any) {
      console.error('Assignment creation error:', error);
      setError(error.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({
      title: '',
      description: '',
      prompt: '',
      due_date: getDefaultDueDate(),
      course_id: preselectedCourseId || 0
    });
    setError(null);
    onClose();
  };

  const isFormValid = form.title.trim() && form.prompt.trim() && form.due_date && form.course_id > 0;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden'
          }
        }}
      >
        {/* Enhanced Header with Gradient */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            p: 3,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative background element */}
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              borderRadius: '50%',
              bgcolor: alpha('#fff', 0.1),
              zIndex: 0
            }}
          />
          
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar
                sx={{
                  mr: 2,
                  bgcolor: alpha('#fff', 0.15),
                  width: 48,
                  height: 48
                }}
              >
                <CreateIcon sx={{ color: 'white' }} />
              </Avatar>
              <Typography variant="h5" fontWeight="800">
                Create New Assignment
              </Typography>
            </Box>
            {selectedCourse && (
              <Chip
                label={`${selectedCourse.name} • ${selectedCourse.term}`}
                icon={<SchoolIcon />}
                sx={{
                  bgcolor: alpha('#fff', 0.15),
                  color: 'white',
                  fontWeight: 600,
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
            )}
          </Box>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ p: 4 }}>
            <Stack spacing={4}>
              {/* Course Selection */}
              <FormControl fullWidth required>
                <InputLabel>Course</InputLabel>
                <Select
                  value={form.course_id}
                  onChange={(e) => setForm({ ...form, course_id: e.target.value as number })}
                  label="Course"
                  disabled={coursesLoading || !!preselectedCourseId}
                  sx={{ borderRadius: 3 }}
                >
                  <MenuItem value={0} disabled>
                    {coursesLoading ? 'Loading courses...' : 'Select a course'}
                  </MenuItem>
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>{course.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {course.term} • {course.description || 'No description'}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Assignment Title */}
              <TextField
                label="Assignment Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                fullWidth
                required
                placeholder="e.g., Research Paper on Modern Architecture"
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                      <AssignmentIcon sx={{ color: 'text.secondary' }} />
                    </Box>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
              />

              {/* Due Date */}
              <Box>
                <Typography variant="subtitle1" gutterBottom fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon />
                  Due Date
                </Typography>
                <DateTimePicker
                  value={form.due_date}
                  onChange={(date) => setForm({ ...form, due_date: date || new Date() })}
                  sx={{ 
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3
                    }
                  }}
                  minDate={new Date()}
                />
              </Box>

              {/* Description */}
              <TextField
                label="Description (Optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                fullWidth
                multiline
                rows={2}
                placeholder="Brief description of the assignment..."
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, alignSelf: 'flex-start', mt: 1 }}>
                      <DescriptionIcon sx={{ color: 'text.secondary' }} />
                    </Box>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
              />

              {/* Assignment Prompt */}
              <Box>
                <Typography variant="subtitle1" gutterBottom fontWeight={700}>
                  Assignment Instructions & Requirements *
                </Typography>
                <TextField
                  value={form.prompt}
                  onChange={(e) => setForm({ ...form, prompt: e.target.value })}
                  fullWidth
                  multiline
                  rows={8}
                  required
                  placeholder="Enter detailed instructions, requirements, grading criteria, and any other information students need to complete this assignment..."
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      borderRadius: 3
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Be specific and clear. Include learning objectives, format requirements, submission guidelines, and evaluation criteria.
                </Typography>
              </Box>

              {/* Error Display */}
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    borderRadius: 3,
                    '& .MuiAlert-message': {
                      fontWeight: 500
                    }
                  }}
                >
                  {error}
                </Alert>
              )}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 4, pt: 2, bgcolor: alpha(theme.palette.grey[50], 0.5) }}>
            <Button 
              onClick={handleClose} 
              disabled={loading}
              sx={{ 
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 3,
                px: 3
              }}
              startIcon={<CloseIcon />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !isFormValid}
              startIcon={loading ? <CircularProgress size={18} /> : <SaveIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 3,
                px: 4,
                py: 1.5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`
                }
              }}
            >
              {loading ? 'Creating...' : 'Create Assignment'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AssignmentDialog;