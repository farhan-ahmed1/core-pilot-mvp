import React from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  Analytics as ActivityIcon,
} from '@mui/icons-material';

interface QuickActionsProps {
  onCreateAssignment: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onCreateAssignment
}) => {
  return (
    <Card elevation={0} sx={{ border: 1, borderColor: 'grey.200', borderRadius: 3 }}>
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'grey.200' }}>
        <Typography variant="h6" fontWeight="600">
          Quick Actions
        </Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        <Stack spacing={1}>
          <Button
            fullWidth
            variant="text"
            startIcon={<AddIcon />}
            onClick={onCreateAssignment}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              fontWeight: 500,
              py: 1.5,
              px: 2,
              borderRadius: 2,
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'grey.50'
              }
            }}
          >
            Add Assignment
          </Button>
          <Button
            fullWidth
            variant="text"
            startIcon={<CalendarIcon />}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              fontWeight: 500,
              py: 1.5,
              px: 2,
              borderRadius: 2,
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'grey.50'
              }
            }}
          >
            View Calendar
          </Button>
          <Button
            fullWidth
            variant="text"
            startIcon={<ActivityIcon />}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              fontWeight: 500,
              py: 1.5,
              px: 2,
              borderRadius: 2,
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'grey.50'
              }
            }}
          >
            View Analytics
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

export default QuickActions;