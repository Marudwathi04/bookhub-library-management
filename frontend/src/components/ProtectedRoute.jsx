import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// ✅ Protected Route Component with Role-Based Access Control
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token } = useContext(AuthContext);

  // Check if user is authenticated
  if (!token || !user || !user.email) {
    console.log("❌ Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Grant access if the user is an ADMIN
  if (user.role === 'ADMIN') {
    console.log(`✅ Admin access granted`);
    return children;
  }

  // For non-admins, check if they have the required role
  if (requiredRole && user.role !== requiredRole) {
    console.log(`❌ Access denied. Required: ${requiredRole}, User has: ${user.role}`);
    // Redirect non-admins to their default page if they lack the role
    return <Navigate to="/home" replace />;
  }

  console.log(`✅ Access granted for role: ${user.role}`);
  return children;
};

export default ProtectedRoute;