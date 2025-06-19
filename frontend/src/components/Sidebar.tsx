import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip,
  Badge,
  Avatar,
  Stack,
  Paper,
  alpha,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendsIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  open?: boolean;
  width?: number;
  onClose?: () => void;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactElement;
  path: string;
  badge?: number;
  disabled?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  open = true, 
  width = 280,
  onClose 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { userProfile } = useAuth();

  // Navigation items configuration
  const primaryNavItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard'
    },
    {
      id: 'assignments',
      label: 'Assignments',
      icon: <AssignmentIcon />,
      path: '/assignments',
      badge: 3 // Could be dynamic from assignment stats
    },
    {
      id: 'courses',
      label: 'Courses',
      icon: <SchoolIcon />,
      path: '/courses'
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <CalendarIcon />,
      path: '/calendar',
      disabled: true
    }
  ];

  const secondaryNavItems: NavigationItem[] = [
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <AnalyticsIcon />,
      path: '/analytics',
      disabled: true
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <PersonIcon />,
      path: '/profile'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
      disabled: true
    }
  ];

  const handleNavigation = (path: string, disabled?: boolean) => {
    if (disabled) return;
    navigate(path);
    onClose?.();
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const renderNavItem = (item: NavigationItem) => (
    <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton
        onClick={() => handleNavigation(item.path, item.disabled)}
        disabled={item.disabled}
        sx={{
          borderRadius: 2,
          mx: 1,
          px: 2,
          py: 1.5,
          transition: 'all 0.2s ease',
          bgcolor: isActive(item.path) ? 'grey.900' : 'transparent',
          color: isActive(item.path) ? 'white' : 'text.primary',
          '&:hover': {
            bgcolor: isActive(item.path) ? 'grey.800' : 'grey.100',
            transform: 'translateX(2px)'
          },
          '&.Mui-disabled': {
            opacity: 0.5,
            color: 'text.disabled'
          }
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 40,
            color: 'inherit',
            '& svg': {
              fontSize: 20
            }
          }}
        >
          {item.badge ? (
            <Badge 
              badgeContent={item.badge} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.6875rem',
                  height: 16,
                  minWidth: 16
                }
              }}
            >
              {item.icon}
            </Badge>
          ) : (
            item.icon
          )}
        </ListItemIcon>
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{
            variant: 'body2',
            fontWeight: isActive(item.path) ? 600 : 500,
            fontSize: '0.875rem'
          }}
        />
        {item.disabled && (
          <Chip
            label="Soon"
            size="small"
            sx={{
              height: 20,
              fontSize: '0.6875rem',
              bgcolor: 'grey.200',
              color: 'text.secondary'
            }}
          />
        )}
      </ListItemButton>
    </ListItem>
  );

  return (
    <Paper
      elevation={0}
      sx={{
        width,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'grey.200',
        display: 'flex',
        flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        zIndex: theme.zIndex.drawer,
        // Enhanced mobile overlay styling
        ...(theme.breakpoints.down('lg') && {
          boxShadow: open ? theme.shadows[16] : 'none',
          backdropFilter: 'blur(8px)',
        })
      }}
    >
      {/* Sidebar Header */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'grey.200' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: 'grey.900',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <SchoolIcon sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="600" sx={{ lineHeight: 1.2 }}>
              Core Pilot
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Academic Dashboard
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 3 }}>
        {/* Primary Navigation */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            fontWeight="600"
            sx={{ px: 3, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}
          >
            Main
          </Typography>
          <List disablePadding>
            {primaryNavItems.map(renderNavItem)}
          </List>
        </Box>

        <Divider sx={{ mx: 2, mb: 3 }} />

        {/* Secondary Navigation */}
        <Box>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            fontWeight="600"
            sx={{ px: 3, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}
          >
            Tools
          </Typography>
          <List disablePadding>
            {secondaryNavItems.map(renderNavItem)}
          </List>
        </Box>
      </Box>

      {/* Sidebar Footer */}
      <Box sx={{ p: 3, borderTop: 1, borderColor: 'grey.200' }}>
        <Stack spacing={1}>
          <ListItemButton
            sx={{
              borderRadius: 2,
              px: 2,
              py: 1,
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <HelpIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            </ListItemIcon>
            <ListItemText
              primary="Help & Support"
              primaryTypographyProps={{
                variant: 'body2',
                color: 'text.secondary',
                fontSize: '0.8125rem'
              }}
            />
          </ListItemButton>
        </Stack>
      </Box>
    </Paper>
  );
};

export default Sidebar;