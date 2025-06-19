import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
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
  Badge,
  Avatar,
  Alert,
  Snackbar,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Fade,
  Slide,
  Breadcrumbs,
  Link,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Search as SearchIcon,
  Sort as SortIcon,
  ViewList as ListViewIcon,
  ViewModule as GridViewIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  AutoStories as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  EventNote as CalendarIcon,
  Task as TaskIcon,
  RocketLaunch as RocketIcon,
  Dashboard as DashboardIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
  FilterList as FilterIcon,
  Assignment as AssignmentIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';

// Import shared components
import AssignmentDialog from '../components/AssignmentDialog';
import LoadingScreen from '../components/LoadingScreen';

// Import API functions
import {
  getAllAssignments,
  getAssignmentStats,
  AssignmentFilters,
  AssignmentStats,
  AssignmentListItem,
  formatDueDate,
  getDueDateStatus,
  getDueDateColor
} from '../services/assignmentService';
import { getCourses, Course } from '../services/courseService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`assignments-tabpanel-${index}`}
      aria-labelledby={`assignments-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AssignmentsListPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // State management
  const [assignments, setAssignments] = useState<AssignmentListItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<AssignmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  
  // Filter and search state
  const [filters, setFilters] = useState<AssignmentFilters>({
    sort_by: 'due_date',
    order: 'asc',
    limit: 50
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<number | ''>('');
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Load data on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Reload assignments when filters change
  useEffect(() => {
    loadAssignments();
  }, [filters, activeTab]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setStatsLoading(true);
      
      // Load courses and stats in parallel
      const [coursesData, statsData] = await Promise.all([
        getCourses(),
        getAssignmentStats()
      ]);
      
      setCourses(coursesData);
      setStats(statsData);
      setStatsLoading(false);
      
      // Load assignments
      await loadAssignments();
    } catch (error) {
      console.error('Failed to load initial data:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load assignments data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAssignments = async () => {
    try {
      const currentFilters: AssignmentFilters = {
        ...filters,
        search: searchQuery || undefined,
        course_id: selectedCourse || undefined,
        status: getStatusFilter()
      };
      
      const assignmentsData = await getAllAssignments(currentFilters);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error('Failed to load assignments:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load assignments',
        severity: 'error'
      });
    }
  };

  const getStatusFilter = (): 'overdue' | 'due_soon' | 'upcoming' | undefined => {
    switch (activeTab) {
      case 1: return 'overdue';
      case 2: return 'due_soon';
      case 3: return 'upcoming';
      default: return undefined;
    }
  };

  // Memoized filtered assignments for better performance
  const filteredAssignments = useMemo(() => {
    return assignments;
  }, [assignments]);

  // Event handlers
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    loadAssignments();
  };

  const handleCourseFilter = (courseId: number | '') => {
    setSelectedCourse(courseId);
    setFilters(prev => ({ ...prev, course_id: courseId || undefined }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({ ...prev, sort_by: sortBy as any }));
  };

  const handleOrderChange = () => {
    setFilters(prev => ({ 
      ...prev, 
      order: prev.order === 'asc' ? 'desc' : 'asc' 
    }));
  };

  const handleViewModeChange = (_: React.MouseEvent<HTMLElement>, newViewMode: 'list' | 'grid') => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const handleAssignmentClick = (assignmentId: number) => {
    navigate(`/assignments/${assignmentId}`, {
      state: { from: '/assignments' }
    });
  };

  const handleCreateAssignment = () => {
    setAssignmentDialogOpen(true);
  };

  const handleAssignmentCreated = () => {
    setSnackbar({
      open: true,
      message: 'Assignment created successfully!',
      severity: 'success'
    });
    loadInitialData(); // Refresh data
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue': return <WarningIcon color="error" />;
      case 'due-soon': return <AccessTimeIcon color="warning" />;
      case 'upcoming': default: return <CheckCircleIcon color="success" />;
    }
  };

  const getCourseById = (courseId: number) => {
    return courses.find(course => course.id === courseId);
  };

  const renderAssignmentCard = (assignment: AssignmentListItem, index: number) => {
    const status = getDueDateStatus(assignment);
    const statusColor = getDueDateColor(status);
    const course = getCourseById(assignment.course_id);

    return (
      <Slide
        key={assignment.id}
        direction="up"
        in={true}
        timeout={300 + (index * 100)}
        style={{ transitionDelay: `${index * 50}ms` }}
      >
        <Card
          elevation={2}
          sx={{
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: 3,
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
              '& .assignment-actions': {
                opacity: 1
              }
            },
            border: assignment.is_overdue ? `2px solid ${theme.palette.error.main}` : 'none',
            background: assignment.is_overdue 
              ? `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.05)} 0%, ${alpha(theme.palette.error.main, 0.02)} 100%)`
              : 'background.paper'
          }}
          onClick={() => handleAssignmentClick(assignment.id)}
        >
          <CardContent sx={{ p: 3 }}>
            {/* Course badge and status */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Chip
                label={course?.name || 'Unknown Course'}
                icon={<SchoolIcon />}
                size="small"
                variant="outlined"
                sx={{ 
                  fontWeight: 600,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                  borderRadius: 2
                }}
              />
              <Box display="flex" alignItems="center" gap={1}>
                {getStatusIcon(status)}
                <Chip
                  label={status === 'overdue' ? 'Overdue' : status === 'due-soon' ? 'Due Soon' : 'Upcoming'}
                  color={statusColor}
                  size="small"
                  variant="filled"
                  sx={{ borderRadius: 2, fontWeight: 600 }}
                />
              </Box>
            </Box>

            {/* Assignment title */}
            <Typography
              variant="h6"
              fontWeight="700"
              gutterBottom
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.3,
                mb: 2
              }}
            >
              {assignment.title}
            </Typography>

            {/* Due date and time remaining */}
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {formatDueDate(assignment.due_date)}
                </Typography>
              </Box>
              
              {assignment.days_until_due !== undefined && (
                <Typography
                  variant="caption"
                  color={assignment.is_overdue ? 'error.main' : 'text.secondary'}
                  fontWeight={600}
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: assignment.is_overdue 
                      ? alpha(theme.palette.error.main, 0.1)
                      : alpha(theme.palette.primary.main, 0.08)
                  }}
                >
                  {assignment.is_overdue 
                    ? `${Math.abs(assignment.days_until_due)} days overdue`
                    : assignment.days_until_due === 0 
                      ? 'Due today'
                      : `${assignment.days_until_due} days left`
                  }
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Slide>
    );
  };

  if (loading) {
    return <LoadingScreen message="Loading assignments..." />;
  }

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
              onClick={handleCreateAssignment}
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
            onChange={handleTabChange}
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
                onChange={handleSearchChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'grey.400' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchQuery('')}>
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
                  onChange={(e) => handleCourseFilter(e.target.value as number | '')}
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
                  onChange={(e) => handleSortChange(e.target.value)}
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
                  onClick={handleOrderChange}
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

      {/* Assignments Content */}
      <TabPanel value={activeTab} index={activeTab}>
        {filteredAssignments.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: 'center',
              border: 1,
              borderColor: 'grey.200',
              borderRadius: 3,
              bgcolor: 'grey.50'
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            </Avatar>
            <Typography variant="h5" gutterBottom fontWeight="700">
              No assignments found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
              {activeTab === 0 
                ? 'Create your first assignment to get started with organizing your academic work'
                : 'No assignments match the current filter criteria. Try adjusting your filters or create a new assignment.'
              }
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateAssignment}
              size="large"
              sx={{ 
                borderRadius: 2, 
                textTransform: 'none', 
                fontWeight: 700,
                px: 4,
                py: 1.5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
              }}
            >
              Create Assignment
            </Button>
          </Paper>
        ) : (
          <Paper
            elevation={0}
            sx={{
              border: 1,
              borderColor: 'grey.200',
              borderRadius: 3,
              overflow: 'hidden'
            }}
          >
            <List disablePadding>
              {filteredAssignments.map((assignment, index) => {
                const status = getDueDateStatus(assignment);
                const statusColor = getDueDateColor(status);
                const course = getCourseById(assignment.course_id);

                return (
                  <React.Fragment key={assignment.id}>
                    <Fade in timeout={100 + (index * 50)}>
                      <ListItem
                        disablePadding
                        sx={{
                          borderLeft: 4,
                          borderLeftColor: assignment.is_overdue 
                            ? 'error.main' 
                            : status === 'due-soon' 
                              ? 'warning.main' 
                              : 'transparent',
                          bgcolor: assignment.is_overdue 
                            ? alpha(theme.palette.error.main, 0.02)
                            : status === 'due-soon'
                              ? alpha(theme.palette.warning.main, 0.02)
                              : 'transparent'
                        }}
                      >
                        <ListItemButton
                          onClick={() => handleAssignmentClick(assignment.id)}
                          sx={{
                            py: 2,
                            px: 3,
                            '&:hover': {
                              bgcolor: 'grey.50'
                            }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 48 }}>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: assignment.is_overdue 
                                  ? 'error.50' 
                                  : status === 'due-soon' 
                                    ? 'warning.50' 
                                    : 'primary.50'
                              }}
                            >
                              <AssignmentIcon 
                                sx={{ 
                                  fontSize: 20,
                                  color: assignment.is_overdue 
                                    ? 'error.600' 
                                    : status === 'due-soon' 
                                      ? 'warning.600' 
                                      : 'primary.600'
                                }} 
                              />
                            </Avatar>
                          </ListItemIcon>
                          
                          <ListItemText
                            primary={
                              <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                                <Typography variant="h6" fontWeight="600" sx={{ flex: 1 }}>
                                  {assignment.title}
                                </Typography>
                                <Chip
                                  label={status === 'overdue' ? 'Overdue' : status === 'due-soon' ? 'Due Soon' : 'Upcoming'}
                                  color={statusColor}
                                  size="small"
                                  variant="filled"
                                  sx={{ fontWeight: 600 }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Box display="flex" alignItems="center" gap={2} mb={1}>
                                  <Box display="flex" alignItems="center" gap={0.5}>
                                    <SchoolIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                      {course?.name || 'Unknown Course'}
                                    </Typography>
                                  </Box>
                                  <Box display="flex" alignItems="center" gap={0.5}>
                                    <CalendarIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                      {formatDueDate(assignment.due_date)}
                                    </Typography>
                                  </Box>
                                </Box>
                                
                                {assignment.days_until_due !== undefined && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      px: 1,
                                      py: 0.25,
                                      borderRadius: 1,
                                      bgcolor: assignment.is_overdue 
                                        ? alpha(theme.palette.error.main, 0.1)
                                        : alpha(theme.palette.primary.main, 0.1),
                                      color: assignment.is_overdue ? 'error.main' : 'text.secondary',
                                      fontWeight: 600
                                    }}
                                  >
                                    {assignment.is_overdue 
                                      ? `${Math.abs(assignment.days_until_due)} days overdue`
                                      : assignment.days_until_due === 0 
                                        ? 'Due today'
                                        : `${assignment.days_until_due} days left`
                                    }
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                          
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              sx={{
                                opacity: 0.7,
                                '&:hover': {
                                  opacity: 1,
                                  bgcolor: 'grey.100'
                                }
                              }}
                            >
                              <ArrowForwardIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItemButton>
                      </ListItem>
                    </Fade>
                    {index < filteredAssignments.length - 1 && (
                      <Divider variant="inset" component="li" sx={{ ml: 11 }} />
                    )}
                  </React.Fragment>
                );
              })}
            </List>
          </Paper>
        )}
      </TabPanel>

      {/* Assignment Creation Dialog */}
      <AssignmentDialog
        open={assignmentDialogOpen}
        onClose={() => setAssignmentDialogOpen(false)}
        onAssignmentCreated={handleAssignmentCreated}
      />

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 3 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AssignmentsListPage;