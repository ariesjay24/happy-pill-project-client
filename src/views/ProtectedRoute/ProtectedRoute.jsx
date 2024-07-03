import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.Role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
