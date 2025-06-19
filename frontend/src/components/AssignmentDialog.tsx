import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Description as DescriptionIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays } from 'date-fns';

// Import API functions
import { createAssignment, AssignmentCreate } from '../services/assignmentService';
import { getCourses, Course } from '../services/courseService';

interface AssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  onAssignmentCreated: (assignment: any) => void;
  preselectedCourseId?: number;
}

const AssignmentDialog: React.FC<AssignmentDialogProps> = ({
  open,
  onClose,
  onAssignmentCreated,
  preselectedCourseId
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    prompt: '',
    due_date: addDays(new Date(), 7), // Default to 1 week from now
    course_id: 0 // Always start with 0, then set to preselected if valid
  });

  // Load courses when dialog opens
  useEffect(() => {
    if (open) {
      loadCourses();
      // Reset form when dialog opens
      setForm({
        title: '',
        description: '',
        prompt: '',
        due_date: addDays(new Date(), 7),
        course_id: 0 // Always start with 0, then set to preselected if valid
      });
      setError(null);
    }
  }, [open]);

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
      const coursesData = await getCourses();
      setCourses(coursesData);
    } catch (error: any) {
      setError('Failed to load courses');
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
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const selectedCourse = courses.find(c => c.id === form.course_id);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center">
            <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h5" fontWeight="bold">
              Create New Assignment
            </Typography>
          </Box>
          {selectedCourse && (
            <Chip
              label={`${selectedCourse.name} • ${selectedCourse.term}`}
              icon={<SchoolIcon />}
              variant="outlined"
              sx={{ mt: 1 }}
            />
          )}
        </DialogTitle>
        
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 2 }}>
            <Stack spacing={3}>
              {/* Course Selection */}
              <FormControl fullWidth required>
                <InputLabel>Course</InputLabel>
                <Select
                  value={form.course_id}
                  onChange={(e) => setForm({ ...form, course_id: e.target.value as number })}
                  label="Course"
                  disabled={!!preselectedCourseId}
                >
                  <MenuItem value={0} disabled>
                    Select a course
                  </MenuItem>
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      <Box>
                        <Typography variant="body1">{course.name}</Typography>
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
                  startAdornment: <AssignmentIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />

              {/* Due Date */}
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <ScheduleIcon sx={{ mr: 1, fontSize: 20 }} />
                  Due Date
                </Typography>
                <DateTimePicker
                  value={form.due_date}
                  onChange={(date) => setForm({ ...form, due_date: date || new Date() })}
                  sx={{ width: '100%' }}
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
                  startAdornment: <DescriptionIcon sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />
                }}
              />

              {/* Assignment Prompt */}
              <Box>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  Assignment Instructions & Requirements *
                </Typography>
                <TextField
                  value={form.prompt}
                  onChange={(e) => setForm({ ...form, prompt: e.target.value })}
                  fullWidth
                  multiline
                  rows={6}
                  required
                  placeholder="Enter detailed instructions, requirements, grading criteria, and any other information students need to complete this assignment..."
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.95rem',
                      lineHeight: 1.6
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Be specific and clear. Include learning objectives, format requirements, submission guidelines, and evaluation criteria.
                </Typography>
              </Box>

              {/* Error Display */}
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={handleClose} 
              disabled={loading}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                minWidth: 120
              }}
            >
              {loading ? (
                <Box display="flex" alignItems="center">
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  Creating...
                </Box>
              ) : (
                'Create Assignment'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AssignmentDialog;