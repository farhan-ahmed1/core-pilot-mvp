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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
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
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');

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

  // Sorting logic
  const sortedAssignments = React.useMemo(() => {
    const sorted = [...assignments].sort((a, b) => {
      const dateA = new Date(a.due_date).getTime();
      const dateB = new Date(b.due_date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    return sorted;
  }, [assignments, sortOrder]);

  // Status chip helper
  const getStatusChip = (status?: string) => {
    if (status === 'feedback_ready') {
      return <Chip label="Feedback ready" color="success" size="small" sx={{ fontWeight: 600, borderRadius: 2 }} />;
    }
    if (status === 'draft_saved') {
      return <Chip label="Draft saved" color="primary" size="small" sx={{ fontWeight: 600, borderRadius: 2 }} />;
    }
    return <Chip label="No draft" color="default" size="small" sx={{ fontWeight: 600, borderRadius: 2, bgcolor: 'grey.100' }} />;
  };

  return (
    <Box>
      {/* Sorting control */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="sort-order-label">Sort by</InputLabel>
          <Select
            labelId="sort-order-label"
            value={sortOrder}
            label="Sort by"
            onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
          >
            <MenuItem value="asc">Due Date (Earliest First)</MenuItem>
            <MenuItem value="desc">Due Date (Latest First)</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Stack spacing={3}>
        {sortedAssignments.length === 0 ? (
          <Box textAlign="center" py={6}>
            <Typography variant="h6" fontWeight="600" color="text.secondary">
              No assignments found
            </Typography>
          </Box>
        ) : (
          sortedAssignments.map((assignment, index) => {
            const statusChip = getStatusChip(assignment.status);
            const status = getAssignmentStatus(assignment);
            const timeRemaining = getTimeRemaining(assignment);
            
            return (
              <Fade in timeout={600 + index * 100} key={assignment.id}>
                <Paper
                  sx={{
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[2],
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                  onClick={() => navigate(`/assignments/${assignment.id}`)}
                >
                  <Box p={3} pl={4}>
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
                            sx={{ mb: 2, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                          >
                            {assignment.description}
                          </Typography>
                        )}
                      </Box>
                      {statusChip}
                    </Box>
                    <Box display="flex" alignItems="center" gap={2}>
                      <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {formatDueDate(assignment.due_date)}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Fade>
            );
          })
        )}
      </Stack>
    </Box>
  );
};

export default CourseAssignmentList;