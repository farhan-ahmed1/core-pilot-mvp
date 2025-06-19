import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

/**
 * LoadingScreen - Unified loading component for consistent loading states
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading...', 
  fullScreen = true 
}) => {
  const theme = useTheme();

  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: fullScreen ? '100vh' : '50vh',
          gap: 3,
          bgcolor: fullScreen ? 'grey.50' : 'transparent'
        }}
      >
        <CircularProgress 
          size={48} 
          thickness={4}
          sx={{
            color: theme.palette.primary.main
          }}
        />
        <Typography 
          variant="body1" 
          color="text.secondary"
          fontWeight={500}
        >
          {message}
        </Typography>
      </Box>
    </Fade>
  );
};

export default LoadingScreen;