import React from 'react';
import { Box, Typography } from '@mui/material';
import type { AssignmentStats } from '../../services/assignmentService';

interface DashboardWelcomeProps {
  userDisplayName?: string;
  stats: AssignmentStats | null;
}

const DashboardWelcome: React.FC<DashboardWelcomeProps> = ({
  userDisplayName,
  stats
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusMessage = () => {
    if (!stats) return 'Ready to learn something new today?';
    const messages = [];
    if (stats.due_soon > 0) messages.push(`${stats.due_soon} assignments due soon`);
    if (stats.overdue > 0) messages.push(`${stats.overdue} overdue items that need attention`);
    
    if (messages.length === 0) return 'You\'re all caught up! Great work staying organized.';
    return `You have ${messages.join(' and ')}.`;
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" fontWeight="600" color="text.primary" gutterBottom>
        {getGreeting()}, {userDisplayName?.split(' ')[0] || 'Student'}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {getStatusMessage()}
      </Typography>
    </Box>
  );
};

export default DashboardWelcome;