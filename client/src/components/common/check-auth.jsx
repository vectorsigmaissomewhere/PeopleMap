import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, children }) {
  const location = useLocation();
  const path = location.pathname;

  const isAuthPage =
    path.includes("/auth/login") || 
    path.includes("/auth/register") ||
    path.includes("/verify-email") ||
    path.includes("/forget-password")||
    path.includes("/reset-password"); 

  if (path === "/") {
    return isAuthenticated
      ? <Navigate to="/people/home" />
      : <Navigate to="/auth/login" />;
  }

  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/auth/login" />;
  }

  if (isAuthenticated && isAuthPage) {
    return <Navigate to="/people/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;