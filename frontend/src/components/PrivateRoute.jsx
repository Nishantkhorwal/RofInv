import { Navigate } from "react-router-dom";

// Wrapper component to protect routes based on allowed roles
const PrivateRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem("role");

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />; // Redirect to home if the role is not allowed
  }

  return children; // Render children if the role is allowed
};

export default PrivateRoute;

