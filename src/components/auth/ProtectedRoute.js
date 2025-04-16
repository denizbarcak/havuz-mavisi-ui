import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false, onUnauthorized }) => {
  const { user, logout } = useAuth();

  // Kullanıcı giriş yapmamışsa
  if (!user) {
    if (onUnauthorized) {
      onUnauthorized();
    }
    return <Navigate to="/login" replace />;
  }

  // Admin yetkisi gerekiyorsa ve kullanıcı admin değilse
  if (adminOnly && user.role !== "admin") {
    if (onUnauthorized) {
      onUnauthorized();
    } else {
      // Varsayılan davranış: logout ve login sayfasına yönlendirme
      logout();
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
