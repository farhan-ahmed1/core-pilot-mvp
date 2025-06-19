import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Breadcrumbs,
  Link,
  useTheme,
  alpha,
  Fade,
} from '@mui/material';
import {
  Add as AddIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Course } from '../../services/courseService';

interface CourseAssignmentHeaderProps {
  course: Course;
  assignmentCount: number;
  onCreateAssignment: () => void;
}

const CourseAssignmentHeader: React.FC<CourseAssignmentHeaderProps> = ({
  course,
  assignmentCount,
  onCreateAssignment
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Fade in timeout={400}>
      <Box sx={{ mb: 4 }}>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          separator={<ChevronRightIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{
            mb: 2,
            '& .MuiBreadcrumbs-separator': {
              color: 'text.secondary',
              mx: 1
            }
          }}
        >
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/dashboard')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.main',
                textDecoration: 'underline'
              }
            }}
          >
            <HomeIcon sx={{ fontSize: 16 }} />
            Dashboard
          </Link>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/courses')}
            sx={{
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.main',
                textDecoration: 'underline'
              }
            }}
          >
            Courses
          </Link>
          <Typography color="text.primary" fontWeight="600">
            {course.name}
          </Typography>
        </Breadcrumbs>

        {/* Course Header - Content First */}
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={3}>
          <Box flex={1}>
            <Typography variant="overline" color="text.secondary" fontWeight={600} letterSpacing={1}>
              Course Management
            </Typography>
            <Typography variant="body2" fontWeight="700" color="text.primary">
              {course.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" fontWeight={400}>
              {course.term} • {assignmentCount} assignment{assignmentCount !== 1 ? 's' : ''}
            </Typography>
          </Box>

          {/* Action Controls */}
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateAssignment}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 3,
                px: 4,
                py: 1.5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
              }}
            >
              Add Assignment
            </Button>
          </Box>
        </Box>

        {/* Course Description */}
        {course.description && (
          <Paper
            sx={{
              p: 3,
              mt: 3,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.02),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.6 }}>
              {course.description}
            </Typography>
          </Paper>
        )}
      </Box>
    </Fade>
  );
};

export default CourseAssignmentHeader;