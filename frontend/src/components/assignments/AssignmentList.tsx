import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Fade,
  useTheme,
  alpha,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
} from '@mui/material';
import {
  EventNote as CalendarIcon,
  Sort as SortIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Assignment } from '../../services/courseService';
import {
  AssignmentWithStatus,
  transformAssignmentWithStatus,
  getStatusDisplayInfo,
  getDueDateDisplayInfo,
  sortAssignments,
  formatAssignmentDueDate,
  formatAssignmentCreatedDate,
} from '../../utils/assignmentUtils';

interface AssignmentListProps {
  assignments: Assignment[];
  courseName?: string;
}

type SortOption = 'due_date' | 'title' | 'status';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'list' | 'grid';

const AssignmentList: React.FC<AssignmentListProps> = ({ assignments, courseName }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // State for sorting and view options
  const [sortBy, setSortBy] = useState<SortOption>('due_date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Transform assignments with status calculations
  const assignmentsWithStatus = useMemo(
    () => assignments.map(transformAssignmentWithStatus),
    [assignments]
  );

  // Sorted assignments
  const sortedAssignments = useMemo(
    () => sortAssignments(assignmentsWithStatus, sortBy, sortOrder),
    [assignmentsWithStatus, sortBy, sortOrder]
  );

  const handleSortChange = (newSortBy: SortOption) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const handleAssignmentClick = (assignmentId: number) => {
    navigate(`/assignments/${assignmentId}`);
  };

  // Empty state
  if (assignments.length === 0) {
    return (
      <Fade in timeout={800}>
        <Paper
          elevation={0}
          sx={{
            p: 8,
            textAlign: 'center',
            borderRadius: 3,
            border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
            bgcolor: alpha(theme.palette.primary.main, 0.02),
          }}
        >
          <Typography variant="h6" fontWeight="600" gutterBottom>
            No assignments yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {courseName ? `No assignments found for ${courseName}` : 'No assignments to display'}
          </Typography>
        </Paper>
      </Fade>
    );
  }

  return (
    <Box>
      {/* Controls */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="due_date">Due Date</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="status">Status</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ToggleButtonGroup
              value={sortOrder}
              exclusive
              onChange={(_, value) => value && setSortOrder(value)}
              size="small"
            >
              <ToggleButton value="asc" sx={{ px: 2 }}>
                <SortIcon sx={{ mr: 1, fontSize: 16 }} />
                {sortBy === 'due_date' ? 'Earliest' : 'A-Z'}
              </ToggleButton>
              <ToggleButton value="desc" sx={{ px: 2 }}>
                <SortIcon sx={{ mr: 1, fontSize: 16, transform: 'rotate(180deg)' }} />
                {sortBy === 'due_date' ? 'Latest' : 'Z-A'}
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, value) => value && setViewMode(value)}
                size="small"
              >
                <ToggleButton value="list">
                  <ViewListIcon />
                </ToggleButton>
                <ToggleButton value="grid">
                  <ViewModuleIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Assignment List */}
      {viewMode === 'list' ? (
        <Stack spacing={2}>
          {sortedAssignments.map((assignment, index) => (
            <AssignmentListItem
              key={assignment.id}
              assignment={assignment}
              index={index}
              onClick={() => handleAssignmentClick(assignment.id)}
            />
          ))}
        </Stack>
      ) : (
        <Grid container spacing={2}>
          {sortedAssignments.map((assignment, index) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={assignment.id}>
              <AssignmentGridItem
                assignment={assignment}
                index={index}
                onClick={() => handleAssignmentClick(assignment.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

// List item component
interface AssignmentItemProps {
  assignment: AssignmentWithStatus;
  index: number;
  onClick: () => void;
}

const AssignmentListItem: React.FC<AssignmentItemProps> = ({ assignment, index, onClick }) => {
  const theme = useTheme();
  const statusInfo = getStatusDisplayInfo(assignment.status, theme);
  const dueDateInfo = getDueDateDisplayInfo(assignment, theme);

  return (
    <Fade in timeout={300 + index * 50}>
      <Paper
        sx={{
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          overflow: 'hidden',
          position: 'relative',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4],
            borderColor: theme.palette.primary.main,
          },
          ...(assignment.isOverdue && {
            borderLeftWidth: 4,
            borderLeftColor: theme.palette.error.main,
          }),
        }}
        onClick={onClick}
      >
        <Box p={3}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box flex={1}>
              <Typography
                variant="h6"
                fontWeight="600"
                color="text.primary"
                sx={{
                  mb: 1,
                  lineHeight: 1.3,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {assignment.title}
              </Typography>
              
              {assignment.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {assignment.description}
                </Typography>
              )}
            </Box>
            
            <Chip
              label={statusInfo.label}
              size="small"
              sx={{
                ml: 2,
                fontWeight: 600,
                fontSize: '0.75rem',
                color: statusInfo.color,
                bgcolor: statusInfo.bgcolor,
              }}
            />
          </Box>

          {/* Meta Information */}
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {formatAssignmentDueDate(assignment.due_date)}
                </Typography>
              </Box>
              
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  color: dueDateInfo.color,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: alpha(dueDateInfo.color, 0.1)
                }}
              >
                {dueDateInfo.text}
              </Typography>
            </Box>
            
            <Typography variant="caption" color="text.secondary">
              Created {formatAssignmentCreatedDate(assignment.created_at)}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Fade>
  );
};

// Grid item component
const AssignmentGridItem: React.FC<AssignmentItemProps> = ({ assignment, index, onClick }) => {
  const theme = useTheme();
  const statusInfo = getStatusDisplayInfo(assignment.status, theme);
  const dueDateInfo = getDueDateDisplayInfo(assignment, theme);

  return (
    <Fade in timeout={300 + index * 50}>
      <Paper
        sx={{
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          height: '100%',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[6],
            borderColor: theme.palette.primary.main,
          },
          ...(assignment.isOverdue && {
            borderColor: theme.palette.error.main,
            bgcolor: alpha(theme.palette.error.main, 0.02),
          }),
        }}
        onClick={onClick}
      >
        <Box p={3} height="100%" display="flex" flexDirection="column">
          {/* Status Chip */}
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Chip
              label={statusInfo.label}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: '0.75rem',
                color: statusInfo.color,
                bgcolor: statusInfo.bgcolor,
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h6"
            fontWeight="600"
            color="text.primary"
            sx={{
              mb: 2,
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flex: 1
            }}
          >
            {assignment.title}
          </Typography>

          {/* Due Date */}
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {formatAssignmentDueDate(assignment.due_date)}
              </Typography>
            </Box>
            
            <Typography
              variant="caption"
              fontWeight={600}
              sx={{
                color: dueDateInfo.color,
                px: 1,
                py: 0.5,
                borderRadius: 1,
                bgcolor: alpha(dueDateInfo.color, 0.1)
              }}
            >
              {dueDateInfo.text}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Fade>
  );
};

export default AssignmentList;