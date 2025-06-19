import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Chip,
  Divider,
  ListItemIcon,
  Badge,
  TextField,
  InputAdornment,
  alpha,
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  title?: string;
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title = 'Core Pilot', onMenuToggle, showMenuButton = true }) => {
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
    handleMenuClose();
  };

  const navigateToProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
    handleMenuClose();
  };

  const navigateToAssignments = () => {
    navigate('/assignments');
    handleMenuClose();
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/assignments') return 'Assignments';
    if (path.startsWith('/assignments/')) return 'Assignment Details';
    if (path === '/profile') return 'Profile';
    return title;
  };

  const getActiveNavItem = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path.startsWith('/assignments')) return 'assignments';
    if (path === '/profile') return 'profile';
    return 'dashboard';
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        color: 'text.primary'
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, py: 1, minHeight: '64px !important' }}>
        {/* Mobile Menu Button */}
        {showMenuButton && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuToggle}
            sx={{ mr: 2, display: { lg: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo and Brand */}
        <Box 
          display="flex" 
          alignItems="center" 
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              bgcolor: theme.palette.grey[900],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2
            }}
          >
            <SchoolIcon sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="600" sx={{ lineHeight: 1, fontSize: '1.25rem' }}>
              Core Pilot
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem' }}>
              Academic Dashboard
            </Typography>
          </Box>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Search Bar */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, mr: 3 }}>
          <TextField
            placeholder="Search assignments..."
            size="small"
            variant="outlined"
            sx={{
              width: 280,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'grey.50',
                border: '1px solid',
                borderColor: 'grey.200',
                '&:hover': {
                  borderColor: 'grey.300'
                },
                '&.Mui-focused': {
                  borderColor: 'grey.900',
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.grey[900], 0.2)}`
                }
              },
              '& .MuiOutlinedInput-input': {
                fontSize: '0.875rem'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16, color: 'grey.400' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* User Profile Section */}
        <Box display="flex" alignItems="center" gap={2}>
          {/* Notifications */}
          <IconButton
            sx={{
              color: 'grey.400',
              '&:hover': {
                color: 'grey.600',
                bgcolor: 'transparent'
              }
            }}
          >
            <Badge badgeContent={0} color="error">
              <NotificationsIcon sx={{ fontSize: 20 }} />
            </Badge>
          </IconButton>

          {/* User Avatar */}
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              p: 0,
              '&:hover': {
                transform: 'none'
              }
            }}
          >
            <Avatar
              src={userProfile?.photo_url}
              sx={{
                width: 32,
                height: 32,
                bgcolor: theme.palette.grey[900],
                fontSize: '0.875rem',
                fontWeight: 500
              }}
            >
              {userProfile?.full_name?.split(' ').map(n => n[0]).join('') || 'CP'}
            </Avatar>
          </IconButton>
        </Box>

        {/* User Menu Dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 8,
            sx: {
              borderRadius: 3,
              minWidth: 280,
              mt: 1,
              border: 1,
              borderColor: 'grey.200',
              '& .MuiMenuItem-root': {
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                px: 2,
                py: 1.5,
                fontSize: '0.875rem'
              }
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {/* User Info Header */}
          {userProfile && (
            <Box sx={{ p: 2, pb: 1 }}>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Avatar
                  src={userProfile.photo_url}
                  sx={{ 
                    width: 48, 
                    height: 48, 
                    bgcolor: theme.palette.grey[900],
                    fontSize: '1rem',
                    fontWeight: 500
                  }}
                >
                  {userProfile.full_name?.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="body1" fontWeight="600" sx={{ fontSize: '0.875rem' }}>
                    {userProfile.full_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    {userProfile.email}
                  </Typography>
                </Box>
              </Box>
              
              {/* User Stats */}
              <Box display="flex" gap={1} mt={2}>
                <Chip
                  label={`${userProfile.courses_count || 0} Courses`}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    borderRadius: 1, 
                    fontSize: '0.6875rem',
                    height: 24,
                    borderColor: 'grey.300',
                    color: 'grey.600'
                  }}
                />
                <Chip
                  label={`${userProfile.assignments_count || 0} Assignments`}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    borderRadius: 1, 
                    fontSize: '0.6875rem',
                    height: 24,
                    borderColor: 'grey.300',
                    color: 'grey.600'
                  }}
                />
              </Box>
            </Box>
          )}
          
          <Divider sx={{ my: 1 }} />

          {/* Navigation Items (Mobile) */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <MenuItem onClick={navigateToDashboard}>
              <ListItemIcon>
                <DashboardIcon fontSize="small" />
              </ListItemIcon>
              Dashboard
            </MenuItem>
            <MenuItem onClick={navigateToAssignments}>
              <ListItemIcon>
                <AssignmentIcon fontSize="small" />
              </ListItemIcon>
              Assignments
            </MenuItem>
            <Divider sx={{ my: 1 }} />
          </Box>

          {/* Profile Actions */}
          <MenuItem onClick={navigateToProfile}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profile Settings
          </MenuItem>
          
          <MenuItem onClick={handleSignOut} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: 'error.main' }} />
            </ListItemIcon>
            Sign Out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;