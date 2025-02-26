import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  // If the user is logged in, redirect them to the dashboard.
  if (currentUser) {
    return <Navigate to={`/dashboard`} replace />;
  }
  // Otherwise, render the children (login or register components).
  return children;
};

export default PublicRoute;
