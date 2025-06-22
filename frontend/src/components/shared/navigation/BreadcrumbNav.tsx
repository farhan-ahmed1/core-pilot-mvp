import React from 'react';
import {
  Breadcrumbs,
  Link,
  Box
} from '@mui/material';
import {
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  showHomeIcon?: boolean;
  maxItems?: number;
}

/**
 * BreadcrumbNav - Standardized breadcrumb navigation component
 * Common pattern for showing navigation hierarchy
 */
export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  items,
  showHomeIcon = false,
  maxItems = 8
}) => {
  const navigate = useNavigate();

  const handleItemClick = (item: BreadcrumbItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Breadcrumbs
        maxItems={maxItems}
        separator={<ChevronRightIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            color: 'text.secondary',
            mx: 1
          }
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <Link
              key={index}
              component="button"
              variant="body2"
              onClick={() => handleItemClick(item)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: isLast ? 'text.primary' : 'text.secondary',
                textDecoration: 'none',
                fontWeight: isLast ? 600 : 400,
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline'
                }
              }}
            >
              {index === 0 && showHomeIcon && (
                <HomeIcon sx={{ fontSize: 16 }} />
              )}
              {item.icon && item.icon}
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};