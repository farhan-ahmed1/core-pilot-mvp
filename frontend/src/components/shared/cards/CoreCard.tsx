import React from 'react';
import {
  Card,
  CardContent,
  CardProps,
  alpha,
  useTheme
} from '@mui/material';

// Define custom variant type for core card
type CoreCardVariant = 'elevated' | 'outlined' | 'flat';

export interface CoreCardProps extends Omit<CardProps, 'children' | 'variant'> {
  children: React.ReactNode;
  hover?: boolean;
  bordered?: boolean;
  padding?: number;
  variant?: CoreCardVariant;
}

/**
 * CoreCard - Base card component with consistent styling
 * Used throughout the app for content containers
 */
export const CoreCard: React.FC<CoreCardProps> = ({
  children,
  hover = true,
  bordered = true,
  padding = 3,
  variant = 'flat',
  sx,
  ...props
}) => {
  const theme = useTheme();

  const getCardStyles = () => {
    const baseStyles = {
      borderRadius: 3,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          boxShadow: theme.shadows[2],
          '&:hover': hover ? {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[6],
          } : {},
        };
      case 'outlined':
        return {
          ...baseStyles,
          border: 1,
          borderColor: 'grey.200',
          boxShadow: 'none',
          '&:hover': hover ? {
            borderColor: 'primary.main',
            boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.2)}`,
          } : {},
        };
      default: // flat
        return {
          ...baseStyles,
          border: bordered ? 1 : 0,
          borderColor: 'grey.200',
          boxShadow: 'none',
          '&:hover': hover ? {
            transform: 'translateY(-1px)',
            boxShadow: theme.shadows[2],
            borderColor: 'primary.main',
          } : {},
        };
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        ...getCardStyles(),
        ...sx,
      }}
      {...props}
    >
      <CardContent sx={{ p: padding }}>
        {children}
      </CardContent>
    </Card>
  );
};