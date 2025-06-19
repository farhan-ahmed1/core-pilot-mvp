import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { AssignmentListItem, getDueDateStatus } from '../services/assignmentService';

/**
 * Get the appropriate status icon for an assignment
 */
export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'overdue': return <WarningIcon color="error" />;
    case 'due-soon': return <AccessTimeIcon color="warning" />;
    case 'upcoming': default: return <CheckCircleIcon color="success" />;
  }
};

/**
 * Get the priority border color for an assignment
 */
export const getPriorityBorder = (assignment: AssignmentListItem) => {
  const status = getDueDateStatus(assignment);
  if (status === 'overdue') return 'error.main';
  if (status === 'due-soon') return 'warning.main';
  return 'grey.200';
};

/**
 * Get the priority background color for an assignment
 */
export const getPriorityBackground = (assignment: AssignmentListItem, theme: any) => {
  const status = getDueDateStatus(assignment);
  if (status === 'overdue') return `rgba(${theme.palette.error.main}, 0.02)`;
  if (status === 'due-soon') return `rgba(${theme.palette.warning.main}, 0.02)`;
  return 'transparent';
};

/**
 * Format time remaining message for an assignment
 */
export const formatTimeRemaining = (assignment: AssignmentListItem) => {
  if (assignment.days_until_due === undefined) return '';
  
  if (assignment.is_overdue) {
    return `${Math.abs(assignment.days_until_due)} days overdue`;
  }
  
  if (assignment.days_until_due === 0) {
    return 'Due today';
  }
  
  return `${assignment.days_until_due} days left`;
};