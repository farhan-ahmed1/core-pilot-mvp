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
  Divider
} from '@mui/material';
import { 
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Core Pilot' }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Logo/Title - visible on all screens */}
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to="/dashboard"
          sx={{
            mr: 2,
            display: 'flex',
            fontWeight: 700,
            color: 'inherit',
            textDecoration: 'none',
            flexGrow: { xs: 1, md: 0 }
          }}
        >
          {title}
        </Typography>

        {/* Desktop Navigation - hidden on small screens */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          <Button
            onClick={() => handleNavigate('/dashboard')}
            sx={{ my: 2, color: 'white', display: 'flex', alignItems: 'center' }}
            startIcon={<DashboardIcon />}
          >
            Dashboard
          </Button>
          <Button
            onClick={() => handleNavigate('/assignments')}
            sx={{ my: 2, color: 'white', display: 'flex', alignItems: 'center' }}
            startIcon={<AssignmentIcon />}
          >
            Assignments
          </Button>
        </Box>

        {/* Profile section - visible on all screens */}
        <Box sx={{ display: 'flex' }}>
          {/* Mobile menu icon - only visible on small screens */}
          <IconButton
            size="large"
            aria-label="show more"
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Profile icon - visible on all screens */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
        </Box>

        {/* Desktop Profile menu */}
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => handleNavigate('/profile')}>
            <PersonIcon sx={{ mr: 1 }} /> Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleNavigate('/login')}>
            <LogoutIcon sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>

        {/* Mobile Navigation Menu */}
        <Menu
          anchorEl={mobileMenuAnchorEl}
          id="mobile-menu"
          keepMounted
          open={Boolean(mobileMenuAnchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => handleNavigate('/dashboard')}>
            <DashboardIcon sx={{ mr: 1 }} /> Dashboard
          </MenuItem>
          <MenuItem onClick={() => handleNavigate('/assignments')}>
            <AssignmentIcon sx={{ mr: 1 }} /> Assignments
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleNavigate('/profile')}>
            <PersonIcon sx={{ mr: 1 }} /> Profile
          </MenuItem>
          <MenuItem onClick={() => handleNavigate('/login')}>
            <LogoutIcon sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;