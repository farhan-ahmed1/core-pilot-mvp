import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Fade,
  Avatar,
  Skeleton,
  alpha,
  useTheme,
  Stack,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Course, getCourses } from '../../services/courseService';

interface CourseListProps {
  onCourseEdit?: (course: Course) => void;
  onCourseDelete?: (courseId: number) => void;
  onCreateCourse?: () => void;
}

const CourseList: React.FC<CourseListProps> = ({
  onCourseEdit,
  onCourseDelete,
  onCreateCourse,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ element: HTMLElement; courseId: number } | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const coursesData = await getCourses();
      setCourses(coursesData);
    } catch (err) {
      setError('Failed to load courses');
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, courseId: number) => {
    setMenuAnchor({ element: event.currentTarget, courseId });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEdit = () => {
    if (menuAnchor && onCourseEdit) {
      const course = courses.find(c => c.id === menuAnchor.courseId);
      if (course) {
        onCourseEdit(course);
      }
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (menuAnchor && onCourseDelete) {
      onCourseDelete(menuAnchor.courseId);
    }
    handleMenuClose();
  };

  const getTermColor = (term: string) => {
    const colors = {
      'Fall': theme.palette.warning.main,
      'Spring': theme.palette.success.main,
      'Summer': theme.palette.info.main,
      'Winter': theme.palette.secondary.main,
    };
    return colors[term as keyof typeof colors] || theme.palette.primary.main;
  };

  if (loading) {
    return (
      <Stack spacing={2}>
        {[1, 2, 3].map((n) => (
          <Card key={n} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Skeleton variant="circular" width={48} height={48} />
                <Box flexGrow={1}>
                  <Skeleton variant="text" width="40%" height={28} />
                  <Skeleton variant="text" width="20%" height={20} />
                </Box>
                <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button onClick={loadCourses} variant="outlined" sx={{ borderRadius: 3 }}>
          Retry
        </Button>
      </Box>
    );
  }

  if (courses.length === 0) {
    return (
      <Box textAlign="center" py={6}>
        <SchoolIcon sx={{ fontSize: 80, color: alpha(theme.palette.primary.main, 0.3), mb: 2 }} />
        <Typography variant="h6" fontWeight="600" gutterBottom>
          No courses yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create your first course to get started with organizing your assignments.
        </Typography>
        {onCreateCourse && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateCourse}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
            }}
          >
            Create Course
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box>
      <Stack spacing={2}>
        {courses.map((course, index) => (
          <Fade in timeout={600 + index * 100} key={course.id}>
            <Card
              sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={3}>
                  {/* Course Icon */}
                  <Avatar
                    sx={{
                      bgcolor: alpha(getTermColor(course.term), 0.1),
                      color: getTermColor(course.term),
                      width: 56,
                      height: 56,
                    }}
                  >
                    <SchoolIcon sx={{ fontSize: 24 }} />
                  </Avatar>

                  {/* Course Info */}
                  <Box flexGrow={1}>
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      <Typography variant="h6" fontWeight="600" component="h3">
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
                    {course.description ? (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {course.description}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        No description provided
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      Created {new Date(course.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>

                  {/* Actions */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/courses/${course.id}/assignments`)}
                      startIcon={<AssignmentIcon />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'medium',
                        minWidth: 140,
                      }}
                    >
                      View Assignments
                    </Button>
                    
                    {(onCourseEdit || onCourseDelete) && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, course.id)}
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        ))}
      </Stack>

      {/* Course Actions Menu */}
      <Menu
        anchorEl={menuAnchor?.element}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: 3,
            minWidth: 180,
            '& .MuiMenuItem-root': {
              borderRadius: 1,
              mx: 1,
              my: 0.5,
              px: 2,
              py: 1.5,
            },
          },
        }}
      >
        {onCourseEdit && (
          <MenuItem onClick={handleEdit}>
            <EditIcon sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body2" fontWeight={600}>
              Edit Course
            </Typography>
          </MenuItem>
        )}
        {onCourseDelete && (
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body2" fontWeight={600}>
              Delete Course
            </Typography>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default CourseList;