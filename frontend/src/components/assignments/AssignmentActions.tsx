import React from 'react';
import {
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

interface AssignmentActionsProps {
  assignment: any;
  menuAnchorEl: null | HTMLElement;
  deleteDialogOpen: boolean;
  onMenuClose: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onDeleteConfirm: () => void;
  onDeleteDialogClose: () => void;
}

const AssignmentActions: React.FC<AssignmentActionsProps> = ({
  assignment,
  menuAnchorEl,
  deleteDialogOpen,
  onMenuClose,
  onEditClick,
  onDeleteClick,
  onDeleteConfirm,
  onDeleteDialogClose
}) => {
  return (
    <>
      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={onMenuClose}
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
        <MenuItem onClick={onEditClick}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Edit Assignment
        </MenuItem>
        <MenuItem onClick={onDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Delete Assignment
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={onDeleteDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="700">Delete Assignment</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{assignment?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={onDeleteDialogClose} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button 
            onClick={onDeleteConfirm} 
            color="error" 
            variant="contained"
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AssignmentActions;