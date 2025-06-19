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

interface CourseAssignmentEmptyStateProps {
  courseName: string;
  onCreateAssignment: () => void;
}

const CourseAssignmentEmptyState: React.FC<CourseAssignmentEmptyStateProps> = ({
  courseName,
  onCreateAssignment
}) => {
  const theme = useTheme();

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
          No assignments yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto', lineHeight: 1.6 }}>
          Get started by creating your first assignment for <strong>{courseName}</strong>. 
          You can add learning objectives, due dates, and detailed instructions.
        </Typography>
        
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
          Create First Assignment
        </Button>
      </Paper>
    </Fade>
  );
};

export default CourseAssignmentEmptyState;