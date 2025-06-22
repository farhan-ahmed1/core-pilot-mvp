import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  useTheme,
  alpha
} from '@mui/material';

export interface MetricDisplayProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  suffix?: string;
  variant?: 'default' | 'compact' | 'card';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
}

/**
 * MetricDisplay - Standardized metric/statistic display component
 * Common pattern for dashboard stats, course metrics, etc.
 */
export const MetricDisplay: React.FC<MetricDisplayProps> = ({
  value,
  label,
  icon,
  suffix,
  variant = 'default',
  color = 'neutral',
  trend
}) => {
  const theme = useTheme();

  const getColor = () => {
    switch (color) {
      case 'primary': return theme.palette.primary.main;
      case 'secondary': return theme.palette.secondary.main;
      case 'success': return theme.palette.success.main;
      case 'warning': return theme.palette.warning.main;
      case 'error': return theme.palette.error.main;
      default: return theme.palette.grey[600];
    }
  };

  const iconColor = getColor();

  if (variant === 'compact') {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        {icon && (
          <Box sx={{ color: iconColor, display: 'flex' }}>
            {icon}
          </Box>
        )}
        <Box>
          <Typography variant="h6" fontWeight="600" color="text.primary">
            {value}{suffix}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (variant === 'card') {
    return (
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          border: 1,
          borderColor: 'grey.200',
          bgcolor: 'background.paper',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: iconColor,
            boxShadow: `0 0 0 1px ${alpha(iconColor, 0.1)}`,
          }
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="caption" fontWeight="500" color="text.secondary" gutterBottom>
              {label}
            </Typography>
            <Typography variant="h4" fontWeight="600" color="text.primary">
              {value}{suffix}
            </Typography>
            {trend && (
              <Typography 
                variant="caption" 
                color={trend.direction === 'up' ? 'success.main' : trend.direction === 'down' ? 'error.main' : 'text.secondary'}
                fontWeight={500}
              >
                {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'} {Math.abs(trend.value)}%
              </Typography>
            )}
          </Box>
          {icon && (
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: alpha(iconColor, 0.1),
                color: iconColor,
              }}
            >
              {icon}
            </Avatar>
          )}
        </Box>
      </Box>
    );
  }

  // Default variant
  return (
    <Box display="flex" alignItems="center" gap={2}>
      {icon && (
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: alpha(iconColor, 0.1),
            color: iconColor,
          }}
        >
          {icon}
        </Avatar>
      )}
      <Box>
        <Typography variant="h5" fontWeight="600" color="text.primary">
          {value}{suffix}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        {trend && (
          <Typography 
            variant="caption" 
            color={trend.direction === 'up' ? 'success.main' : trend.direction === 'down' ? 'error.main' : 'text.secondary'}
            fontWeight={500}
          >
            {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'} {Math.abs(trend.value)}%
          </Typography>
        )}
      </Box>
    </Box>
  );
};