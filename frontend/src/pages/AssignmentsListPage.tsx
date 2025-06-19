import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
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
  Stack,
  Divider,
  Skeleton,
  Alert,
  Snackbar,
  Paper,
  LinearProgress,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Fade,
  Slide
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  ViewList as ListViewIcon,
  ViewModule as GridViewIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  Assignment as AssignmentListIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';

// Import shared components
import Header from '../components/Header';
import AssignmentDialog from '../components/AssignmentDialog';

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
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
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
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
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

  const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newViewMode: 'list' | 'grid') => {
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
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[8],
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
                  fontWeight: 500,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  borderColor: alpha(theme.palette.primary.main, 0.2)
                }}
              />
              <Box display="flex" alignItems="center" gap={1}>
                {getStatusIcon(status)}
                <Chip
                  label={status === 'overdue' ? 'Overdue' : status === 'due-soon' ? 'Due Soon' : 'Upcoming'}
                  color={statusColor}
                  size="small"
                  variant="filled"
                />
              </Box>
            </Box>

            {/* Assignment title */}
            <Typography
              variant="h6"
              fontWeight="bold"
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
                <Typography variant="body2" color="text.secondary">
                  {formatDueDate(assignment.due_date)}
                </Typography>
              </Box>
              
              {assignment.days_until_due !== undefined && (
                <Typography
                  variant="caption"
                  color={assignment.is_overdue ? 'error.main' : 'text.secondary'}
                  fontWeight={500}
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

  const renderStatsCard = (title: string, value: number, icon: React.ReactNode, color: string) => (
    <Card elevation={2}>
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        <Avatar sx={{ bgcolor: color, mx: 'auto', mb: 2, width: 56, height: 56 }}>
          {icon}
        </Avatar>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'grey.50' }}>
        <Header title="Core Pilot" />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Skeleton variant="rectangular" height={200} sx={{ mb: 4, borderRadius: 2 }} />
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={i}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Header title="Core Pilot" />
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Hero Section with Statistics */}
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Decorative background elements */}
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                bgcolor: alpha('#fff', 0.1),
                zIndex: 0
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 150,
                height: 150,
                borderRadius: '50%',
                bgcolor: alpha('#fff', 0.05),
                zIndex: 0
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                  <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                    Assignment Center
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Manage and track all your assignments in one place
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={handleCreateAssignment}
                  sx={{
                    bgcolor: 'white',
                    color: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: alpha('#fff', 0.9)
                    },
                    borderRadius: 2,
                    px: 3,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Create Assignment
                </Button>
              </Box>

              {/* Statistics Grid */}
              {!statsLoading && stats && (
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    {renderStatsCard(
                      'Total Assignments',
                      stats.total_assignments,
                      <AssignmentListIcon sx={{ fontSize: 28 }} />,
                      alpha('#fff', 0.15)
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    {renderStatsCard(
                      'Overdue',
                      stats.overdue,
                      <WarningIcon sx={{ fontSize: 28 }} />,
                      theme.palette.error.main
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    {renderStatsCard(
                      'Due Soon',
                      stats.due_soon,
                      <AccessTimeIcon sx={{ fontSize: 28 }} />,
                      theme.palette.warning.main
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    {renderStatsCard(
                      'Upcoming',
                      stats.upcoming,
                      <TrendingUpIcon sx={{ fontSize: 28 }} />,
                      theme.palette.success.main
                    )}
                  </Grid>
                </Grid>
              )}
            </Box>
          </Paper>
        </Fade>

        {/* Filters and Controls */}
        <Card elevation={2} sx={{ mb: 4 }}>
          <CardContent>
            {/* Tabs for filtering by status */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="assignment status tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab 
                  label="All Assignments" 
                  icon={<Badge badgeContent={stats?.total_assignments} color="primary" />}
                  iconPosition="end"
                />
                <Tab 
                  label="Overdue" 
                  icon={<Badge badgeContent={stats?.overdue} color="error" />}
                  iconPosition="end"
                />
                <Tab 
                  label="Due Soon" 
                  icon={<Badge badgeContent={stats?.due_soon} color="warning" />}
                  iconPosition="end"
                />
                <Tab 
                  label="Upcoming" 
                  icon={<Badge badgeContent={stats?.upcoming} color="success" />}
                  iconPosition="end"
                />
              </Tabs>
            </Box>

            {/* Search and Filter Controls */}
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  placeholder="Search assignments..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearchQuery('')}>
                          ×
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Filter by Course</InputLabel>
                  <Select
                    value={selectedCourse}
                    onChange={(e) => handleCourseFilter(e.target.value as number | '')}
                    label="Filter by Course"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="">All Courses</MenuItem>
                    {courses.map((course) => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={filters.sort_by}
                    onChange={(e) => handleSortChange(e.target.value)}
                    label="Sort By"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="due_date">Due Date</MenuItem>
                    <MenuItem value="title">Title</MenuItem>
                    <MenuItem value="created_at">Created Date</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 2 }}>
                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    onClick={handleOrderChange}
                    startIcon={<SortIcon />}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                  >
                    {filters.order === 'asc' ? 'Ascending' : 'Descending'}
                  </Button>
                  
                  <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={handleViewModeChange}
                    aria-label="view mode"
                    size="small"
                  >
                    <ToggleButton value="grid" aria-label="grid view">
                      <GridViewIcon />
                    </ToggleButton>
                    <ToggleButton value="list" aria-label="list view">
                      <ListViewIcon />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Assignments Content */}
        <TabPanel value={activeTab} index={activeTab}>
          {filteredAssignments.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 8,
                textAlign: 'center',
                bgcolor: 'background.paper',
                borderRadius: 3,
                border: 2,
                borderColor: 'divider',
                borderStyle: 'dashed'
              }}
            >
              <AssignmentIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight="bold">
                No assignments found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {activeTab === 0 
                  ? 'Create your first assignment to get started'
                  : 'No assignments match the current filter criteria'
                }
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateAssignment}
                size="large"
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                Create Assignment
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredAssignments.map((assignment, index) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={assignment.id}>
                  {renderAssignmentCard(assignment, index)}
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
      </Container>

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
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AssignmentsListPage;