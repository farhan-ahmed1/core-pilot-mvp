import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
  Avatar,
  Fade,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';

export interface Course {
  id: string;
  name: string;
  term: string;
  assignments?: Assignment[];
  created_at: string;
}

interface Assignment {
  id: string;
  title: string;
  due_date?: string;
  status?: string;
}

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
  onViewAssignments: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEdit,
  onDelete,
  onViewAssignments,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(course);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(course.id);
    handleMenuClose();
  };

  // Calculate statistics
  const assignments = course.assignments || [];
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === 'completed').length;
  const completionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;

  // Get next due assignment
  const nextDue = assignments
    .filter(a => a.due_date && new Date(a.due_date) > new Date())
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())[0];

  const getTermColor = (term: string) => {
    const colors = {
      'Fall': theme.palette.warning.main,
      'Spring': theme.palette.success.main,
      'Summer': theme.palette.info.main,
      'Winter': theme.palette.secondary.main,
    };
    return colors[term as keyof typeof colors] || theme.palette.primary.main;
  };

  return (
    <Fade in timeout={600}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  bgcolor: alpha(getTermColor(course.term), 0.1),
                  color: getTermColor(course.term),
                  width: 48,
                  height: 48,
                }}
              >
                <SchoolIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" component="h3" fontWeight="600" gutterBottom>
                  {course.name}
                </Typography>
                <Chip
                  label={course.term}
                  size="small"
                  sx={{
                    bgcolor: alpha(getTermColor(course.term), 0.1),
                    color: getTermColor(course.term),
                    fontWeight: 'medium',
                  }}
                />
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ color: theme.palette.text.secondary }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>

          {/* Stats */}
          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
                <AssignmentIcon sx={{ fontSize: 16 }} />
                {totalAssignments} Assignment{totalAssignments !== 1 ? 's' : ''}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(completionRate)}% Complete
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={completionRate}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                },
              }}
            />
          </Box>

          {/* Next Due */}
          {nextDue && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.warning.main, 0.05),
                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Next Due:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {nextDue.title}
              </Typography>
              <Typography variant="caption" color="warning.main">
                {new Date(nextDue.due_date!).toLocaleDateString()}
              </Typography>
            </Box>
          )}

          {totalAssignments === 0 && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No assignments yet
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Create your first assignment to get started
              </Typography>
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => onViewAssignments(course.id)}
            startIcon={<AssignmentIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'medium',
            }}
          >
            View Assignments
          </Button>
        </CardActions>

        {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleEdit}>
            <EditIcon sx={{ mr: 1, fontSize: 20 }} />
            Edit Course
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
            Delete Course
          </MenuItem>
        </Menu>
      </Card>
    </Fade>
  );
};

export default CourseCard;