import React from 'react';
import {
  Menu,
  MenuItem,
  IconButton,
  Fab,
  Zoom,
  Snackbar,
  Alert
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface CourseActionsProps {
  // Menu state
  menuAnchorEl: HTMLElement | null;
  selectedCourseId: number | null;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, courseId: number) => void;
  onMenuClose: () => void;
  
  // Actions
  onEditCourse: () => void;
  onDeleteCourse: () => void;
  onCreateCourse: () => void;
  
  // Snackbar state
  snackbar: { open: boolean; message: string; severity: 'success' | 'error' };
  onSnackbarClose: () => void;
}

const CourseActions: React.FC<CourseActionsProps> = ({
  menuAnchorEl,
  selectedCourseId,
  onMenuOpen,
  onMenuClose,
  onEditCourse,
  onDeleteCourse,
  onCreateCourse,
  snackbar,
  onSnackbarClose
}) => {
  const theme = useTheme();

  return (
    <>
      {/* Floating Action Button */}
      <Zoom in={true}>
        <Fab
          color="primary"
          onClick={onCreateCourse}
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

      {/* Course Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={onMenuClose}
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: 3,
            minWidth: 180,
            '& .MuiMenuItem-root': {
              borderRadius: 1,
              mx: 1,
              my: 0.5
            }
          }
        }}
      >
        <MenuItem onClick={onEditCourse}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Course
        </MenuItem>
        <MenuItem 
          onClick={onDeleteCourse}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Course
        </MenuItem>
      </Menu>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={onSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={onSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 3 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CourseActions;