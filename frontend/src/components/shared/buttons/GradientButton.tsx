import React from 'react';
import {
  Button,
  ButtonProps,
  CircularProgress,
  useTheme
} from '@mui/material';

export interface GradientButtonProps extends Omit<ButtonProps, 'variant'> {
  loading?: boolean;
  colorScheme?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

/**
 * GradientButton - Button with gradient background
 * Used for prominent call-to-action buttons
 */
export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  loading = false,
  colorScheme = 'primary',
  disabled,
  sx,
  startIcon,
  ...props
}) => {
  const theme = useTheme();

  const getGradientColors = () => {
    switch (colorScheme) {
      case 'secondary':
        return [theme.palette.secondary.main, theme.palette.secondary.dark];
      case 'success':
        return [theme.palette.success.main, theme.palette.success.dark];
      case 'warning':
        return [theme.palette.warning.main, theme.palette.warning.dark];
      case 'error':
        return [theme.palette.error.main, theme.palette.error.dark];
      default:
        return [theme.palette.primary.main, theme.palette.primary.dark];
    }
  };

  const [lightColor, darkColor] = getGradientColors();

  return (
    <Button
      variant="contained"
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={18} color="inherit" /> : startIcon}
      sx={{
        textTransform: 'none',
        fontWeight: 700,
        borderRadius: 2,
        px: 4,
        py: 1.5,
        background: `linear-gradient(135deg, ${lightColor}, ${darkColor})`,
        '&:hover': {
          background: `linear-gradient(135deg, ${darkColor}, ${lightColor})`,
          transform: 'translateY(-1px)',
          boxShadow: theme.shadows[4],
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        ...sx,
      }}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </Button>
  );
};