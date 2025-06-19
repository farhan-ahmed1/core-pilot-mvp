import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Divider,
  Button
} from '@mui/material';
import {
  Insights as AnalyticsIcon
} from '@mui/icons-material';

interface AssignmentSidebarProps {
  assignment: any;
  course: any;
}

const AssignmentSidebar: React.FC<AssignmentSidebarProps> = ({
  assignment,
  course
}) => {
  return (
    <Card elevation={0} sx={{ border: 1, borderColor: 'grey.200', borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AnalyticsIcon sx={{ fontSize: 20 }} />
          Assignment Details
        </Typography>
        
        <Stack spacing={3}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={1}>
              Course
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {course.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {course.term}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={1}>
              Created
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {new Date(assignment.created_at).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
          </Box>

          {assignment.updated_at && (
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={1}>
                Last Updated
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {new Date(assignment.updated_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Typography>
            </Box>
          )}

          <Divider />

          {/* Quick Actions */}
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={1} gutterBottom>
              Quick Actions
            </Typography>
            <Stack spacing={1}>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 2,
                  justifyContent: 'flex-start'
                }}
              >
                Generate AI Breakdown
              </Button>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 2,
                  justifyContent: 'flex-start'
                }}
              >
                View Similar Assignments
              </Button>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AssignmentSidebar;