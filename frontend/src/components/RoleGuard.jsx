import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleGuard = ({ allowedRoles }) => {
  const { user, checkRole } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!checkRole(allowedRoles)) {
    return <Navigate to="/dashboard" replace />; // or a 403 Forbidden page
  }

  return <Outlet />;
};

export default RoleGuard;
