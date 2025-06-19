import { designTokens } from '../theme';

/**
 * Utility functions for converting v0.dev components to Material UI
 */

// Convert v0.dev Tailwind classes to Material UI sx props
export const tailwindToMui = {
  // Spacing
  'p-2': { p: 1 },
  'p-4': { p: 2 },
  'p-6': { p: 3 },
  'p-8': { p: 4 },
  'm-2': { m: 1 },
  'm-4': { m: 2 },
  'm-6': { m: 3 },
  'm-8': { m: 4 },
  'px-4': { px: 2 },
  'py-2': { py: 1 },
  'py-4': { py: 2 },
  'mb-4': { mb: 2 },
  'mt-4': { mt: 2 },
  
  // Colors
  'bg-white': { bgcolor: 'background.paper' },
  'bg-gray-50': { bgcolor: 'grey.50' },
  'bg-gray-100': { bgcolor: 'grey.100' },
  'bg-blue-500': { bgcolor: 'primary.main' },
  'text-gray-600': { color: 'text.secondary' },
  'text-gray-900': { color: 'text.primary' },
  
  // Border radius
  'rounded': { borderRadius: 1 },
  'rounded-lg': { borderRadius: 2 },
  'rounded-xl': { borderRadius: 3 },
  
  // Shadows
  'shadow': { boxShadow: 1 },
  'shadow-md': { boxShadow: 2 },
  'shadow-lg': { boxShadow: 4 },
  
  // Flexbox
  'flex': { display: 'flex' },
  'flex-col': { flexDirection: 'column' },
  'items-center': { alignItems: 'center' },
  'justify-between': { justifyContent: 'space-between' },
  'justify-center': { justifyContent: 'center' },
  
  // Grid
  'grid': { display: 'grid' },
  'grid-cols-2': { gridTemplateColumns: 'repeat(2, 1fr)' },
  'grid-cols-3': { gridTemplateColumns: 'repeat(3, 1fr)' },
  'gap-4': { gap: 2 },
  
  // Width/Height
  'w-full': { width: '100%' },
  'h-full': { height: '100%' },
  'min-h-screen': { minHeight: '100vh' },
};

// Convert v0.dev component props to Material UI props
export const convertV0Props = (v0Props: any) => {
  const muiProps: any = {};
  
  // Convert className to sx
  if (v0Props.className) {
    const classes = v0Props.className.split(' ');
    let sx = {};
    
    classes.forEach((cls: string) => {
      if (tailwindToMui[cls as keyof typeof tailwindToMui]) {
        sx = { ...sx, ...tailwindToMui[cls as keyof typeof tailwindToMui] };
      }
    });
    
    muiProps.sx = sx;
  }
  
  // Convert other common props
  if (v0Props.onClick) muiProps.onClick = v0Props.onClick;
  if (v0Props.disabled) muiProps.disabled = v0Props.disabled;
  if (v0Props.variant) muiProps.variant = v0Props.variant;
  
  return muiProps;
};

// Generate Material UI component from v0.dev structure
export const createMuiComponent = (componentType: string, props: any, children?: React.ReactNode) => {
  const muiProps = convertV0Props(props);
  
  // Map v0.dev component types to Material UI components
  const componentMap = {
    'button': 'Button',
    'input': 'TextField',
    'card': 'Card',
    'div': 'Box',
    'text': 'Typography',
    'icon': 'Icon',
  };
  
  return {
    component: componentMap[componentType as keyof typeof componentMap] || 'Box',
    props: muiProps,
    children,
  };
};

// Color palette converter for v0.dev
export const v0ColorPalette = {
  primary: designTokens.colors.primary,
  secondary: designTokens.colors.secondary,
  success: designTokens.colors.success,
  warning: designTokens.colors.warning,
  error: designTokens.colors.error,
  gray: {
    50: designTokens.colors.grey50,
    100: designTokens.colors.grey100,
    200: designTokens.colors.grey200,
    300: designTokens.colors.grey300,
    400: designTokens.colors.grey400,
    500: designTokens.colors.grey500,
    600: designTokens.colors.grey600,
    700: designTokens.colors.grey700,
    800: designTokens.colors.grey800,
    900: designTokens.colors.grey900,
  },
};

// Common component patterns for v0.dev adaptation
export const muiPatterns = {
  // Card pattern
  cardContainer: {
    sx: {
      borderRadius: 3,
      boxShadow: 2,
      overflow: 'hidden',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        boxShadow: 4,
        transform: 'translateY(-2px)',
      },
    },
  },
  
  // Button patterns
  primaryButton: {
    variant: 'contained' as const,
    sx: {
      borderRadius: 2,
      textTransform: 'none',
      fontWeight: 600,
      px: 3,
      py: 1.5,
    },
  },
  
  secondaryButton: {
    variant: 'outlined' as const,
    sx: {
      borderRadius: 2,
      textTransform: 'none',
      fontWeight: 500,
      px: 3,
      py: 1.5,
    },
  },
  
  // Layout patterns
  pageContainer: {
    sx: {
      flexGrow: 1,
      minHeight: '100vh',
      bgcolor: 'grey.50',
    },
  },
  
  contentContainer: {
    maxWidth: 'lg' as const,
    sx: { mt: 4, mb: 4 },
  },
  
  // Form patterns
  formField: {
    fullWidth: true,
    margin: 'normal' as const,
    variant: 'outlined' as const,
    sx: { mb: 2 },
  },
};

export default {
  tailwindToMui,
  convertV0Props,
  createMuiComponent,
  v0ColorPalette,
  muiPatterns,
};