import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Avatar,
  CircularProgress,
  alpha,
  useTheme
} from '@mui/material';
import {
  School as SchoolIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

interface CourseDialogsProps {
  // Create dialog props
  createDialogOpen: boolean;
  newCourseName: string;
  newCourseTerm: string;
  newCourseDescription: string;
  createLoading: boolean;
  onCreateDialogClose: () => void;
  onNewCourseNameChange: (name: string) => void;
  onNewCourseTermChange: (term: string) => void;
  onNewCourseDescriptionChange: (description: string) => void;
  onCreateCourse: () => void;

  // Edit dialog props
  editDialogOpen: boolean;
  editCourseName: string;
  editCourseTerm: string;
  editCourseDescription: string;
  editLoading: boolean;
  onEditDialogClose: () => void;
  onEditCourseNameChange: (name: string) => void;
  onEditCourseTermChange: (term: string) => void;
  onEditCourseDescriptionChange: (description: string) => void;
  onUpdateCourse: () => void;
}

const CourseDialogs: React.FC<CourseDialogsProps> = ({
  // Create dialog props
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

  // Edit dialog props
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
  const theme = useTheme();

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateCourse();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCourse();
  };

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
            borderRadius: 4,
            overflow: 'hidden'
          }
        }}
      >
        {/* Header with gradient background */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            p: 3,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative background circle */}
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
            <Box display="flex" alignItems="center" mb={1}>
              <Avatar
                sx={{
                  mr: 2,
                  bgcolor: alpha('#fff', 0.15),
                  width: 48,
                  height: 48
                }}
              >
                <AddIcon sx={{ color: 'white' }} />
              </Avatar>
              <Typography variant="h5" fontWeight="800">
                Create New Course
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Add a new course to organize your assignments
            </Typography>
          </Box>
        </Box>

        <form onSubmit={handleCreateSubmit}>
          <DialogContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Course Name"
                value={newCourseName}
                onChange={(e) => onNewCourseNameChange(e.target.value)}
                fullWidth
                required
                placeholder="e.g., Advanced Computer Science"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              
              <TextField
                label="Term"
                value={newCourseTerm}
                onChange={(e) => onNewCourseTermChange(e.target.value)}
                fullWidth
                required
                placeholder="e.g., Fall 2024"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              
              <TextField
                label="Description"
                value={newCourseDescription}
                onChange={(e) => onNewCourseDescriptionChange(e.target.value)}
                fullWidth
                multiline
                rows={3}
                placeholder="Brief description of the course (optional)"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={onCreateDialogClose}
              disabled={createLoading}
              sx={{ 
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 3,
                px: 3
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createLoading || !newCourseName.trim() || !newCourseTerm.trim()}
              startIcon={createLoading ? <CircularProgress size={18} /> : <SaveIcon />}
              sx={{ 
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 3,
                px: 4,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
              }}
            >
              {createLoading ? 'Creating...' : 'Create Course'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={onEditDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden'
          }
        }}
      >
        {/* Header with gradient background */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
            color: 'white',
            p: 3,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative background circle */}
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
            <Box display="flex" alignItems="center" mb={1}>
              <Avatar
                sx={{
                  mr: 2,
                  bgcolor: alpha('#fff', 0.15),
                  width: 48,
                  height: 48
                }}
              >
                <EditIcon sx={{ color: 'white' }} />
              </Avatar>
              <Typography variant="h5" fontWeight="800">
                Edit Course
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Update course information
            </Typography>
          </Box>
        </Box>

        <form onSubmit={handleEditSubmit}>
          <DialogContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Course Name"
                value={editCourseName}
                onChange={(e) => onEditCourseNameChange(e.target.value)}
                fullWidth
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              
              <TextField
                label="Term"
                value={editCourseTerm}
                onChange={(e) => onEditCourseTermChange(e.target.value)}
                fullWidth
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              
              <TextField
                label="Description"
                value={editCourseDescription}
                onChange={(e) => onEditCourseDescriptionChange(e.target.value)}
                fullWidth
                multiline
                rows={3}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={onEditDialogClose}
              disabled={editLoading}
              sx={{ 
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 3,
                px: 3
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={editLoading || !editCourseName.trim() || !editCourseTerm.trim()}
              startIcon={editLoading ? <CircularProgress size={18} /> : <SaveIcon />}
              sx={{ 
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 3,
                px: 4,
                background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`
              }}
            >
              {editLoading ? 'Updating...' : 'Update Course'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default CourseDialogs;