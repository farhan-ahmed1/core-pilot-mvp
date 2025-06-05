import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import page components
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import AssignmentPage from "./pages/AssignmentPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/assignments/:assignmentId" element={<AssignmentPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;