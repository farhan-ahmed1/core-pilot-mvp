import React, { useState, useEffect } from 'react';
import {
  Box,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Grid,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { V0Adapter } from '../V0Adapter';

// Example of a v0.dev generated component adapted for Core Pilot
interface V0CourseCardProps {
  course: {
    id: number;
    name: string;
    term: string;
    description?: string;
    progress: number;
    assignmentCount: number;
    dueAssignments: number;
    status: 'active' | 'completed' | 'upcoming';
  };
  onEdit?: (courseId: number) => void;
  onDelete?: (courseId: number) => void;
  onViewAssignments?: (courseId: number) => void;
}

// Define the course type for state management
interface Course {
  id: number;
  name: string;
  term: string;
  description?: string;
  progress: number;
  assignmentCount: number;
  dueAssignments: number;
  status: 'active' | 'completed' | 'upcoming';
}

/**
 * V0CourseCard - Example component showing v0.dev integration
 * 
 * This component demonstrates:
 * 1. How to adapt v0.dev Tailwind-style components to Material UI
 * 2. Integration with Core Pilot's design system
 * 3. Proper TypeScript typing
 * 4. API integration patterns
 */
export const V0CourseCard: React.FC<V0CourseCardProps> = ({
  course,
  onEdit,
  onDelete,
  onViewAssignments,
}) => {
  const theme = useTheme();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  // Use v0.dev style conversion for custom styling

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const getStatusIcon = (dueCount: number) => {
    if (dueCount > 0) return <WarningIcon color="error" fontSize="small" />;
    return <CheckCircleIcon color="success" fontSize="small" />;
  };

  return (
    <V0Adapter
      componentType="card"
      v0Props={{ className: "bg-white rounded-lg shadow-md hover:shadow-lg" }}
      muiOverrides={{
        sx: {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
          },
        },
      }}
    >
      {/* Course Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          p: 3,
          position: 'relative',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {course.name}
            </Typography>
            <Chip
              label={course.term}
              size="small"
              sx={{
                bgcolor: alpha('#fff', 0.2),
                color: 'white',
                fontWeight: 500,
              }}
            />
          </Box>
          <IconButton onClick={handleMenuOpen} sx={{ color: 'white' }}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        {course.description && (
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
            {course.description}
          </Typography>
        )}
      </Box>

      {/* Course Content */}
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Progress Section */}
        <Box sx={{ mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle2" fontWeight="bold">
              Course Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {course.progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={course.progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            }}
          />
        </Box>

        {/* Assignments Status */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
              <AssignmentIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {course.assignmentCount} Assignments
              </Typography>
              <Box display="flex" alignItems="center" gap={0.5}>
                {getStatusIcon(course.dueAssignments)}
                <Typography variant="caption" color="text.secondary">
                  {course.dueAssignments > 0
                    ? `${course.dueAssignments} due soon`
                    : 'All up to date'
                  }
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Chip
            label={course.status}
            color={course.status === 'active' ? 'primary' : course.status === 'completed' ? 'success' : 'warning'}
            size="small"
            variant="filled"
          />
        </Box>

        {/* Action Button */}
        <Button
          variant="outlined"
          startIcon={<AssignmentIcon />}
          fullWidth
          onClick={() => onViewAssignments?.(course.id)}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          View Assignments
        </Button>
      </CardContent>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: 2,
            minWidth: 160,
          },
        }}
      >
        <MenuItem onClick={() => { onEdit?.(course.id); handleMenuClose(); }}>
          Edit Course
        </MenuItem>
        <MenuItem 
          onClick={() => { onDelete?.(course.id); handleMenuClose(); }}
          sx={{ color: 'error.main' }}
        >
          Delete Course
        </MenuItem>
      </Menu>
    </V0Adapter>
  );
};

// Example usage with Core Pilot data structure
export const V0CourseGrid: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Example of integrating with Core Pilot APIs
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const coursesData = await getCourses();
        
        // Mock data for demonstration
        const mockCourses: Course[] = [
          {
            id: 1,
            name: 'Advanced Computer Science',
            term: 'Fall 2025',
            description: 'Deep dive into algorithms and data structures',
            progress: 75,
            assignmentCount: 8,
            dueAssignments: 2,
            status: 'active',
          },
          {
            id: 2,
            name: 'Web Development Fundamentals',
            term: 'Fall 2025',
            description: 'HTML, CSS, JavaScript, and React basics',
            progress: 90,
            assignmentCount: 6,
            dueAssignments: 0,
            status: 'active',
          },
        ];
        
        setCourses(mockCourses);
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading courses...</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {courses.map((course) => (
        <Grid key={course.id} size={{xs:12, sm:6, md:4}}>
          <V0CourseCard
            course={course}
            onEdit={(id) => console.log('Edit course:', id)}
            onDelete={(id) => console.log('Delete course:', id)}
            onViewAssignments={(id) => console.log('View assignments:', id)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default V0CourseCard;