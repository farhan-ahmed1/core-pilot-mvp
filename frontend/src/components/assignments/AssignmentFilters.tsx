import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Paper,
  Breadcrumbs,
  Link,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Sort as SortIcon,
  Add as AddIcon,
  AutoStories as SchoolIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { AssignmentFilters, AssignmentStats } from '../../services/assignmentService';
import type { Course } from '../../services/courseService';

interface AssignmentFiltersProps {
  activeTab: number;
  searchQuery: string;
  selectedCourse: number | '';
  filters: AssignmentFilters;
  stats: AssignmentStats | null;
  courses: Course[];
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: () => void;
  onCourseFilter: (courseId: number | '') => void;
  onSortChange: (sortBy: string) => void;
  onOrderChange: () => void;
  onCreateAssignment: () => void;
}

const AssignmentFilters: React.FC<AssignmentFiltersProps> = ({
  activeTab,
  searchQuery,
  selectedCourse,
  filters,
  stats,
  courses,
  onTabChange,
  onSearchChange,
  onSearchSubmit,
  onCourseFilter,
  onSortChange,
  onOrderChange,
  onCreateAssignment
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <>
      {/* Enhanced Navigation Header */}
      <Box sx={{ mb: 4 }}>
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
            <Typography variant="body2" color="text.primary" fontWeight={500}>
              Assignments
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* Page Header */}
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={3}>
          <Box flex={1}>
            <Typography variant="overline" color="text.secondary" fontWeight={600} letterSpacing={1}>
              Academic Dashboard
            </Typography>
            <Typography variant="h4" fontWeight="700" color="text.primary" sx={{ lineHeight: 1.2, mb: 2 }}>
              Assignment Center
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={400}>
              Manage and track all your assignments in one place
            </Typography>
          </Box>

          {/* Action Controls */}
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateAssignment}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
              }}
            >
              Create Assignment
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Enhanced Filters and Controls */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          border: 1,
          borderColor: 'grey.200',
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        {/* Status Filter Tabs */}
        <Box sx={{ px: 3, py: 2, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'grey.200' }}>
          <Tabs
            value={activeTab}
            onChange={onTabChange}
            aria-label="assignment status tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 40,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                minHeight: 40,
                py: 1,
                px: 2,
                mr: 1,
                fontSize: '0.875rem'
              },
              '& .MuiTabs-indicator': {
                display: 'none'
              },
              '& .Mui-selected': {
                bgcolor: 'white',
                boxShadow: theme.shadows[1]
              }
            }}
          >
            <Tab 
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" fontWeight={600} fontSize="0.875rem">
                    All Assignments
                  </Typography>
                  {stats && (
                    <Chip
                      label={stats.total_assignments}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        bgcolor: activeTab === 0 ? 'primary.main' : 'grey.300',
                        color: activeTab === 0 ? 'white' : 'text.secondary',
                        '& .MuiChip-label': {
                          px: 0.75,
                          py: 0
                        }
                      }}
                    />
                  )}
                </Box>
              }
            />
            <Tab 
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" fontWeight={600} fontSize="0.875rem">
                    Overdue
                  </Typography>
                  {stats && stats.overdue > 0 && (
                    <Chip
                      label={stats.overdue}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        bgcolor: activeTab === 1 ? 'white' : 'error.main',
                        color: activeTab === 1 ? 'error.main' : 'white',
                        '& .MuiChip-label': {
                          px: 0.75,
                          py: 0
                        }
                      }}
                    />
                  )}
                </Box>
              }
            />
            <Tab 
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" fontWeight={600} fontSize="0.875rem">
                    Due Soon
                  </Typography>
                  {stats && stats.due_soon > 0 && (
                    <Chip
                      label={stats.due_soon}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        bgcolor: activeTab === 2 ? 'white' : 'warning.main',
                        color: activeTab === 2 ? 'warning.main' : 'white',
                        '& .MuiChip-label': {
                          px: 0.75,
                          py: 0
                        }
                      }}
                    />
                  )}
                </Box>
              }
            />
            <Tab 
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" fontWeight={600} fontSize="0.875rem">
                    Upcoming
                  </Typography>
                  {stats && (
                    <Chip
                      label={stats.upcoming}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        bgcolor: activeTab === 3 ? 'white' : 'success.main',
                        color: activeTab === 3 ? 'success.main' : 'white',
                        '& .MuiChip-label': {
                          px: 0.75,
                          py: 0
                        }
                      }}
                    />
                  )}
                </Box>
              }
            />
          </Tabs>
        </Box>

        {/* Search and Filter Controls */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{xs: 12, md: 5}}>
              <TextField
                fullWidth
                placeholder="Search assignments by title..."
                value={searchQuery}
                onChange={onSearchChange}
                onKeyPress={(e) => e.key === 'Enter' && onSearchSubmit()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'grey.400' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => onSearchChange({ target: { value: '' } } as any)}>
                        <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>×</Typography>
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'grey.50',
                    '&:hover': {
                      bgcolor: 'grey.100'
                    },
                    '&.Mui-focused': {
                      bgcolor: 'white'
                    }
                  }
                }}
              />
            </Grid>

            <Grid size={{xs: 12, md: 3}}>
              <FormControl fullWidth>
                <InputLabel>Course</InputLabel>
                <Select
                  value={selectedCourse}
                  onChange={(e) => onCourseFilter(e.target.value as number | '')}
                  label="Course"
                  sx={{
                    borderRadius: 2,
                    bgcolor: 'grey.50',
                    '&:hover': {
                      bgcolor: 'grey.100'
                    },
                    '&.Mui-focused': {
                      bgcolor: 'white'
                    }
                  }}
                >
                  <MenuItem value="">All Courses</MenuItem>
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <SchoolIcon sx={{ fontSize: 16, color: 'grey.500' }} />
                        {course.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{xs: 12, md: 2}}>
              <FormControl fullWidth>
                <InputLabel>Sort</InputLabel>
                <Select
                  value={filters.sort_by}
                  onChange={(e) => onSortChange(e.target.value)}
                  label="Sort"
                  sx={{
                    borderRadius: 2,
                    bgcolor: 'grey.50'
                  }}
                >
                  <MenuItem value="due_date">Due Date</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="created_at">Created</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{xs: 12, md: 2}}>
              <Box display="flex" gap={1} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={onOrderChange}
                  startIcon={<SortIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 120
                  }}
                >
                  {filters.order === 'asc' ? 'Ascending' : 'Descending'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );
};

export default AssignmentFilters;