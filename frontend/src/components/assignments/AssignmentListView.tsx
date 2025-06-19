import React from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  ListItemSecondaryAction,
  Avatar,
  Typography,
  Box,
  Chip,
  IconButton,
  Divider,
  Fade,
  alpha,
  useTheme
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  AutoStories as SchoolIcon,
  EventNote as CalendarIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { AssignmentListItem, getDueDateStatus, getDueDateColor, formatDueDate } from '../../services/assignmentService';
import { Course } from '../../services/courseService';
import { formatTimeRemaining } from '../../utils/assignmentListUtils';

interface AssignmentListViewProps {
  assignments: AssignmentListItem[];
  courses: Course[];
  onAssignmentClick: (assignmentId: number) => void;
  getCourseById: (courseId: number) => Course | undefined;
}

const AssignmentListView: React.FC<AssignmentListViewProps> = ({
  assignments,
  courses,
  onAssignmentClick,
  getCourseById
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'grey.200',
        borderRadius: 3,
        overflow: 'hidden'
      }}
    >
      <List disablePadding>
        {assignments.map((assignment, index) => {
          const status = getDueDateStatus(assignment);
          const statusColor = getDueDateColor(status);
          const course = getCourseById(assignment.course_id);

          return (
            <React.Fragment key={assignment.id}>
              <Fade in timeout={100 + (index * 50)}>
                <ListItem
                  disablePadding
                  sx={{
                    borderLeft: 4,
                    borderLeftColor: assignment.is_overdue 
                      ? 'error.main' 
                      : status === 'due-soon' 
                        ? 'warning.main' 
                        : 'transparent',
                    bgcolor: assignment.is_overdue 
                      ? alpha(theme.palette.error.main, 0.02)
                      : status === 'due-soon'
                        ? alpha(theme.palette.warning.main, 0.02)
                        : 'transparent'
                  }}
                >
                  <ListItemButton
                    onClick={() => onAssignmentClick(assignment.id)}
                    sx={{
                      py: 2,
                      px: 3,
                      '&:hover': {
                        bgcolor: 'grey.50'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 48 }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: assignment.is_overdue 
                            ? 'error.50' 
                            : status === 'due-soon' 
                              ? 'warning.50' 
                              : 'primary.50'
                        }}
                      >
                        <AssignmentIcon 
                          sx={{ 
                            fontSize: 20,
                            color: assignment.is_overdue 
                              ? 'error.600' 
                              : status === 'due-soon' 
                                ? 'warning.600' 
                                : 'primary.600'
                          }} 
                        />
                      </Avatar>
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                          <Typography variant="h6" fontWeight="600" sx={{ flex: 1 }}>
                            {assignment.title}
                          </Typography>
                          <Chip
                            label={status === 'overdue' ? 'Overdue' : status === 'due-soon' ? 'Due Soon' : 'Upcoming'}
                            color={statusColor}
                            size="small"
                            variant="filled"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Box display="flex" alignItems="center" gap={2} mb={1}>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <SchoolIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                {course?.name || 'Unknown Course'}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <CalendarIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {formatDueDate(assignment.due_date)}
                              </Typography>
                            </Box>
                          </Box>
                          
                          {assignment.days_until_due !== undefined && (
                            <Typography
                              variant="caption"
                              sx={{
                                px: 1,
                                py: 0.25,
                                borderRadius: 1,
                                bgcolor: assignment.is_overdue 
                                  ? alpha(theme.palette.error.main, 0.1)
                                  : alpha(theme.palette.primary.main, 0.1),
                                color: assignment.is_overdue ? 'error.main' : 'text.secondary',
                                fontWeight: 600
                              }}
                            >
                              {formatTimeRemaining(assignment)}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        sx={{
                          opacity: 0.7,
                          '&:hover': {
                            opacity: 1,
                            bgcolor: 'grey.100'
                          }
                        }}
                      >
                        <ArrowForwardIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItemButton>
                </ListItem>
              </Fade>
              {index < assignments.length - 1 && (
                <Divider variant="inset" component="li" sx={{ ml: 11 }} />
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Paper>
  );
};

export default AssignmentListView;