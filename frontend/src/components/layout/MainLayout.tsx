import React, { useState } from 'react';
import { Box, Container, Fade, useMediaQuery, useTheme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  containerPadding?: boolean;
  fullHeight?: boolean;
  showSidebar?: boolean;
}

/**
 * MainLayout - Unified layout component for authenticated pages
 * Provides consistent header, sidebar navigation, and content structure
 */
const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = 'Core Pilot',
  maxWidth = 'xl',
  containerPadding = true,
  fullHeight = true,
  showSidebar = true
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const sidebarWidth = 280;

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

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
      <Header 
        title={title} 
        onMenuToggle={showSidebar ? handleSidebarToggle : undefined}
        showMenuButton={showSidebar && isMobile}
      />
      
      {/* Main Content Layout */}
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Sidebar */}
        {showSidebar && (
          <>
            {/* Desktop Sidebar */}
            {!isMobile && (
              <Sidebar 
                open={sidebarOpen}
                width={sidebarWidth}
                onClose={handleSidebarClose}
              />
            )}
            
            {/* Mobile Sidebar Overlay */}
            {isMobile && (
              <>
                {/* Backdrop */}
                {sidebarOpen && (
                  <Box
                    sx={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      zIndex: theme.zIndex.drawer - 1,
                    }}
                    onClick={handleSidebarClose}
                  />
                )}
                <Sidebar 
                  open={sidebarOpen}
                  width={sidebarWidth}
                  onClose={handleSidebarClose}
                />
              </>
            )}
          </>
        )}

        {/* Main Content Area */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            marginLeft: showSidebar && !isMobile && sidebarOpen ? `${sidebarWidth}px` : 0,
            transition: 'margin-left 0.3s ease',
            minWidth: 0 // Prevents content from overflowing
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
    </Box>
  );
};

export default MainLayout;