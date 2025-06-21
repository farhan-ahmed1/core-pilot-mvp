import React from 'react';
import {
  Paper,
  Typography,
  Button,
  Avatar,
  alpha,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';

interface AssignmentEmptyStateProps {
  activeTab: number;
  onCreateAssignment: () => void;
}

const AssignmentEmptyState: React.FC<AssignmentEmptyStateProps> = ({
  activeTab,
  onCreateAssignment
}) => {
  const theme = useTheme();

  const getMessage = () => {
    if (activeTab === 0) {
      return 'Create your first assignment to get started with organizing your academic work';
    }
    return 'No assignments match the current filter criteria. Try adjusting your filters or create a new assignment.';
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 8,
        textAlign: 'center',
        border: 1,
        borderColor: 'grey.200',
        borderRadius: 3,
        bgcolor: 'grey.50'
      }}
    >
      <Avatar
        sx={{
          width: 80,
          height: 80,
          mx: 'auto',
          mb: 3,
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`
        }}
      >
        <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
      </Avatar>
      
      <Typography variant="h5" gutterBottom fontWeight="700">
        No assignments found
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
        {getMessage()}
      </Typography>
      
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onCreateAssignment}
        size="large"
        sx={{ 
          borderRadius: 2, 
          textTransform: 'none', 
          fontWeight: 700,
          px: 4,
          py: 1.5,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
        }}
      >
        Create Assignment
      </Button>
    </Paper>
  );
};

export default AssignmentEmptyState;