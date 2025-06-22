import React from 'react';
import {
  IconButton,
  IconButtonProps,
  alpha,
  useTheme
} from '@mui/material';

export interface IconActionButtonProps extends IconButtonProps {
  variant?: 'default' | 'contained' | 'outlined';
  colorScheme?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'grey';
}

/**
 * IconActionButton - Standardized icon button with consistent styling
 * Used for menu buttons, action buttons, etc.
 */
export const IconActionButton: React.FC<IconActionButtonProps> = ({
  children,
  variant = 'default',
  colorScheme = 'grey',
  sx,
  ...props
}) => {
  const theme = useTheme();

  const getButtonStyles = () => {
    const color = colorScheme === 'grey' ? theme.palette.grey[600] : theme.palette[colorScheme].main;
    
    switch (variant) {
      case 'contained':
        return {
          bgcolor: alpha(color, 0.1),
          color: color,
          '&:hover': {
            bgcolor: alpha(color, 0.2),
          },
        };
      case 'outlined':
        return {
          border: 1,
          borderColor: alpha(color, 0.3),
          color: color,
          '&:hover': {
            borderColor: color,
            bgcolor: alpha(color, 0.04),
          },
        };
      default:
        return {
          color: color,
          '&:hover': {
            bgcolor: alpha(color, 0.1),
          },
        };
    }
  };

  return (
    <IconButton
      sx={{
        borderRadius: 2,
        ...getButtonStyles(),
        ...sx,
      }}
      {...props}
    >
      {children}
    </IconButton>
  );
};