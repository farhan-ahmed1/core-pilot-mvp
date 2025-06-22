import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Fade
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

export interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  variant?: 'spinner' | 'dots' | 'skeleton';
}

/**
 * LoadingState - Unified loading component for consistent loading states
 * Replaces the existing LoadingScreen with more flexible options
 */
export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  size = 'medium',
  fullScreen = false}) => {
  const theme = useTheme();

  const getSizeValue = () => {
    switch (size) {
      case 'small': return 32;
      case 'large': return 64;
      default: return 48;
    }
  };

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
          bgcolor: fullScreen ? 'grey.50' : 'transparent',
          p: fullScreen ? 4 : 2
        }}
      >
        <CircularProgress 
          size={getSizeValue()} 
          thickness={4}
          sx={{
            color: theme.palette.primary.main
          }}
        />
        <Typography 
          variant="body1" 
          color="text.secondary"
          fontWeight={500}
          textAlign="center"
        >
          {message}
        </Typography>
      </Box>
    </Fade>
  );
};