import React from 'react';
import { Box, BoxProps } from '@mui/material';

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  sx?: BoxProps['sx'];
}

/**
 * TabPanel - Reusable tab panel component
 * Common pattern used throughout the app for tabbed interfaces
 */
export const TabPanel: React.FC<TabPanelProps> = ({ 
  children, 
  value, 
  index, 
  sx 
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && (
        <Box sx={{ py: 3, ...sx }}>
          {children}
        </Box>
      )}
    </div>
  );
};