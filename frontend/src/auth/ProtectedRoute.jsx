import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./useAuth";
import Loader from "@/components/common/Loader.jsx";
import { ROLES } from "@/utils/constants.js";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, role, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return <Loader message="Booting your workspace" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && role !== ROLES.ADMIN) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
