import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface CourseDialogsProps {
  // Create Course Dialog
  createDialogOpen: boolean;
  newCourseName: string;
  newCourseTerm: string;
  newCourseDescription: string;
  createLoading: boolean;
  onCreateDialogClose: () => void;
  onNewCourseNameChange: (value: string) => void;
  onNewCourseTermChange: (value: string) => void;
  onNewCourseDescriptionChange: (value: string) => void;
  onCreateCourse: () => void;

  // Edit Course Dialog
  editDialogOpen: boolean;
  editCourseName: string;
  editCourseTerm: string;
  editCourseDescription: string;
  editLoading: boolean;
  onEditDialogClose: () => void;
  onEditCourseNameChange: (value: string) => void;
  onEditCourseTermChange: (value: string) => void;
  onEditCourseDescriptionChange: (value: string) => void;
  onUpdateCourse: () => void;
}

const CourseDialogs: React.FC<CourseDialogsProps> = ({
  createDialogOpen,
  newCourseName,
  newCourseTerm,
  newCourseDescription,
  createLoading,
  onCreateDialogClose,
  onNewCourseNameChange,
  onNewCourseTermChange,
  onNewCourseDescriptionChange,
  onCreateCourse,
  editDialogOpen,
  editCourseName,
  editCourseTerm,
  editCourseDescription,
  editLoading,
  onEditDialogClose,
  onEditCourseNameChange,
  onEditCourseTermChange,
  onEditCourseDescriptionChange,
  onUpdateCourse,
}) => {
  return (
    <>
      {/* Create Course Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={onCreateDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="700">
              Create New Course
            </Typography>
            <IconButton onClick={onCreateDialogClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Box sx={{ pt: 2 }}>
            <TextField
              autoFocus
              label="Course Name"
              fullWidth
              value={newCourseName}
              onChange={(e) => onNewCourseNameChange(e.target.value)}
              sx={{ mb: 3 }}
              placeholder="e.g., Introduction to Computer Science"
            />
            <TextField
              label="Term"
              fullWidth
              value={newCourseTerm}
              onChange={(e) => onNewCourseTermChange(e.target.value)}
              sx={{ mb: 3 }}
              placeholder="e.g., Fall 2024"
            />
            <TextField
              label="Description (Optional)"
              fullWidth
              multiline
              rows={3}
              value={newCourseDescription}
              onChange={(e) => onNewCourseDescriptionChange(e.target.value)}
              placeholder="Brief description of the course..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onCreateDialogClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button
            onClick={onCreateCourse}
            variant="contained"
            disabled={!newCourseName.trim() || !newCourseTerm.trim() || createLoading}
            sx={{ minWidth: 100 }}
          >
            {createLoading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={onEditDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="700">
              Edit Course
            </Typography>
            <IconButton onClick={onEditDialogClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Box sx={{ pt: 2 }}>
            <TextField
              autoFocus
              label="Course Name"
              fullWidth
              value={editCourseName}
              onChange={(e) => onEditCourseNameChange(e.target.value)}
              sx={{ mb: 3 }}
            />
            <TextField
              label="Term"
              fullWidth
              value={editCourseTerm}
              onChange={(e) => onEditCourseTermChange(e.target.value)}
              sx={{ mb: 3 }}
            />
            <TextField
              label="Description (Optional)"
              fullWidth
              multiline
              rows={3}
              value={editCourseDescription}
              onChange={(e) => onEditCourseDescriptionChange(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onEditDialogClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button
            onClick={onUpdateCourse}
            variant="contained"
            disabled={!editCourseName.trim() || !editCourseTerm.trim() || editLoading}
            sx={{ minWidth: 100 }}
          >
            {editLoading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CourseDialogs;