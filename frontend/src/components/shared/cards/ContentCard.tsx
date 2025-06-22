import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  alpha,
  useTheme
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { CoreCard, CoreCardProps } from './CoreCard';

export interface ContentCardProps extends Omit<CoreCardProps, 'children'> {
  title: string;
  subtitle?: string;
  overline?: string;
  headerAction?: React.ReactNode;
  onMenuClick?: (event: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
}

/**
 * ContentCard - Card with standardized header pattern
 * Common pattern used for course cards, assignment cards, etc.
 */
export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  subtitle,
  overline,
  headerAction,
  onMenuClick,
  children,
  ...cardProps
}) => {
  const theme = useTheme();

  return (
    <CoreCard {...cardProps}>
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box flex={1}>
          {overline && (
            <Typography 
              variant="overline" 
              color="text.secondary" 
              fontWeight={600} 
              letterSpacing={1}
              gutterBottom
            >
              {overline}
            </Typography>
          )}
          <Typography variant="h6" fontWeight="600" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {(headerAction || onMenuClick) && (
          <Box display="flex" alignItems="center" gap={1}>
            {headerAction}
            {onMenuClick && (
              <IconButton
                size="small"
                onClick={onMenuClick}
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.grey[500], 0.1)
                  }
                }}
              >
                <MoreVertIcon />
              </IconButton>
            )}
          </Box>
        )}
      </Box>

      {/* Content */}
      {children}
    </CoreCard>
  );
};