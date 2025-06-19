import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Alert,
  Snackbar,
  Grid
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Import shared components
import LoadingScreen from '../../components/common/LoadingScreen';
import AssignmentHeader from '../../components/assignments/AssignmentHeader';
import AssignmentContent from '../../components/assignments/AssignmentContent';
import AssignmentSidebar from '../../components/assignments/AssignmentSidebar';
import AssignmentActions from '../../components/assignments/AssignmentActions';

// Import API functions
import {
  getAssignment,
  updateAssignment,
  deleteAssignment,
  getDueDateStatus,
  getDueDateColor,
  Assignment,
  AssignmentUpdate
} from '../../services/assignmentService';
import { getCourse, Course } from '../../services/courseService';

const AssignmentPage: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

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
    if (location.state?.from) {
      return location.state.from;
    }
    
    const referrer = document.referrer;
    if (referrer.includes('/dashboard')) {
      return '/dashboard';
    } else if (referrer.includes('/assignments')) {
      return '/assignments';
    }
    
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

  const handleEditFormChange = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
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
      <AssignmentHeader
        assignment={assignment}
        course={course}
        editMode={editMode}
        saving={saving}
        editForm={editForm}
        dueDateStatus={dueDateStatus}
        dueDateColor={dueDateColor}
        onBack={handleBack}
        onEditFormChange={handleEditFormChange}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={handleCancelEdit}
        onMenuOpen={handleMenuOpen}
      />

      <Grid container spacing={3}>
        {/* Main content */}
        <Grid size={{xs:12, md:8}}>
          <AssignmentContent
            assignment={assignment}
            editMode={editMode}
            editForm={editForm}
            onEditFormChange={handleEditFormChange}
          />
        </Grid>

        {/* Sidebar */}
        <Grid size={{xs:12, md:4}}>
          <AssignmentSidebar
            assignment={assignment}
            course={course}
          />
        </Grid>
      </Grid>

      {/* Actions and Dialogs */}
      <AssignmentActions
        assignment={assignment}
        menuAnchorEl={menuAnchorEl}
        deleteDialogOpen={deleteDialogOpen}
        onMenuClose={handleMenuClose}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        onDeleteConfirm={handleDeleteConfirm}
        onDeleteDialogClose={() => setDeleteDialogOpen(false)}
      />

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