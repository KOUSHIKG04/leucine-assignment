import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateSoftwarePage from "./pages/CreateSoftwarePage";
import LoginPage from "./pages/LoginPage";
import RequestAccessPage from "./pages/RequestAccessPage";
import PendingRequestsPage from "./pages/PendingRequestsPage";
import AllRequestsPage from "./pages/AllRequestsPage";
import ManageUsersPage from "./pages/ManageUsersPage";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Employee", "Manager", "Admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-software"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <CreateSoftwarePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/request-access"
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <RequestAccessPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pending-requests"
          element={
            <ProtectedRoute allowedRoles={["Manager"]}>
              <PendingRequestsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/all-requests"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AllRequestsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-users"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <ManageUsersPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
