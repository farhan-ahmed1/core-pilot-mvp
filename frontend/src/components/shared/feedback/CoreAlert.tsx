import React from 'react';
import {
  Alert,
  AlertProps,
  Snackbar,
  SnackbarProps,
  IconButton} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

export interface CoreAlertProps extends Omit<AlertProps, 'severity'> {
  severity: 'success' | 'warning' | 'error' | 'info';
  dismissible?: boolean;
  onDismiss?: () => void;
}

export interface CoreSnackbarProps extends Omit<SnackbarProps, 'children'> {
  message: string;
  severity: 'success' | 'warning' | 'error' | 'info';
  onClose: () => void;
}

/**
 * CoreAlert - Standardized alert component with consistent styling
 */
export const CoreAlert: React.FC<CoreAlertProps> = ({
  children,
  dismissible = false,
  onDismiss,
  sx,
  ...props
}) => {
  return (
    <Alert
      action={
        dismissible && onDismiss ? (
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onDismiss}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        ) : undefined
      }
      sx={{
        borderRadius: 3,
        '& .MuiAlert-message': {
          fontWeight: 500
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Alert>
  );
};

/**
 * CoreSnackbar - Standardized snackbar for notifications
 * Common pattern used throughout the app for user feedback
 */
export const CoreSnackbar: React.FC<CoreSnackbarProps> = ({
  message,
  severity,
  onClose,
  open,
  autoHideDuration = 4000,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  ...props
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      {...props}
    >
      <CoreAlert
        severity={severity}
        dismissible
        onDismiss={onClose}
        sx={{ borderRadius: 3 }}
      >
        {message}
      </CoreAlert>
    </Snackbar>
  );
};