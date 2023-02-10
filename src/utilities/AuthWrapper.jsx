import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  topMargin: {
    marginTop: '10vh',
    minHeight: '90vh',
    height: '100%'
  }
}));

const AuthWrapper = ({ isLoggedIn, redirect, hasHeader = false }) => {
  const classes = useStyles();

  return isLoggedIn ? (
    <div className={hasHeader ? classes.topMargin : null}>
      <Outlet />
    </div>
  ) : (
    <Navigate to={redirect} replace={true} />
  );
};

export { AuthWrapper };
