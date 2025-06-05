import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Regular user route
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, userRole } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Admin only route
const AdminRoute = ({ children }) => {
  const { isAuthenticated, userRole } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (userRole !== 'admin') {
    return <Navigate to="/" />;
  }
  return children;
};

export { PrivateRoute, AdminRoute }; 