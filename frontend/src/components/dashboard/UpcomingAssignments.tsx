import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  IconButton,
  LinearProgress,
  Fade,
  alpha,
  useTheme
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  MoreHoriz as MoreHorizIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { AssignmentListItem } from '../../services/assignmentService';
import type { Course } from '../../services/courseService';
import { getDueDateStatus, getDueDateColor } from '../../services/assignmentService';

interface UpcomingAssignmentsProps {
  assignments: AssignmentListItem[];
  courses: Course[];
}

const UpcomingAssignments: React.FC<UpcomingAssignmentsProps> = ({
  assignments,
  courses
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const getPriorityBorder = (assignment: AssignmentListItem) => {
    const status = getDueDateStatus(assignment);
    if (status === 'overdue') return 'error.main';
    if (status === 'due-soon') return 'warning.main';
    return 'grey.200';
  };

  const getPriorityBackground = (assignment: AssignmentListItem) => {
    const status = getDueDateStatus(assignment);
    if (status === 'overdue') return alpha(theme.palette.error.main, 0.05);
    if (status === 'due-soon') return alpha(theme.palette.warning.main, 0.05);
    return 'grey.50';
  };

  const formatDueDateMessage = (assignment: AssignmentListItem) => {
    const date = new Date(assignment.due_date);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  return (
    <Card elevation={0} sx={{ border: 1, borderColor: 'grey.200', borderRadius: 3 }}>
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'grey.200' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Upcoming Assignments
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your next deadlines and priorities
            </Typography>
          </Box>
          <Button
            variant="text"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/assignments')}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              color: 'text.secondary'
            }}
          >
            View all
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ p: 3 }}>
        {assignments.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'success.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}
            >
              <CheckCircleIcon sx={{ color: 'success.600', fontSize: 24 }} />
            </Box>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              All caught up!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No upcoming deadlines. Great work staying organized!
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {assignments.map((assignment, index) => {
              const status = getDueDateStatus(assignment);
              const statusColor = getDueDateColor(status);
              const course = courses.find(c => c.id === assignment.course_id);

              return (
                <Fade key={assignment.id} in timeout={300 + (index * 100)}>
                  <Card
                    elevation={0}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: 1,
                      borderColor: 'grey.200',
                      borderRadius: 2,
                      borderLeftWidth: 4,
                      borderLeftColor: getPriorityBorder(assignment),
                      bgcolor: getPriorityBackground(assignment),
                      '&:hover': {
                        boxShadow: theme.shadows[2],
                        transform: 'translateY(-1px)'
                      }
                    }}
                    onClick={() => navigate(`/assignments/${assignment.id}`)}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box display="flex" alignItems="start" justifyContent="space-between">
                        <Box flex={1}>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Chip
                              label={status === 'overdue' ? 'Overdue' : status === 'due-soon' ? 'Due Soon' : 'Upcoming'}
                              color={statusColor}
                              size="small"
                              variant="filled"
                              sx={{ 
                                borderRadius: 1, 
                                fontWeight: 500, 
                                fontSize: '0.6875rem',
                                height: 20
                              }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {course?.name || 'Unknown Course'}
                            </Typography>
                          </Box>
                          <Typography variant="subtitle1" fontWeight="500" gutterBottom>
                            {assignment.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDueDateMessage(assignment)}
                          </Typography>
                          
                          {/* Progress bar placeholder */}
                          <Box sx={{ mt: 2 }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                              <Typography variant="caption" color="text.secondary">
                                Progress
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                65%
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={65} 
                              sx={{ 
                                height: 4, 
                                borderRadius: 2,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: 'grey.900',
                                  borderRadius: 2
                                }
                              }} 
                            />
                          </Box>
                        </Box>
                        <IconButton 
                          size="small" 
                          sx={{ 
                            opacity: 0, 
                            '.MuiCard-root:hover &': { opacity: 1 },
                            transition: 'opacity 0.2s'
                          }}
                        >
                          <MoreHorizIcon sx={{ fontSize: 16, color: 'grey.400' }} />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              );
            })}
          </Stack>
        )}
      </Box>
    </Card>
  );
};

export default UpcomingAssignments;