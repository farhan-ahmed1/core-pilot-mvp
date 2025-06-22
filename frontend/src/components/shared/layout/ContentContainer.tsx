import React from 'react';
import {
  Container,
  ContainerProps,
  Box,
  Fade
} from '@mui/material';

export interface ContentContainerProps extends ContainerProps {
  children: React.ReactNode;
  padding?: boolean;
  fadeIn?: boolean;
  fullHeight?: boolean;
}

/**
 * ContentContainer - Standardized content wrapper with consistent spacing
 * Common pattern for page content containers
 */
export const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  padding = true,
  fadeIn = true,
  fullHeight = false,
  maxWidth = 'xl',
  sx,
  ...props
}) => {
  const content = (
    <Container
      maxWidth={maxWidth}
      sx={{
        py: padding ? 4 : 0,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        ...(fullHeight && { minHeight: '100vh' }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Container>
  );

  if (fadeIn) {
    return (
      <Fade in timeout={600}>
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {content}
        </Box>
      </Fade>
    );
  }

  return content;
};