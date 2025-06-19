import React from 'react';
import { Box, Container, Fade } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  containerPadding?: boolean;
  fullHeight?: boolean;
}

/**
 * MainLayout - Unified layout component for authenticated pages
 * Provides consistent header, navigation, and content structure
 */
const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = 'Core Pilot',
  maxWidth = 'xl',
  containerPadding = true,
  fullHeight = true
}) => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        flexGrow: 1, 
        minHeight: fullHeight ? '100vh' : 'auto',
        bgcolor: 'grey.50',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Global Header */}
      <Header title={title} />
      
      {/* Main Content Area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Fade in timeout={600}>
          <Box sx={{ flexGrow: 1 }}>
            {maxWidth === false ? (
              <Box sx={{ p: containerPadding ? 4 : 0 }}>
                {children}
              </Box>
            ) : (
              <Container 
                maxWidth={maxWidth} 
                sx={{ 
                  py: containerPadding ? 4 : 0,
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {children}
              </Container>
            )}
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default MainLayout;