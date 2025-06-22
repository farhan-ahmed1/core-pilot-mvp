import React from 'react';
import {
  Divider,
  DividerProps,
  Box,
  Typography,
  alpha,
  useTheme
} from '@mui/material';

// Define custom variant type for section divider
type SectionDividerVariant = 'simple' | 'labeled' | 'spaced';

export interface SectionDividerProps extends Omit<DividerProps, 'variant'> {
  label?: string;
  spacing?: number;
  variant?: SectionDividerVariant;
}

/**
 * SectionDivider - Standardized section divider with optional labeling
 * Common pattern for separating content sections
 */
export const SectionDivider: React.FC<SectionDividerProps> = ({
  label,
  spacing = 3,
  variant = 'simple',
  sx,
  ...props
}) => {
  const theme = useTheme();

  if (variant === 'labeled' && label) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          my: spacing,
          ...sx,
        }}
      >
        <Divider sx={{ flexGrow: 1 }} {...props} />
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          textTransform="uppercase"
          letterSpacing={1}
          sx={{
            px: 2,
            bgcolor: 'background.paper',
            fontSize: '0.625rem'
          }}
        >
          {label}
        </Typography>
        <Divider sx={{ flexGrow: 1 }} {...props} />
      </Box>
    );
  }

  if (variant === 'spaced') {
    return (
      <Box sx={{ my: spacing }}>
        <Divider
          sx={{
            borderColor: alpha(theme.palette.grey[300], 0.5),
            ...sx,
          }}
          {...props}
        />
      </Box>
    );
  }

  // Simple variant
  return (
    <Divider
      sx={{
        my: spacing,
        ...sx,
      }}
      {...props}
    />
  );
};