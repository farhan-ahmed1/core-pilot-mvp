import React from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Stack,
  LinearProgress,
  useTheme
} from '@mui/material';
import type { Course } from '../../services/courseService';

interface CourseSidebarProps {
  courses: Course[];
  onCreateCourse: () => void;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  courses,
  onCreateCourse
}) => {
  const theme = useTheme();

  return (
    <Card elevation={0} sx={{ border: 1, borderColor: 'grey.200', borderRadius: 3 }}>
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'grey.200' }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Active Courses
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your current semester
        </Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        {courses.length === 0 ? (
          <Box textAlign="center" py={2}>
            <Typography variant="body2" color="text.secondary" mb={2}>
              No courses yet
            </Typography>
            <Button
              variant="outlined"
              onClick={onCreateCourse}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              Add Course
            </Button>
          </Box>
        ) : (
          <Stack spacing={2}>
            {courses.slice(0, 4).map((course) => (
              <Box key={course.id} sx={{ cursor: 'pointer' }}>
                <Box 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="space-between" 
                  p={1.5} 
                  borderRadius={2}
                  sx={{
                    '&:hover': {
                      bgcolor: 'grey.50'
                    }
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: theme.palette.primary.main
                      }}
                    />
                    <Box>
                      <Typography variant="body2" fontWeight="500">
                        {course.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {course.term}
                      </Typography>
                    </Box>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="body2" fontWeight="500">
                      0/5
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      assignments
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mx: 1.5, mt: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={0} 
                    sx={{ 
                      height: 2, 
                      borderRadius: 1,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'grey.900',
                        borderRadius: 1
                      }
                    }} 
                  />
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Card>
  );
};

export default CourseSidebar;