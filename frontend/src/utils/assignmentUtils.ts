import { Assignment } from '../services/courseService';

export type AssignmentStatus = 'no_draft' | 'draft_saved' | 'feedback_ready';

export interface AssignmentWithStatus extends Assignment {
  status: AssignmentStatus;
  daysUntilDue: number;
  isOverdue: boolean;
}

/**
 * Calculate assignment status based on due date and draft/feedback data
 * In production, this would use actual draft and feedback data
 */
export const calculateAssignmentStatus = (assignment: Assignment): AssignmentStatus => {
  const now = new Date();
  const dueDate = new Date(assignment.due_date);
  const diffTime = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Mock status calculation - in real app, this would come from draft/feedback data
  if (diffDays < -5) {
    return 'feedback_ready';
  } else if (diffDays < 2) {
    return 'draft_saved';
  } else {
    return 'no_draft';
  }
};

/**
 * Calculate days until due and overdue status
 */
export const calculateDueDateInfo = (assignment: Assignment) => {
  const now = new Date();
  const dueDate = new Date(assignment.due_date);
  const diffTime = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return {
    daysUntilDue: diffDays,
    isOverdue: diffDays < 0
  };
};

/**
 * Transform assignment with status and due date calculations
 */
export const transformAssignmentWithStatus = (assignment: Assignment): AssignmentWithStatus => {
  const status = calculateAssignmentStatus(assignment);
  const dueDateInfo = calculateDueDateInfo(assignment);
  
  return {
    ...assignment,
    status,
    ...dueDateInfo
  };
};

/**
 * Get status display information with colors and icons
 */
export const getStatusDisplayInfo = (status: AssignmentStatus, theme: any) => {
  switch (status) {
    case 'no_draft':
      return {
        label: 'No draft',
        color: theme.palette.text.secondary,
        bgcolor: `rgba(${theme.palette.grey[500]}, 0.1)`,
        priority: 0
      };
    case 'draft_saved':
      return {
        label: 'Draft saved',
        color: theme.palette.warning.main,
        bgcolor: `rgba(${theme.palette.warning.main}, 0.1)`,
        priority: 1
      };
    case 'feedback_ready':
      return {
        label: 'Feedback ready',
        color: theme.palette.success.main,
        bgcolor: `rgba(${theme.palette.success.main}, 0.1)`,
        priority: 2
      };
    default:
      return {
        label: 'Unknown',
        color: theme.palette.text.secondary,
        bgcolor: `rgba(${theme.palette.grey[500]}, 0.1)`,
        priority: 0
      };
  }
};

/**
 * Get due date display information with urgency indicators
 */
export const getDueDateDisplayInfo = (assignment: AssignmentWithStatus, theme: any) => {
  if (assignment.isOverdue) {
    return {
      text: `${Math.abs(assignment.daysUntilDue)} days overdue`,
      color: theme.palette.error.main,
      urgent: true,
      severity: 'high'
    };
  } else if (assignment.daysUntilDue === 0) {
    return {
      text: 'Due today',
      color: theme.palette.warning.main,
      urgent: true,
      severity: 'high'
    };
  } else if (assignment.daysUntilDue === 1) {
    return {
      text: 'Due tomorrow',
      color: theme.palette.warning.main,
      urgent: true,
      severity: 'medium'
    };
  } else if (assignment.daysUntilDue <= 7) {
    return {
      text: `Due in ${assignment.daysUntilDue} days`,
      color: theme.palette.info.main,
      urgent: false,
      severity: 'low'
    };
  } else {
    return {
      text: `Due in ${assignment.daysUntilDue} days`,
      color: theme.palette.text.secondary,
      urgent: false,
      severity: 'none'
    };
  }
};

/**
 * Sort assignments by various criteria
 */
export const sortAssignments = (
  assignments: AssignmentWithStatus[],
  sortBy: 'due_date' | 'title' | 'status',
  sortOrder: 'asc' | 'desc'
): AssignmentWithStatus[] => {
  return [...assignments].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'due_date':
        comparison = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'status':
        const statusOrder = { 'no_draft': 0, 'draft_saved': 1, 'feedback_ready': 2 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
};

/**
 * Format due date for display
 */
export const formatAssignmentDueDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Format creation date for display
 */
export const formatAssignmentCreatedDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};