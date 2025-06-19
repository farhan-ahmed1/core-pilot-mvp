import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';

// Import contexts
import { AuthProvider } from './contexts/AuthContext';

// Import components
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

// Import page components
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import AssignmentPage from "./pages/AssignmentPage";
import AssignmentsListPage from "./pages/AssignmentsListPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Protected routes with unified layout */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <MainLayout title="Core Pilot" maxWidth="xl">
                  <DashboardPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/assignments" element={
              <ProtectedRoute>
                <MainLayout title="Core Pilot" maxWidth="xl">
                  <AssignmentsListPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/assignments/:assignmentId" element={
              <ProtectedRoute>
                <MainLayout title="Core Pilot" maxWidth="lg">
                  <AssignmentPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <MainLayout title="Core Pilot" maxWidth="lg">
                  <ProfilePage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* 404 page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;