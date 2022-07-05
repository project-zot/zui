import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AuthWrapper = ({isAuthEnabled,isLoggedIn, redirect}) => {
  if(!isAuthEnabled) {
    return <Outlet/>
  }
  return  isLoggedIn  ? <Outlet />: <Navigate to={redirect} replace={true} />;
};

export {AuthWrapper};