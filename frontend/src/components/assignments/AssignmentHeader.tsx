import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  TextField,
  Stack,
  Breadcrumbs,
  Link,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  EventNote as CalendarIcon,
  Timeline as ProgressIcon,
  MoreVert as MoreVertIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { formatDueDate } from '../../services/assignmentService';

interface AssignmentHeaderProps {
  assignment: any;
  course: any;
  editMode: boolean;
  saving: boolean;
  editForm: {
    title: string;
    description: string;
    prompt: string;
    due_date: string;
  };
  dueDateStatus: string;
  dueDateColor: any;
  onBack: () => void;
  onEditFormChange: (field: string, value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
}

const AssignmentHeader: React.FC<AssignmentHeaderProps> = ({
  assignment,
  course,
  editMode,
  saving,
  editForm,
  dueDateStatus,
  dueDateColor,
  onBack,
  onEditFormChange,
  onSaveEdit,
  onCancelEdit,
  onMenuOpen
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ mb: 3 }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs
          separator={<ChevronRightIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{
            '& .MuiBreadcrumbs-separator': {
              color: 'text.secondary',
              mx: 1
            }
          }}
        >
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/dashboard')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.main',
                textDecoration: 'underline'
              }
            }}
          >
            <HomeIcon sx={{ fontSize: 16 }} />
            Dashboard
          </Link>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/assignments')}
            sx={{
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.main',
                textDecoration: 'underline'
              }
            }}
          >
            Assignments
          </Link>
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            {assignment.title}
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Page Header */}
      <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={3}>
        <Box flex={1}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <IconButton
              onClick={onBack}
              size="small"
              sx={{
                bgcolor: 'grey.100',
                '&:hover': {
                  bgcolor: 'grey.200'
                }
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Box>
              <Typography variant="overline" color="text.secondary" fontWeight={600} letterSpacing={1}>
                {course.name} • {course.term}
              </Typography>
              <Typography variant="h4" fontWeight="700" color="text.primary" sx={{ lineHeight: 1.2 }}>
                {editMode ? (
                  <TextField
                    value={editForm.title}
                    onChange={(e) => onEditFormChange('title', e.target.value)}
                    variant="standard"
                    sx={{
                      '& .MuiInput-input': {
                        fontSize: '2.125rem',
                        fontWeight: 700,
                        p: 0
                      },
                      '& .MuiInput-underline:before': {
                        borderBottomColor: 'divider'
                      }
                    }}
                    fullWidth
                    autoFocus
                  />
                ) : (
                  assignment.title
                )}
              </Typography>
            </Box>
          </Box>
          
          {/* Status and Due Date Row */}
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Chip
              label={dueDateStatus === 'overdue' ? 'Overdue' : dueDateStatus === 'due-soon' ? 'Due Soon' : 'Upcoming'}
              color={dueDateColor}
              variant="filled"
              size="medium"
              sx={{ fontWeight: 600 }}
            />
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Due {editMode ? (
                  <DateTimePicker
                    value={new Date(editForm.due_date)}
                    onChange={(date) => onEditFormChange('due_date', date?.toISOString() || '')}
                    slotProps={{
                      textField: {
                        size: 'small',
                        sx: { ml: 1, minWidth: 200 }
                      }
                    }}
                  />
                ) : (
                  formatDueDate(assignment.due_date)
                )}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Action Controls */}
        <Box display="flex" alignItems="center" gap={1}>
          {editMode ? (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={onCancelEdit}
                disabled={saving}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                onClick={onSaveEdit}
                disabled={saving}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Stack>
          ) : (
            <>
              <Button
                variant="contained"
                startIcon={<ProgressIcon />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                }}
              >
                Start Working
              </Button>
              <IconButton
                onClick={onMenuOpen}
                sx={{
                  bgcolor: 'grey.100',
                  '&:hover': {
                    bgcolor: 'grey.200'
                  }
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AssignmentHeader;