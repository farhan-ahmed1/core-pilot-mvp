import React from 'react';
import {
  Button,
  ButtonProps,
  CircularProgress,
  useTheme
} from '@mui/material';

export interface PrimaryButtonProps extends Omit<ButtonProps, 'variant'> {
  loading?: boolean;
  gradient?: boolean;
}

/**
 * PrimaryButton - Standardized primary action button
 * Consistent styling for main actions throughout the app
 */
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  loading = false,
  gradient = false,
  disabled,
  sx,
  startIcon,
  ...props
}) => {
  const theme = useTheme();

  const getButtonStyles = () => {
    if (gradient) {
      return {
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        '&:hover': {
          background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
        },
      };
    }
    return {};
  };

  return (
    <Button
      variant="contained"
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={18} color="inherit" /> : startIcon}
      sx={{
        textTransform: 'none',
        fontWeight: 700,
        borderRadius: 2,
        px: 3,
        py: 1.5,
        ...getButtonStyles(),
        ...sx,
      }}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </Button>
  );
};