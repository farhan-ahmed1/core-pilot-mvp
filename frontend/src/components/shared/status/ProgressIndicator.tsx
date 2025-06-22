import React from 'react';
import {
  Box,
  LinearProgress,
  Typography,
  useTheme,
  alpha
} from '@mui/material';

export interface ProgressIndicatorProps {
  value: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'standard' | 'compact' | 'detailed';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  height?: number;
}

/**
 * ProgressIndicator - Standardized progress bar component
 * Common pattern for course progress, assignment completion, etc.
 */
export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  value,
  label,
  showPercentage = false,
  variant = 'standard',
  color = 'primary',
  height = 6
}) => {
  const theme = useTheme();
  
  const getProgressColor = () => {
    switch (color) {
      case 'secondary': return theme.palette.secondary.main;
      case 'success': return theme.palette.success.main;
      case 'warning': return theme.palette.warning.main;
      case 'error': return theme.palette.error.main;
      default: return theme.palette.primary.main;
    }
  };

  const progressColor = getProgressColor();

  if (variant === 'compact') {
    return (
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height,
          borderRadius: height / 2,
          bgcolor: alpha(progressColor, 0.1),
          '& .MuiLinearProgress-bar': {
            bgcolor: progressColor,
            borderRadius: height / 2
          }
        }}
      />
    );
  }

  if (variant === 'detailed') {
    return (
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body2" fontWeight={500} color="text.primary">
            {label || 'Progress'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(value)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={value}
          sx={{
            height,
            borderRadius: height / 2,
            bgcolor: alpha(progressColor, 0.1),
            '& .MuiLinearProgress-bar': {
              bgcolor: progressColor,
              borderRadius: height / 2
            }
          }}
        />
      </Box>
    );
  }

  // Standard variant
  return (
    <Box>
      {(label || showPercentage) && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          {label && (
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {label}
            </Typography>
          )}
          {showPercentage && (
            <Typography variant="caption" color="text.secondary">
              {Math.round(value)}%
            </Typography>
          )}
        </Box>
      )}
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height,
          borderRadius: height / 2,
          bgcolor: alpha(progressColor, 0.1),
          '& .MuiLinearProgress-bar': {
            bgcolor: progressColor,
            borderRadius: height / 2
          }
        }}
      />
    </Box>
  );
};