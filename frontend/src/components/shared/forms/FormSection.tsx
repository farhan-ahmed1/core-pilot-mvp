import React from 'react';
import {
  Box,
  Typography,
  Divider
} from '@mui/material';

export interface FormSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  divider?: boolean;
}

/**
 * FormSection - Standardized form section with consistent spacing and typography
 * Common pattern for organizing form fields into logical groups
 */
export const FormSection: React.FC<FormSectionProps> = ({
  title,
  subtitle,
  children,
  divider = false
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      {/* Section Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Section Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {children}
      </Box>

      {/* Optional Divider */}
      {divider && (
        <Divider sx={{ mt: 4 }} />
      )}
    </Box>
  );
};