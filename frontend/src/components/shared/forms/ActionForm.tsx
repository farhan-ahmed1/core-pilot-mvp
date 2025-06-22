import React from 'react';
import {
  Stack} from '@mui/material';
import { ActionCard, ActionCardProps } from '../cards/ActionCard';

export interface ActionFormProps extends Omit<ActionCardProps, 'children'> {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
}

/**
 * ActionForm - Standardized form wrapper with consistent styling and actions
 * Common pattern for forms throughout the app
 */
export const ActionForm: React.FC<ActionFormProps> = ({
  children,
  onSubmit,
  loading = false,
  primaryAction,
  secondaryAction,
  ...cardProps
}) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <ActionCard
      primaryAction={primaryAction ? {
        ...primaryAction,
        loading: loading || primaryAction.loading
      } : undefined}
      secondaryAction={secondaryAction}
      {...cardProps}
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {children}
        </Stack>
      </form>
    </ActionCard>
  );
};