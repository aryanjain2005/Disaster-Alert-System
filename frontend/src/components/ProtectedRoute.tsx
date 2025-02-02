import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useLogin } from "@/components/LoginContext";

const ProtectedRoute = () => {
  const { loggedIn } = useLogin();
  const location = useLocation();

  if (!loggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />; // Renders child components inside <ProtectedRoute>
};

export default ProtectedRoute;
