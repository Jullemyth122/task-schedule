import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  // If there's no authenticated user, redirect to login
  if (!currentUser) {
    return <Navigate to="/signup" replace />;
  }
  return children;
};

export default PrivateRoute;
