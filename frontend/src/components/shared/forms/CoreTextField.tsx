import React from 'react';
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  IconButton,
  Typography
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export interface CoreTextFieldProps extends Omit<TextFieldProps, 'variant'> {
  icon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  showPasswordToggle?: boolean;
  helperIcon?: React.ReactNode;
}

/**
 * CoreTextField - Standardized text field with consistent styling
 * Includes common patterns like icons, clear buttons, password toggle
 */
export const CoreTextField: React.FC<CoreTextFieldProps> = ({
  icon,
  clearable = false,
  onClear,
  showPasswordToggle = false,
  helperIcon,
  type: propType,
  sx,
  InputProps,
  FormHelperTextProps,
  helperText,
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [type, setType] = React.useState(propType);

  React.useEffect(() => {
    if (showPasswordToggle && propType === 'password') {
      setType(showPassword ? 'text' : 'password');
    } else {
      setType(propType);
    }
  }, [showPassword, propType, showPasswordToggle]);

  const getStartAdornment = () => {
    if (icon) {
      return (
        <InputAdornment position="start">
          {icon}
        </InputAdornment>
      );
    }
    return InputProps?.startAdornment;
  };

  const getEndAdornment = () => {
    const adornments = [];
    
    if (clearable && onClear) {
      adornments.push(
        <IconButton
          key="clear"
          size="small"
          onClick={onClear}
          edge="end"
        >
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>×</Typography>
        </IconButton>
      );
    }
    
    if (showPasswordToggle && propType === 'password') {
      adornments.push(
        <IconButton
          key="password-toggle"
          size="small"
          onClick={() => setShowPassword(!showPassword)}
          edge="end"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      );
    }
    
    if (adornments.length > 0) {
      return (
        <InputAdornment position="end">
          {adornments}
        </InputAdornment>
      );
    }
    
    return InputProps?.endAdornment;
  };

  return (
    <TextField
      variant="outlined"
      type={type}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
          bgcolor: 'grey.50',
          '&:hover': {
            bgcolor: 'grey.100'
          },
          '&.Mui-focused': {
            bgcolor: 'white'
          }
        },
        ...sx,
      }}
      InputProps={{
        ...InputProps,
        startAdornment: getStartAdornment(),
        endAdornment: getEndAdornment(),
      }}
      FormHelperTextProps={{
        ...FormHelperTextProps,
        component: 'div',
      }}
      helperText={
        helperText && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {helperIcon}
            {helperText}
          </div>
        )
      }
      {...props}
    />
  );
};