import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Stack,
  Avatar
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  ErrorOutline as ErrorIcon,
  Explore as ExploreIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { alpha, useTheme } from '@mui/material/styles';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: alpha(theme.palette.secondary.main, 0.1),
          animation: 'float 8s ease-in-out infinite reverse'
        }}
      />

      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 4,
            bgcolor: alpha('#fff', 0.9),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha('#fff', 0.2)}`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
          }}
        >
          {/* Error Icon */}
          <Avatar
            sx={{
              width: 120,
              height: 120,
              mx: 'auto',
              mb: 4,
              bgcolor: alpha(theme.palette.error.main, 0.1),
              border: `3px solid ${alpha(theme.palette.error.main, 0.2)}`
            }}
          >
            <ErrorIcon sx={{ fontSize: 60, color: 'error.main' }} />
          </Avatar>

          {/* 404 Text */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '4rem', md: '6rem' },
              fontWeight: 900,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              letterSpacing: '-0.02em'
            }}
          >
            404
          </Typography>

          {/* Main Message */}
          <Typography
            variant="h4"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
            sx={{ mb: 2 }}
          >
            Oops! Page Not Found
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 500, mx: 'auto', lineHeight: 1.6 }}
          >
            The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, even the best explorers sometimes take a wrong turn!
          </Typography>

          {/* Suggestions */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Here's what you can try:
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              sx={{ mt: 2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SearchIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  Check the URL spelling
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ExploreIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  Navigate from the dashboard
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Action Buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Go to Dashboard
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Go Back
            </Button>
          </Stack>

          {/* Fun Fact */}
          <Box
            sx={{
              mt: 6,
              p: 3,
              bgcolor: alpha(theme.palette.info.main, 0.05),
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
            }}
          >
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              💡 Fun Fact: The first 404 error was encountered in 1993 at CERN. 
              You're part of a long tradition of digital exploration!
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
    </Box>
  );
};

export default NotFoundPage;