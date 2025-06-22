import React from 'react';
import {
  Button,
  ButtonProps,
} from '@mui/material';

export interface SecondaryButtonProps extends Omit<ButtonProps, 'variant'> {
  // No additional props needed for secondary button
}

/**
 * SecondaryButton - Standardized secondary action button
 * Consistent styling for secondary actions throughout the app
 */
export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  sx,
  ...props
}) => {
  return (
    <Button
      variant="outlined"
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 2,
        px: 3,
        py: 1.5,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};