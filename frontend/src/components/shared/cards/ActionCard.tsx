import React from 'react';
import {
  CardActions,
  Button,
  Box,
  Divider
} from '@mui/material';
import { CoreCard, CoreCardProps } from './CoreCard';

export interface ActionCardProps extends Omit<CoreCardProps, 'children'> {
  children: React.ReactNode;
  actions?: React.ReactNode[];
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    loading?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

/**
 * ActionCard - Card with built-in action buttons
 * Common pattern for forms and interactive content
 */
export const ActionCard: React.FC<ActionCardProps> = ({
  children,
  actions,
  primaryAction,
  secondaryAction,
  ...cardProps
}) => {
  const hasActions = actions || primaryAction || secondaryAction;

  return (
    <CoreCard padding={0} {...cardProps}>
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
      
      {hasActions && (
        <>
          <Divider />
          <CardActions sx={{ p: 3, pt: 2, justifyContent: 'flex-end', gap: 1 }}>
            {actions ? (
              actions
            ) : (
              <>
                {secondaryAction && (
                  <Button
                    variant="outlined"
                    onClick={secondaryAction.onClick}
                    startIcon={secondaryAction.icon}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 3
                    }}
                  >
                    {secondaryAction.label}
                  </Button>
                )}
                {primaryAction && (
                  <Button
                    variant="contained"
                    onClick={primaryAction.onClick}
                    startIcon={primaryAction.icon}
                    disabled={primaryAction.loading}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: 2,
                      px: 3
                    }}
                  >
                    {primaryAction.loading ? 'Loading...' : primaryAction.label}
                  </Button>
                )}
              </>
            )}
          </CardActions>
        </>
      )}
    </CoreCard>
  );
};