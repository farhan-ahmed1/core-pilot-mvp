import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  Slide,
  alpha,
  useTheme
} from '@mui/material';
import {
  AutoStories as SchoolIcon,
  EventNote as CalendarIcon,
} from '@mui/icons-material';
import { AssignmentListItem, getDueDateStatus, getDueDateColor, formatDueDate } from '../../services/assignmentService';
import { Course } from '../../services/courseService';
import { getStatusIcon, formatTimeRemaining } from '../../utils/assignmentListUtils';

interface AssignmentGridProps {
  assignments: AssignmentListItem[];
  courses: Course[];
  onAssignmentClick: (assignmentId: number) => void;
  getCourseById: (courseId: number) => Course | undefined;
}

const AssignmentGrid: React.FC<AssignmentGridProps> = ({
  assignments,
  courses,
  onAssignmentClick,
  getCourseById
}) => {
  const theme = useTheme();

  const renderAssignmentCard = (assignment: AssignmentListItem, index: number) => {
    const status = getDueDateStatus(assignment);
    const statusColor = getDueDateColor(status);
    const course = getCourseById(assignment.course_id);

    return (
      <Grid size={{ xs: 12, md: 6, lg: 4 }} key={assignment.id}>
        <Slide
          direction="up"
          in={true}
          timeout={300 + (index * 100)}
          style={{ transitionDelay: `${index * 50}ms` }}
        >
          <Card
            elevation={2}
            sx={{
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: 3,
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
                '& .assignment-actions': {
                  opacity: 1
                }
              },
              border: assignment.is_overdue ? `2px solid ${theme.palette.error.main}` : 'none',
              background: assignment.is_overdue 
                ? `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.05)} 0%, ${alpha(theme.palette.error.main, 0.02)} 100%)`
                : 'background.paper'
            }}
            onClick={() => onAssignmentClick(assignment.id)}
          >
            <CardContent sx={{ p: 3 }}>
              {/* Course badge and status */}
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Chip
                  label={course?.name || 'Unknown Course'}
                  icon={<SchoolIcon />}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    fontWeight: 600,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                    borderRadius: 2
                  }}
                />
                <Box display="flex" alignItems="center" gap={1}>
                  {getStatusIcon(status)}
                  <Chip
                    label={status === 'overdue' ? 'Overdue' : status === 'due-soon' ? 'Due Soon' : 'Upcoming'}
                    color={statusColor}
                    size="small"
                    variant="filled"
                    sx={{ borderRadius: 2, fontWeight: 600 }}
                  />
                </Box>
              </Box>

              {/* Assignment title */}
              <Typography
                variant="h6"
                fontWeight="700"
                gutterBottom
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.3,
                  mb: 2
                }}
              >
                {assignment.title}
              </Typography>

              {/* Due date and time remaining */}
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {formatDueDate(assignment.due_date)}
                  </Typography>
                </Box>
                
                {assignment.days_until_due !== undefined && (
                  <Typography
                    variant="caption"
                    color={assignment.is_overdue ? 'error.main' : 'text.secondary'}
                    fontWeight={600}
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: assignment.is_overdue 
                        ? alpha(theme.palette.error.main, 0.1)
                        : alpha(theme.palette.primary.main, 0.08)
                    }}
                  >
                    {formatTimeRemaining(assignment)}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Slide>
      </Grid>
    );
  };

  return (
    <Grid container spacing={3}>
      {assignments.map((assignment, index) => renderAssignmentCard(assignment, index))}
    </Grid>
  );
};

export default AssignmentGrid;