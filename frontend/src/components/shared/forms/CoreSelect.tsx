import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  SelectProps,
  MenuItem,
  Box,
  Typography
} from '@mui/material';

export interface CoreSelectOption {
  value: string | number;
  label: string;
  subtitle?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface CoreSelectProps extends Omit<SelectProps, 'children'> {
  options: CoreSelectOption[];
  placeholder?: string;
  loading?: boolean;
  emptyMessage?: string;
}

/**
 * CoreSelect - Standardized select component with consistent styling
 * Supports rich options with icons and subtitles
 */
export const CoreSelect: React.FC<CoreSelectProps> = ({
  label,
  options,
  placeholder = 'Select an option...',
  loading = false,
  emptyMessage = 'No options available',
  sx,
  ...props
}) => {
  return (
    <FormControl fullWidth>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        label={label}
        sx={{
          borderRadius: 3,
          bgcolor: 'grey.50',
          '&:hover': {
            bgcolor: 'grey.100'
          },
          '&.Mui-focused': {
            bgcolor: 'white'
          },
          ...sx,
        }}
        {...props}
      >
        <MenuItem value="" disabled>
          {loading ? 'Loading...' : placeholder}
        </MenuItem>
        {options.length === 0 && !loading ? (
          <MenuItem value="" disabled>
            {emptyMessage}
          </MenuItem>
        ) : (
          options.map((option) => (
            <MenuItem 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              <Box display="flex" alignItems="center" gap={1} width="100%">
                {option.icon && option.icon}
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {option.label}
                  </Typography>
                  {option.subtitle && (
                    <Typography variant="caption" color="text.secondary">
                      {option.subtitle}
                    </Typography>
                  )}
                </Box>
              </Box>
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
};