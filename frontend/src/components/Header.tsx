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
  alpha,
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Core Pilot' }) => {
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
      <Toolbar sx={{ px: { xs: 2, md: 4 }, py: 1 }}>
        {/* Logo and Brand */}
        <Box 
          display="flex" 
          alignItems="center" 
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2
            }}
          >
            <SchoolIcon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1 }}>
              Core Pilot
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              AI-Enhanced Learning
            </Typography>
          </Box>
        </Box>

        {/* Page Title */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', ml: 4 }}>
          <Typography variant="h5" fontWeight="700" color="text.primary">
            {getPageTitle()}
          </Typography>
        </Box>

        {/* Navigation Pills */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, mr: 3 }}>
          <Button
            onClick={navigateToDashboard}
            startIcon={<DashboardIcon />}
            variant={getActiveNavItem() === 'dashboard' ? 'contained' : 'text'}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              ...(getActiveNavItem() === 'dashboard' && {
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
              })
            }}
          >
            Dashboard
          </Button>
          <Button
            onClick={navigateToAssignments}
            startIcon={<AssignmentIcon />}
            variant={getActiveNavItem() === 'assignments' ? 'contained' : 'text'}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              ...(getActiveNavItem() === 'assignments' && {
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
              })
            }}
          >
            Assignments
          </Button>
        </Box>

        {/* User Profile Section */}
        <Box display="flex" alignItems="center" gap={2}>
          {/* Notifications */}
          <IconButton
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2)
              }
            }}
          >
            <Badge badgeContent={0} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* User Menu */}
          <Box display="flex" alignItems="center" gap={2}>
            {userProfile && (
              <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right' }}>
                <Typography variant="body2" fontWeight="600">
                  {userProfile.full_name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {userProfile.email}
                </Typography>
              </Box>
            )}
            
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                p: 0,
                border: 2,
                borderColor: alpha(theme.palette.primary.main, 0.2),
                '&:hover': {
                  borderColor: theme.palette.primary.main
                }
              }}
            >
              <Avatar
                src={userProfile?.photo_url}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: theme.palette.primary.main
                }}
              >
                {userProfile?.full_name?.charAt(0) || <PersonIcon />}
              </Avatar>
            </IconButton>
          </Box>
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
              '& .MuiMenuItem-root': {
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                px: 2,
                py: 1.5
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
                  sx={{ width: 48, height: 48, bgcolor: theme.palette.primary.main }}
                >
                  {userProfile.full_name?.charAt(0)}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="body1" fontWeight="600">
                    {userProfile.full_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
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
                  sx={{ borderRadius: 2 }}
                />
                <Chip
                  label={`${userProfile.assignments_count || 0} Assignments`}
                  size="small"
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
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