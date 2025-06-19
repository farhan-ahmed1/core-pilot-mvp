import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Fade,
  useTheme,
  alpha,
} from '@mui/material';
import {
  EventNote as CalendarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Assignment } from '../../services/courseService';

interface CourseAssignmentListProps {
  assignments: Assignment[];
}

const CourseAssignmentList: React.FC<CourseAssignmentListProps> = ({ assignments }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAssignmentStatus = (assignment: Assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.due_date);
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { 
        label: 'Overdue', 
        color: theme.palette.error.main,
        variant: 'filled' as const
      };
    } else if (diffDays <= 3) {
      return { 
        label: 'Due Soon', 
        color: theme.palette.warning.main,
        variant: 'filled' as const
      };
    } else if (diffDays <= 7) {
      return { 
        label: 'This Week', 
        color: theme.palette.info.main,
        variant: 'outlined' as const
      };
    } else {
      return { 
        label: 'Upcoming', 
        color: theme.palette.success.main,
        variant: 'outlined' as const
      };
    }
  };

  const getTimeRemaining = (assignment: Assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.due_date);
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    }
  };

  // Sort assignments by due date (overdue first, then by closest due date)
  const sortedAssignments = [...assignments].sort((a, b) => {
    const now = new Date();
    const dateA = new Date(a.due_date);
    const dateB = new Date(b.due_date);
    
    const isOverdueA = dateA < now;
    const isOverdueB = dateB < now;
    
    // If one is overdue and other isn't, overdue comes first
    if (isOverdueA && !isOverdueB) return -1;
    if (!isOverdueA && isOverdueB) return 1;
    
    // Both overdue or both not overdue, sort by date
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <Stack spacing={3}>
      {sortedAssignments.map((assignment, index) => {
        const status = getAssignmentStatus(assignment);
        const timeRemaining = getTimeRemaining(assignment);
        
        return (
          <Fade in timeout={600 + index * 100} key={assignment.id}>
            <Paper
              sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(status.color, 0.2)}`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 32px ${alpha(status.color, 0.15)}`,
                  borderColor: status.color,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  backgroundColor: status.color,
                }
              }}
              onClick={() => navigate(`/assignments/${assignment.id}`)}
            >
              <Box p={3} pl={4}>
                {/* Assignment Header */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box flex={1}>
                    <Typography 
                      variant="h6" 
                      fontWeight="700" 
                      color="text.primary"
                      sx={{ 
                        mb: 1,
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {assignment.title}
                    </Typography>
                    
                    {assignment.description && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2,
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {assignment.description}
                      </Typography>
                    )}
                  </Box>
                  
                  <Chip
                    label={status.label}
                    variant={status.variant}
                    size="small"
                    sx={{
                      ml: 2,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      ...(status.variant === 'filled' ? {
                        backgroundColor: status.color,
                        color: 'white'
                      } : {
                        borderColor: status.color,
                        color: status.color
                      })
                    }}
                  />
                </Box>

                {/* Assignment Meta Information */}
                <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                  <Box display="flex" alignItems="center" gap={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {formatDueDate(assignment.due_date)}
                      </Typography>
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      fontWeight={600}
                      sx={{
                        color: status.color,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: alpha(status.color, 0.1)
                      }}
                    >
                      {timeRemaining}
                    </Typography>
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary">
                    Created {new Date(assignment.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Fade>
        );
      })}
    </Stack>
  );
};

export default CourseAssignmentList;