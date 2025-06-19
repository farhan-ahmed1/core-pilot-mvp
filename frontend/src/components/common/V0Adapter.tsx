import React from 'react';
import { Box, Card, CardContent, Button, TextField, Typography } from '@mui/material';
import { convertV0Props, muiPatterns } from '../utils/v0Integration';

interface V0AdapterProps {
  children: React.ReactNode;
  componentType?: 'card' | 'button' | 'input' | 'text' | 'container';
  v0Props?: any;
  muiOverrides?: any;
}

/**
 * V0Adapter - Wrapper component to easily integrate v0.dev components with Material UI
 * 
 * Usage:
 * <V0Adapter componentType="card" v0Props={{ className: "p-4 bg-white rounded-lg" }}>
 *   Content here
 * </V0Adapter>
 */
export const V0Adapter: React.FC<V0AdapterProps> = ({
  children,
  componentType = 'container',
  v0Props = {},
  muiOverrides = {}
}) => {
  const convertedProps = convertV0Props(v0Props);
  const finalProps = { ...convertedProps, ...muiOverrides };

  const componentMap = {
    card: (props: any) => (
      <Card {...muiPatterns.cardContainer} {...props}>
        <CardContent>{children}</CardContent>
      </Card>
    ),
    button: (props: any) => (
      <Button {...muiPatterns.primaryButton} {...props}>
        {children}
      </Button>
    ),
    input: (props: any) => (
      <TextField {...muiPatterns.formField} {...props} />
    ),
    text: (props: any) => (
      <Typography {...props}>{children}</Typography>
    ),
    container: (props: any) => (
      <Box {...props}>{children}</Box>
    ),
  };

  const Component = componentMap[componentType];
  return Component ? Component(finalProps) : <Box {...finalProps}>{children}</Box>;
};

/**
 * Higher-order component to wrap v0.dev components with Material UI theming
 */
export const withMuiTheme = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    const muiProps = convertV0Props(props);
    return <WrappedComponent {...muiProps} />;
  };
};

/**
 * Hook to get Material UI equivalent styles for v0.dev components
 */
export const useV0Styles = (v0ClassName: string) => {
  const convertedProps = convertV0Props({ className: v0ClassName });
  return convertedProps.sx || {};
};

export default V0Adapter;