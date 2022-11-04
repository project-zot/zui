// react global
import React from 'react';

// components
import SignIn from '../components/SignIn';

import makeStyles from '@mui/styles/makeStyles';
import { Grid } from '@mui/material';
import SigninPresentation from 'components/SignInPresentation';
import { useState } from 'react';
import Loading from 'components/Loading';

const useStyles = makeStyles(() => ({
  container: {
    minHeight: '100vh',
    backgroundColor: '#F6F7F9'
  },
  loadingHidden: {
    display: 'none'
  }
}));

function LoginPage({ isAuthEnabled, setIsAuthEnabled, isLoggedIn, setIsLoggedIn }) {
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();

  return (
    <Grid container spacing={0} className={classes.container} data-testid="login-container">
      {isLoading && <Loading />}
      <Grid item xs={6} className={isLoading ? classes.loadingHidden : ''}>
        <SigninPresentation />
      </Grid>
      <Grid item xs={6} className={isLoading ? classes.loadingHidden : ''}>
        <SignIn
          isAuthEnabled={isAuthEnabled}
          setIsAuthEnabled={setIsAuthEnabled}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          wrapperSetLoading={setIsLoading}
        />
      </Grid>
    </Grid>
  );
}

export default LoginPage;
