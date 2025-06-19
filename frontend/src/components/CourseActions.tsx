import React from 'react';
import {
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  ListItemIcon,
  Typography,
  Fab,
  Zoom
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface CourseActionsProps {
  // Menu state
  menuAnchorEl: HTMLElement | null;
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

      {/* Course Actions Menu */}
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
              my: 0.5,
              px: 2,
              py: 1.5
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={onEditCourse}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={600}>
            Edit Course
          </Typography>
        </MenuItem>
        <MenuItem onClick={onDeleteCourse} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={600}>
            Delete Course
          </Typography>
        </MenuItem>
      </Menu>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={onSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={onSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 3 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CourseActions;