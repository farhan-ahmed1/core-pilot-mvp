import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';

// Import contexts
import { AuthProvider } from './contexts/AuthContext';

// Import components
import ProtectedRoute from './components/layout/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

// Import page components
import DashboardPage from "./pages/dashboard/DashboardPage";
import CoursesPage from "./pages/dashboard/CoursesPage";
import CourseAssignmentsPage from "./pages/courses/CourseAssignmentsPage";
import LoginPage from "./pages/auth/LoginPage";
import AssignmentPage from "./pages/assignments/AssignmentPage";
import AssignmentsListPage from "./pages/assignments/AssignmentsListPage";
import NotFoundPage from "./pages/errors/NotFoundPage";
import ProfilePage from "./pages/profile/ProfilePage";

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
            <Route path="/courses" element={
              <ProtectedRoute>
                <MainLayout title="Core Pilot" maxWidth="xl">
                  <CoursesPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/courses/:courseId/assignments" element={
              <ProtectedRoute>
                <MainLayout title="Core Pilot" maxWidth="xl">
                  <CourseAssignmentsPage />
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