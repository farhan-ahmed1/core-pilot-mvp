import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  IconButton,
  alpha,
  useTheme
} from '@mui/material';
import {
  ChevronRight as ChevronRightIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  overline?: string;
  breadcrumbs?: Array<{
    label: string;
    path?: string;
    onClick?: () => void;
  }>;
  showBackButton?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
}

/**
 * PageHeader - Standardized page header with breadcrumbs and actions
 * Common pattern used across all main pages
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  overline,
  breadcrumbs,
  showBackButton = false,
  onBack,
  actions
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleBreadcrumbClick = (item: any) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Breadcrumbs
            separator={<ChevronRightIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{
              '& .MuiBreadcrumbs-separator': {
                color: 'text.secondary',
                mx: 1
              }
            }}
          >
            {breadcrumbs.map((item, index) => (
              <Link
                key={index}
                component="button"
                variant="body2"
                onClick={() => handleBreadcrumbClick(item)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: index === breadcrumbs.length - 1 ? 'text.primary' : 'text.secondary',
                  textDecoration: 'none',
                  fontWeight: index === breadcrumbs.length - 1 ? 600 : 400,
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline'
                  }
                }}
              >
                {item.label}
              </Link>
            ))}
          </Breadcrumbs>
        </Box>
      )}

      {/* Header Content */}
      <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={3}>
        <Box display="flex" alignItems="flex-start" gap={2} flex={1}>
          {showBackButton && (
            <IconButton
              onClick={handleBackClick}
              sx={{
                mt: 0.5,
                bgcolor: alpha(theme.palette.grey[500], 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.grey[500], 0.2),
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          
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
            <Typography 
              variant="h4" 
              fontWeight="700" 
              color="text.primary" 
              sx={{ lineHeight: 1.2, mb: subtitle ? 1 : 0 }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="h6" color="text.secondary" fontWeight={400}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Actions */}
        {actions && (
          <Box display="flex" alignItems="center" gap={2}>
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  );
};