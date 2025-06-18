import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Stack,
  Card, 
  CardHeader, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Divider,
  Button,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  ListItemButton,
  ListItemSecondaryAction
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { 
  Add as AddIcon, 
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

// Import shared components
import Header from '../components/Header';

// Import dummy data for Sprint 0
// In later sprints, these will be replaced with API calls
interface Course {
  id: number;
  title: string;
  term: string;
}

interface Assignment {
  id: number;
  courseId: number;
  title: string;
  dueDate: string;
  status: 'no_draft' | 'draft_saved' | 'feedback_ready';
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  // Mock data for Sprint 0
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, title: 'Introduction to Computer Science', term: 'Fall 2025' },
    { id: 2, title: 'Web Development Fundamentals', term: 'Fall 2025' },
    { id: 3, title: 'Data Structures & Algorithms', term: 'Spring 2025' },
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 1, courseId: 1, title: 'Hello World Program', dueDate: '2025-06-25', status: 'feedback_ready' },
    { id: 2, courseId: 1, title: 'Variables & Data Types', dueDate: '2025-07-01', status: 'draft_saved' },
    { id: 3, courseId: 2, title: 'HTML Basics', dueDate: '2025-06-20', status: 'no_draft' },
    { id: 4, courseId: 2, title: 'CSS Layouts', dueDate: '2025-06-28', status: 'draft_saved' },
    { id: 5, courseId: 3, title: 'Linked Lists Implementation', dueDate: '2025-07-05', status: 'no_draft' },
  ]);

  // Get assignments for a specific course
  const getAssignmentsForCourse = (courseId: number) => {
    return assignments.filter(assignment => assignment.courseId === courseId);
  };

  // Handle course menu
  const handleCourseMenuOpen = (event: React.MouseEvent<HTMLElement>, courseId: number) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedCourseId(courseId);
  };

  const handleCourseMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedCourseId(null);
  };

  // Simulate loading effect for a better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Get badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'feedback_ready':
        return 'success';
      case 'draft_saved':
        return 'warning';
      case 'no_draft':
      default:
        return 'default';
    }
  };

  // Get status display text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'feedback_ready':
        return 'Feedback Ready';
      case 'draft_saved':
        return 'Draft Saved';
      case 'no_draft':
      default:
        return 'No Draft';
    }
  };

  // Navigate to assignment
  const handleNavigateToAssignment = (assignmentId: number) => {
    navigate(`/assignments/${assignmentId}`);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Use the improved Header component */}
      <Header title="Core Pilot" />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Page Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Courses
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} color="primary">
            New Course
          </Button>
        </Box>
        
        {loading ? (
          <Box display="flex" justifyContent="center" my={8}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid spacing={3}>
            {courses.map((course) => (
              <Grid key={course.id} size={{ xs: 12, md: 6, lg: 4 }}>
                <Card elevation={2}>
                  <CardHeader
                    title={course.title}
                    subheader={`Term: ${course.term}`}
                    action={
                      <IconButton 
                        aria-label="settings" 
                        onClick={(e) => handleCourseMenuOpen(e, course.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    }
                  />
                  <Divider />
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Assignments
                    </Typography>
                    <List dense>
                      {getAssignmentsForCourse(course.id).length > 0 ? (
                        getAssignmentsForCourse(course.id).map((assignment) => (
                          <ListItem key={assignment.id} disablePadding>
                            <ListItemButton onClick={() => handleNavigateToAssignment(assignment.id)}>
                              <ListItemText 
                                primary={assignment.title} 
                                secondary={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                              />
                            </ListItemButton>
                            <ListItemSecondaryAction>
                              <Chip 
                                size="small" 
                                label={getStatusText(assignment.status)} 
                                color={getStatusBadgeColor(assignment.status) as any}
                              />
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))
                      ) : (
                        <ListItem>
                          <ListItemText primary="No assignments yet" />
                        </ListItem>
                      )}
                    </List>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      startIcon={<AddIcon />} 
                      sx={{ mt: 1 }}
                      fullWidth
                    >
                      Add Assignment
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Course menu */}
      <Menu
        id="course-menu"
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCourseMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleCourseMenuClose}>Edit Course</MenuItem>
        <MenuItem onClick={handleCourseMenuClose}>Delete Course</MenuItem>
      </Menu>
    </Box>
  );
};

export default DashboardPage;