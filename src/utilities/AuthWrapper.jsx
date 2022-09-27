import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AuthWrapper = ({ isLoggedIn, redirect }) => {
  return isLoggedIn ? <Outlet /> : <Navigate to={redirect} replace={true} />;
};

export { AuthWrapper };
