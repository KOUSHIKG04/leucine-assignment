import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateSoftwarePage from "./pages/CreateSoftwarePage";
import LoginPage from "./pages/LoginPage";
import RequestAccessPage from "./pages/RequestAccessPage";
import PendingRequestsPage from "./pages/PendingRequestsPage";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Dashboard route - accessible by all authenticated users */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['Employee', 'Manager', 'Admin']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin only routes */}
      <Route
        path="/create-software"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <CreateSoftwarePage />
          </ProtectedRoute>
        }
      />

      {/* Employee only routes */}
      <Route
        path="/request-access"
        element={
          <ProtectedRoute allowedRoles={["Employee"]}>
            <RequestAccessPage />
          </ProtectedRoute>
        }
      />

      {/* Manager only routes */}
      <Route
        path="/pending-requests"
        element={
          <ProtectedRoute allowedRoles={["Manager"]}>
            <PendingRequestsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
