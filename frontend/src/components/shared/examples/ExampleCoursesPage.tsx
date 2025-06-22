import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Fade
} from '@mui/material';
import {
  Add as AddIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

// Import shared components
import {
  ContentContainer,
  PageHeader,
  ContentCard,
  PrimaryButton,
  GradientButton,
  StatusChip,
  MetricDisplay,
  ProgressIndicator,
  EmptyState,
  LoadingState
} from '../../shared';

// Sample data type
interface Course {
  id: number;
  name: string;
  term: string;
  description?: string;
  assignmentCount: number;
  completedAssignments: number;
  status: 'active' | 'completed' | 'upcoming';
}

/**
 * ExampleCoursesPage - Demonstrates shared component library usage
 * This shows how to refactor existing pages using the shared components
 */
const ExampleCoursesPage: React.FC = () => {
  const [loading] = useState(false);
  const [courses] = useState<Course[]>([
    {
      id: 1,
      name: "Advanced Computer Science",
      term: "Fall 2024",
      description: "Deep dive into algorithms and data structures",
      assignmentCount: 12,
      completedAssignments: 8,
      status: 'active'
    },
    {
      id: 2,
      name: "Web Development",
      term: "Fall 2024",
      description: "Modern web technologies and frameworks",
      assignmentCount: 10,
      completedAssignments: 10,
      status: 'completed'
    }
  ]);

  const handleCreateCourse = () => {
    console.log('Create course clicked');
  };

  const handleCourseMenuClick = (courseId: number) => {
    console.log('Course menu clicked:', courseId);
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'info' => {
    switch (status) {
      case 'completed': return 'success';
      case 'upcoming': return 'warning';
      default: return 'info';
    }
  };

  const calculateProgress = (completed: number, total: number): number => {
    return total > 0 ? (completed / total) * 100 : 0;
  };

  if (loading) {
    return <LoadingState message="Loading your courses..." fullScreen />;
  }

  return (
    <ContentContainer maxWidth="xl" fadeIn>
      {/* Page Header with Actions */}
      <PageHeader
        title="My Courses"
        subtitle="Manage your courses and assignments in one place"
        overline="Academic Dashboard"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Courses" }
        ]}
        actions={
          <Box display="flex" gap={2}>
            <PrimaryButton
              startIcon={<AddIcon />}
              onClick={handleCreateCourse}
            >
              Create Course
            </PrimaryButton>
            <GradientButton colorScheme="secondary">
              Import from LMS
            </GradientButton>
          </Box>
        }
      />

      {/* Dashboard Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricDisplay
            value={courses.length}
            label="Total Courses"
            icon={<SchoolIcon />}
            variant="card"
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricDisplay
            value={courses.reduce((sum, c) => sum + c.assignmentCount, 0)}
            label="Total Assignments"
            icon={<AssignmentIcon />}
            variant="card"
            color="secondary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricDisplay
            value={courses.reduce((sum, c) => sum + c.completedAssignments, 0)}
            label="Completed"
            variant="card"
            color="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricDisplay
            value={`${Math.round(
              (courses.reduce((sum, c) => sum + c.completedAssignments, 0) /
               courses.reduce((sum, c) => sum + c.assignmentCount, 0)) * 100
            )}%`}
            label="Overall Progress"
            variant="card"
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <EmptyState
          icon={<SchoolIcon />}
          title="No courses yet"
          description="Create your first course to start organizing your assignments and academic work."
          action={{
            label: "Create Your First Course",
            onClick: handleCreateCourse,
            icon: <AddIcon />
          }}
        />
      ) : (
        <Grid container spacing={3}>
          {courses.map((course, index) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={course.id}>
              <Fade in timeout={600 + index * 100}>
                <div>
                  <ContentCard
                    title={course.name}
                    subtitle={course.description}
                    overline={course.term}
                    onMenuClick={() => handleCourseMenuClick(course.id)}
                    variant="outlined"
                    hover
                  >
                    {/* Course Status */}
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <StatusChip
                        status={getStatusVariant(course.status)}
                        label={course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                        variant="soft"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {course.assignmentCount} assignment{course.assignmentCount !== 1 ? 's' : ''}
                      </Typography>
                    </Box>

                    {/* Progress Section */}
                    <Box mb={3}>
                      <ProgressIndicator
                        value={calculateProgress(course.completedAssignments, course.assignmentCount)}
                        label="Course Progress"
                        variant="detailed"
                        color="primary"
                      />
                    </Box>

                    {/* Assignment Stats */}
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'grey.50',
                        border: 1,
                        borderColor: 'grey.200'
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                          <MetricDisplay
                            value={course.completedAssignments}
                            label="Completed"
                            variant="compact"
                            color="success"
                          />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <MetricDisplay
                            value={course.assignmentCount - course.completedAssignments}
                            label="Remaining"
                            variant="compact"
                            color="warning"
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Action Button */}
                    <Box sx={{ mt: 3 }}>
                      <PrimaryButton
                        fullWidth
                        startIcon={<AssignmentIcon />}
                        onClick={() => console.log('View assignments:', course.id)}
                      >
                        View Assignments
                      </PrimaryButton>
                    </Box>
                  </ContentCard>
                </div>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}
    </ContentContainer>
  );
};

export default ExampleCoursesPage;