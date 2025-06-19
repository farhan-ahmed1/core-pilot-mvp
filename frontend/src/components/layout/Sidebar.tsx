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
  SpaceDashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  AutoStories as CoursesIcon,
  Person as PersonIcon,
  Analytics as AnalyticsIcon,
  Tune as SettingsIcon,
  CalendarMonth as CalendarIcon,
  QuestionMark as HelpIcon,
  Lightbulb as AIIcon,
  Edit as EditorIcon,
  Psychology as AIFeedbackIcon,
  History as DraftsIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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

  // Navigation items configuration with modern icons
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
      icon: <CoursesIcon />,
      path: '/courses'
    },
    {
      id: 'editor',
      label: 'Draft Editor',
      icon: <EditorIcon />,
      path: '/editor',
      disabled: true
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <CalendarIcon />,
      path: '/calendar',
      disabled: true
    }
  ];

  const aiToolsItems: NavigationItem[] = [
    {
      id: 'ai-feedback',
      label: 'AI Feedback',
      icon: <AIFeedbackIcon />,
      path: '/ai-feedback',
      disabled: true
    },
    {
      id: 'drafts',
      label: 'Draft History',
      icon: <DraftsIcon />,
      path: '/drafts',
      disabled: true
    },
    {
      id: 'analytics',
      label: 'Progress Analytics',
      icon: <AnalyticsIcon />,
      path: '/analytics',
      disabled: true
    }
  ];

  const accountItems: NavigationItem[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <PersonIcon />,
      path: '/profile'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <NotificationsIcon />,
      path: '/notifications',
      disabled: true
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
    <ListItem key={item.id} disablePadding sx={{ mb: 0.25 }}>
      <ListItemButton
        onClick={() => handleNavigation(item.path, item.disabled)}
        disabled={item.disabled}
        sx={{
          borderRadius: 2.5,
          mx: 1.5,
          px: 2.5,
          py: 1.25,
          transition: 'all 0.2s ease',
          bgcolor: isActive(item.path) ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
          color: isActive(item.path) ? 'primary.main' : 'text.primary',
          border: isActive(item.path) ? 1 : 0,
          borderColor: isActive(item.path) ? alpha(theme.palette.primary.main, 0.2) : 'transparent',
          '&:hover': {
            bgcolor: isActive(item.path) 
              ? alpha(theme.palette.primary.main, 0.16) 
              : alpha(theme.palette.primary.main, 0.04),
            transform: 'translateX(2px)',
            boxShadow: `0 2px 8px ${alpha(theme.palette.grey[900], 0.06)}`
          },
          '&.Mui-disabled': {
            opacity: 0.5,
            color: 'text.disabled',
            bgcolor: 'transparent'
          }
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 36,
            color: 'inherit',
            '& svg': {
              fontSize: 18
            }
          }}
        >
          {item.badge ? (
            <Badge 
              badgeContent={item.badge} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.625rem',
                  height: 16,
                  minWidth: 16,
                  fontWeight: 600
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
            fontSize: '0.8125rem',
            lineHeight: 1.4
          }}
        />
        {item.disabled && (
          <Chip
            label="Soon"
            size="small"
            sx={{
              height: 18,
              fontSize: '0.625rem',
              bgcolor: alpha(theme.palette.grey[400], 0.15),
              color: 'text.secondary',
              borderRadius: 1.5,
              fontWeight: 500,
              '& .MuiChip-label': {
                px: 1
              }
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
        bgcolor: alpha('#fafbfc', 0.98),
        backdropFilter: 'blur(20px)',
        borderRight: 1,
        borderColor: alpha(theme.palette.grey[300], 0.4),
        display: 'flex',
        flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        zIndex: theme.zIndex.drawer,
        // Enhanced mobile overlay styling
        ...(theme.breakpoints.down('lg') && {
          boxShadow: open ? theme.shadows[24] : 'none',
          bgcolor: theme.palette.background.paper,
        })
      }}
    >
      {/* Sidebar Header */}
      <Box sx={{ 
        p: 2.5, 
        borderBottom: 1, 
        borderColor: alpha(theme.palette.grey[300], 0.4),
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.015)}, ${alpha('#f8f9fa', 0.6)})`
      }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2.5,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 3px 8px ${alpha(theme.palette.primary.main, 0.2)}`
            }}
          >
            <AIIcon sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="700" sx={{ lineHeight: 1.2, fontSize: '1rem' }}>
              Core Pilot
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem', fontWeight: 500 }}>
              AI Academic Assistant
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Navigation */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        py: 2,
        background: `linear-gradient(180deg, ${alpha('#f0f4f8', 0.2)}, transparent 50%)`
      }}>
        {/* Primary Navigation */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="overline" 
            color="text.secondary" 
            fontWeight="700"
            sx={{ 
              px: 2.5, 
              mb: 1.5, 
              display: 'block', 
              letterSpacing: 1,
              fontSize: '0.625rem'
            }}
          >
            Main
          </Typography>
          <List disablePadding>
            {primaryNavItems.map(renderNavItem)}
          </List>
        </Box>

        <Divider sx={{ mx: 2.5, mb: 3, borderColor: alpha(theme.palette.grey[300], 0.5) }} />

        {/* AI Tools Section */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="overline" 
            color="text.secondary" 
            fontWeight="700"
            sx={{ 
              px: 2.5, 
              mb: 1.5, 
              display: 'block', 
              letterSpacing: 1,
              fontSize: '0.625rem'
            }}
          >
            AI Tools
          </Typography>
          <List disablePadding>
            {aiToolsItems.map(renderNavItem)}
          </List>
        </Box>

        <Divider sx={{ mx: 2.5, mb: 3, borderColor: alpha(theme.palette.grey[300], 0.5) }} />

        {/* Account Section */}
        <Box>
          <Typography 
            variant="overline" 
            color="text.secondary" 
            fontWeight="700"
            sx={{ 
              px: 2.5, 
              mb: 1.5, 
              display: 'block', 
              letterSpacing: 1,
              fontSize: '0.625rem'
            }}
          >
            Account
          </Typography>
          <List disablePadding>
            {accountItems.map(renderNavItem)}
          </List>
        </Box>
      </Box>

      {/* Enhanced User Profile Footer */}
      <Box sx={{ 
        p: 2.5, 
        borderTop: 1, 
        borderColor: alpha(theme.palette.grey[300], 0.4),
        background: `linear-gradient(135deg, ${alpha('#f0f4f8', 0.6)}, ${alpha(theme.palette.background.paper, 0.8)})`
      }}>
        {userProfile ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              borderRadius: 2.5,
              bgcolor: alpha(theme.palette.background.paper, 0.7),
              border: 1,
              borderColor: alpha(theme.palette.grey[300], 0.25),
              mb: 1.5,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.03),
                borderColor: alpha(theme.palette.primary.main, 0.15),
                transform: 'translateY(-0.5px)',
                boxShadow: `0 3px 8px ${alpha(theme.palette.grey[900], 0.06)}`
              }
            }}
            onClick={() => navigate('/profile')}
          >
            <Avatar
              src={userProfile.photo_url}
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.main',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: 1.5,
                borderColor: 'background.paper',
                boxShadow: `0 2px 6px ${alpha(theme.palette.grey[900], 0.1)}`
              }}
            >
              {userProfile.full_name?.split(' ').map(n => n[0]).join('') || 'CP'}
            </Avatar>
            <Box flex={1} sx={{ minWidth: 0 }}>
              <Typography 
                variant="body2" 
                fontWeight="600" 
                sx={{ 
                  fontSize: '0.75rem',
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {userProfile.full_name}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  fontSize: '0.625rem',
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block'
                }}
              >
                {userProfile.email}
              </Typography>
            </Box>
          </Box>
        ) : null}
        
        <ListItemButton
          sx={{
            borderRadius: 2.5,
            px: 1.5,
            py: 1,
            bgcolor: alpha(theme.palette.background.paper, 0.5),
            border: 1,
            borderColor: alpha(theme.palette.grey[300], 0.25),
            '&:hover': {
              bgcolor: alpha(theme.palette.warning.main, 0.06),
              borderColor: alpha(theme.palette.warning.main, 0.15),
              '& .MuiListItemIcon-root': {
                color: 'warning.main'
              }
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
              fontSize: '0.75rem',
              fontWeight: 500
            }}
          />
        </ListItemButton>
      </Box>
    </Paper>
  );
};

export default Sidebar;