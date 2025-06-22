import React from 'react';
import {
  Box,
  Typography,
  Button,
  alpha,
  useTheme
} from '@mui/material';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  illustration?: React.ReactNode;
}

/**
 * EmptyState - Standardized empty state component
 * Common pattern for when no data is available
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  illustration
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 6,
        px: 3,
        borderRadius: 3,
        border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
        bgcolor: alpha(theme.palette.primary.main, 0.02)
      }}
    >
      {/* Icon or Illustration */}
      {illustration || (icon && (
        <Box sx={{ mb: 2 }}>
          <Box
            component="div"
            sx={{ 
              fontSize: 80, 
              color: alpha(theme.palette.primary.main, 0.3),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {icon}
          </Box>
        </Box>
      ))}

      {/* Title */}
      <Typography variant="h6" fontWeight="600" gutterBottom>
        {title}
      </Typography>

      {/* Description */}
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
          {description}
        </Typography>
      )}

      {/* Action Button */}
      {action && (
        <Button
          variant="contained"
          startIcon={action.icon}
          onClick={action.onClick}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
          }}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
};