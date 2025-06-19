import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import page components
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import AssignmentPage from "./pages/AssignmentPage";
import AssignmentsListPage from "./pages/AssignmentsListPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/assignments" element={<AssignmentsListPage />} />
        <Route path="/assignments/:assignmentId" element={<AssignmentPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;