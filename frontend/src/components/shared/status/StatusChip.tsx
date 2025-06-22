import React from 'react';
import {
  Chip,
  ChipProps,
  useTheme,
  alpha
} from '@mui/material';

// Define custom variant type that includes our "soft" option
type CustomChipVariant = 'filled' | 'outlined' | 'soft';

export interface StatusChipProps extends Omit<ChipProps, 'color' | 'variant'> {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  variant?: CustomChipVariant;
}

/**
 * StatusChip - Standardized status indicator chip
 * Common pattern for assignment status, course status, etc.
 */
export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  variant = 'soft',
  sx,
  ...props
}) => {
  const theme = useTheme();

  const getStatusColors = () => {
    switch (status) {
      case 'success':
        return {
          main: theme.palette.success.main,
          light: theme.palette.success.light,
          dark: theme.palette.success.dark,
        };
      case 'warning':
        return {
          main: theme.palette.warning.main,
          light: theme.palette.warning.light,
          dark: theme.palette.warning.dark,
        };
      case 'error':
        return {
          main: theme.palette.error.main,
          light: theme.palette.error.light,
          dark: theme.palette.error.dark,
        };
      case 'info':
        return {
          main: theme.palette.primary.main,
          light: theme.palette.primary.light,
          dark: theme.palette.primary.dark,
        };
      default: // neutral
        return {
          main: theme.palette.grey[600],
          light: theme.palette.grey[400],
          dark: theme.palette.grey[800],
        };
    }
  };

  const colors = getStatusColors();

  const getChipStyles = () => {
    switch (variant) {
      case 'filled':
        return {
          bgcolor: colors.main,
          color: 'white',
          '&:hover': {
            bgcolor: colors.dark,
          },
        };
      case 'outlined':
        return {
          border: 1,
          borderColor: colors.main,
          color: colors.main,
          bgcolor: 'transparent',
          '&:hover': {
            bgcolor: alpha(colors.main, 0.04),
          },
        };
      default: // soft
        return {
          bgcolor: alpha(colors.main, 0.1),
          color: colors.dark,
          border: 'none',
          '&:hover': {
            bgcolor: alpha(colors.main, 0.15),
          },
        };
    }
  };

  return (
    <Chip
      size="small"
      sx={{
        borderRadius: 1.5,
        fontWeight: 600,
        fontSize: '0.75rem',
        height: 24,
        '& .MuiChip-label': {
          px: 1,
        },
        ...getChipStyles(),
        ...sx,
      }}
      {...props}
    />
  );
};