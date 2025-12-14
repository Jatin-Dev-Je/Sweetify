import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "@/components/common/Navbar.jsx";
import ProtectedRoute from "@/auth/ProtectedRoute.jsx";
import Dashboard from "@/pages/Dashboard/Dashboard.jsx";
import AdminPanel from "@/pages/Admin/AdminPanel.jsx";
import Login from "@/pages/Auth/Login.jsx";
import Register from "@/pages/Auth/Register.jsx";

const AppRouter = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
