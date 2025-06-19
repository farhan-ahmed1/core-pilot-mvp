import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Fade,
  useTheme,
  alpha,
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

  const getEmptyStateContent = () => {
    switch (activeTab) {
      case 1:
        return {
          title: 'No overdue assignments',
          subtitle: 'Great! All your assignments are on track. Keep up the good work!',
          showButton: false
        };
      case 2:
        return {
          title: 'No assignments due soon',
          subtitle: 'You\'re ahead of schedule! No assignments are due in the next week.',
          showButton: false
        };
      case 3:
        return {
          title: 'No upcoming assignments',
          subtitle: 'All caught up! Consider creating new assignments to stay productive.',
          showButton: true
        };
      default:
        return {
          title: 'No assignments yet',
          subtitle: 'Get started by creating your first assignment to organize your coursework.',
          showButton: true
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <Fade in timeout={800}>
      <Paper
        elevation={0}
        sx={{
          p: 8,
          textAlign: 'center',
          borderRadius: 4,
          border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
          bgcolor: alpha(theme.palette.primary.main, 0.02),
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: alpha(theme.palette.primary.main, 0.4),
            bgcolor: alpha(theme.palette.primary.main, 0.04),
          }
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`
          }}
        >
          <AssignmentIcon 
            sx={{ 
              fontSize: 48, 
              color: theme.palette.primary.main
            }} 
          />
        </Box>
        
        <Typography variant="h5" fontWeight="700" gutterBottom color="text.primary">
          {content.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto', lineHeight: 1.6 }}>
          {content.subtitle}
        </Typography>
        
        {content.showButton && (
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={onCreateAssignment}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 700,
              px: 4,
              py: 1.5,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
              }
            }}
          >
            Create Assignment
          </Button>
        )}
      </Paper>
    </Fade>
  );
};

export default AssignmentEmptyState;