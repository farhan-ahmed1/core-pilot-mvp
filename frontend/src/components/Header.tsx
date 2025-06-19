import React, { useState } from 'react';
import { 
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Badge,
  Chip
} from '@mui/material';
import { 
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  RocketLaunch as RocketIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { alpha, useTheme } from '@mui/material/styles';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Core Pilot' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
    setNotificationAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  const isActivePage = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${alpha('#fff', 0.1)}`
      }}
    >
      <Toolbar sx={{ minHeight: 72 }}>
        {/* Logo/Title with enhanced styling */}
        <Box
          component={Link}
          to="/dashboard"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            mr: 4,
            flexGrow: { xs: 1, md: 0 }
          }}
        >
          <Avatar
            sx={{
              mr: 2,
              bgcolor: alpha('#fff', 0.15),
              width: 40,
              height: 40,
              border: `2px solid ${alpha('#fff', 0.2)}`
            }}
          >
            <RocketIcon sx={{ color: 'white' }} />
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: '1.4rem',
                lineHeight: 1.2,
                background: 'linear-gradient(45deg, #fff 30%, rgba(255,255,255,0.8) 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: alpha('#fff', 0.7),
                fontWeight: 500,
                fontSize: '0.75rem'
              }}
            >
              Learning Management System
            </Typography>
          </Box>
        </Box>

        {/* Desktop Navigation with enhanced styling */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Button
            onClick={() => handleNavigate('/dashboard')}
            startIcon={<DashboardIcon />}
            sx={{
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 3,
              bgcolor: isActivePage('/dashboard') ? alpha('#fff', 0.15) : 'transparent',
              backdropFilter: isActivePage('/dashboard') ? 'blur(10px)' : 'none',
              border: isActivePage('/dashboard') ? `1px solid ${alpha('#fff', 0.2)}` : 'none',
              '&:hover': {
                bgcolor: alpha('#fff', 0.1),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha('#fff', 0.15)}`
              }
            }}
          >
            Dashboard
          </Button>
          <Button
            onClick={() => handleNavigate('/assignments')}
            startIcon={<AssignmentIcon />}
            sx={{
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 3,
              bgcolor: isActivePage('/assignments') ? alpha('#fff', 0.15) : 'transparent',
              backdropFilter: isActivePage('/assignments') ? 'blur(10px)' : 'none',
              border: isActivePage('/assignments') ? `1px solid ${alpha('#fff', 0.2)}` : 'none',
              '&:hover': {
                bgcolor: alpha('#fff', 0.1),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha('#fff', 0.15)}`
              }
            }}
          >
            Assignments
          </Button>
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
          <IconButton
            size="large"
            aria-label="notifications"
            onClick={handleNotificationMenuOpen}
            sx={{
              color: 'white',
              bgcolor: alpha('#fff', 0.1),
              borderRadius: 2,
              '&:hover': {
                bgcolor: alpha('#fff', 0.15)
              }
            }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Mobile menu icon */}
          <IconButton
            size="large"
            aria-label="mobile menu"
            onClick={handleMobileMenuOpen}
            sx={{
              color: 'white',
              display: { xs: 'flex', md: 'none' },
              bgcolor: alpha('#fff', 0.1),
              borderRadius: 2,
              '&:hover': {
                bgcolor: alpha('#fff', 0.15)
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Profile section with enhanced avatar */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account menu"
            onClick={handleProfileMenuOpen}
            sx={{
              ml: 1,
              p: 0
            }}
          >
            <Avatar 
              sx={{ 
                width: 44, 
                height: 44,
                bgcolor: alpha('#fff', 0.15),
                border: `2px solid ${alpha('#fff', 0.2)}`,
                '&:hover': {
                  border: `2px solid ${alpha('#fff', 0.4)}`,
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <AccountCircleIcon sx={{ color: 'white' }} />
            </Avatar>
          </IconButton>
        </Box>

        {/* Enhanced Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 12,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 4px 16px rgba(0,0,0,0.2))',
              mt: 1.5,
              borderRadius: 3,
              minWidth: 240,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {/* User Info Header */}
          <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  John Doe
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  john.doe@example.com
                </Typography>
              </Box>
            </Box>
          </Box>

          <MenuItem 
            onClick={() => handleNavigate('/profile')}
            sx={{ 
              borderRadius: 2, 
              mx: 1, 
              my: 0.5,
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) }
            }}
          >
            <PersonIcon sx={{ mr: 2, color: 'primary.main' }} /> 
            <Box>
              <Typography variant="body2" fontWeight={600}>Profile</Typography>
              <Typography variant="caption" color="text.secondary">Manage your account</Typography>
            </Box>
          </MenuItem>
          
          <MenuItem 
            onClick={() => handleNavigate('/settings')}
            sx={{ 
              borderRadius: 2, 
              mx: 1, 
              my: 0.5,
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) }
            }}
          >
            <SettingsIcon sx={{ mr: 2, color: 'primary.main' }} /> 
            <Box>
              <Typography variant="body2" fontWeight={600}>Settings</Typography>
              <Typography variant="caption" color="text.secondary">Preferences & configuration</Typography>
            </Box>
          </MenuItem>
          
          <Divider sx={{ mx: 1, my: 1 }} />
          
          <MenuItem 
            onClick={() => handleNavigate('/login')}
            sx={{ 
              borderRadius: 2, 
              mx: 1, 
              my: 0.5,
              color: 'error.main',
              '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.08) }
            }}
          >
            <LogoutIcon sx={{ mr: 2 }} /> 
            <Box>
              <Typography variant="body2" fontWeight={600}>Sign Out</Typography>
              <Typography variant="caption" color="text.secondary">Logout from your account</Typography>
            </Box>
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 12,
            sx: {
              borderRadius: 3,
              minWidth: 320,
              maxWidth: 400,
              filter: 'drop-shadow(0px 4px 16px rgba(0,0,0,0.2))',
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight="bold">
              Notifications
            </Typography>
          </Box>
          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            <MenuItem sx={{ borderRadius: 2, mx: 1, my: 0.5 }}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" fontWeight={600}>
                  Assignment Due Tomorrow
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  "Data Structures Project" is due in 24 hours
                </Typography>
                <Chip label="Due Soon" color="warning" size="small" sx={{ mt: 1 }} />
              </Box>
            </MenuItem>
            <MenuItem sx={{ borderRadius: 2, mx: 1, my: 0.5 }}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" fontWeight={600}>
                  New Course Added
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  "Advanced Algorithms" has been added to your courses
                </Typography>
                <Chip label="New" color="primary" size="small" sx={{ mt: 1 }} />
              </Box>
            </MenuItem>
          </Box>
        </Menu>

        {/* Enhanced Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchorEl}
          id="mobile-menu"
          keepMounted
          open={Boolean(mobileMenuAnchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 12,
            sx: {
              borderRadius: 3,
              minWidth: 280,
              filter: 'drop-shadow(0px 4px 16px rgba(0,0,0,0.2))',
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem 
            onClick={() => handleNavigate('/dashboard')}
            sx={{ 
              borderRadius: 2, 
              mx: 1, 
              my: 0.5,
              bgcolor: isActivePage('/dashboard') ? alpha(theme.palette.primary.main, 0.08) : 'transparent'
            }}
          >
            <DashboardIcon sx={{ mr: 2, color: 'primary.main' }} /> 
            Dashboard
          </MenuItem>
          <MenuItem 
            onClick={() => handleNavigate('/assignments')}
            sx={{ 
              borderRadius: 2, 
              mx: 1, 
              my: 0.5,
              bgcolor: isActivePage('/assignments') ? alpha(theme.palette.primary.main, 0.08) : 'transparent'
            }}
          >
            <AssignmentIcon sx={{ mr: 2, color: 'primary.main' }} /> 
            Assignments
          </MenuItem>
          <Divider sx={{ mx: 1, my: 1 }} />
          <MenuItem 
            onClick={() => handleNavigate('/profile')}
            sx={{ borderRadius: 2, mx: 1, my: 0.5 }}
          >
            <PersonIcon sx={{ mr: 2, color: 'primary.main' }} /> 
            Profile
          </MenuItem>
          <MenuItem 
            onClick={() => handleNavigate('/login')}
            sx={{ borderRadius: 2, mx: 1, my: 0.5, color: 'error.main' }}
          >
            <LogoutIcon sx={{ mr: 2 }} /> 
            Sign Out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;