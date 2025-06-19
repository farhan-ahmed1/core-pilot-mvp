import React from 'react';
import {
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Edit as DraftIcon,
  CheckCircle as FeedbackIcon,
  HelpOutline as NoDraftIcon,
} from '@mui/icons-material';

interface Assignment {
  id: number;
  title: string;
  // Add draft and feedback status properties
  has_draft?: boolean;
  has_feedback?: boolean;
}

interface AssignmentStatusIndicatorProps {
  assignment: Assignment;
}

/**
 * FRE-3.1 Status Indicator Component
 * Shows "No draft", "Draft saved", "Feedback ready" status as required by PRD
 */
const AssignmentStatusIndicator: React.FC<AssignmentStatusIndicatorProps> = ({ 
  assignment 
}) => {
  const theme = useTheme();

  // Determine status based on draft and feedback availability
  const getStatus = () => {
    if (assignment.has_feedback) {
      return {
        label: 'Feedback Ready',
        color: theme.palette.success.main,
        bgcolor: alpha(theme.palette.success.main, 0.1),
        icon: <FeedbackIcon sx={{ fontSize: 14 }} />
      };
    } else if (assignment.has_draft) {
      return {
        label: 'Draft Saved',
        color: theme.palette.info.main,
        bgcolor: alpha(theme.palette.info.main, 0.1),
        icon: <DraftIcon sx={{ fontSize: 14 }} />
      };
    } else {
      return {
        label: 'No Draft',
        color: theme.palette.text.secondary,
        bgcolor: alpha(theme.palette.grey[500], 0.1),
        icon: <NoDraftIcon sx={{ fontSize: 14 }} />
      };
    }
  };

  const status = getStatus();

  return (
    <Chip
      label={status.label}
      icon={status.icon}
      size="small"
      variant="outlined"
      sx={{
        fontSize: '0.7rem',
        fontWeight: 500,
        height: 24,
        borderColor: status.color,
        color: status.color,
        bgcolor: status.bgcolor,
        '& .MuiChip-icon': {
          color: status.color,
        },
        '& .MuiChip-label': {
          px: 1,
          py: 0.25
        }
      }}
    />
  );
};

export default AssignmentStatusIndicator;