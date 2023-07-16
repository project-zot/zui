// react global
import React from 'react';

// components
import SignIn from '../components/Login/SignIn';

import makeStyles from '@mui/styles/makeStyles';
import { Grid } from '@mui/material';
import SigninPresentation from 'components/Login/SignInPresentation';
import { useState } from 'react';
import Loading from 'components/Shared/Loading';

const useStyles = makeStyles(() => ({
  container: {
    minHeight: '100vh',
    backgroundColor: '#F6F7F9'
  },
  signinContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingHidden: {
    display: 'none'
  }
}));

function LoginPage({ isLoggedIn, setIsLoggedIn }) {
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();

  return (
    <Grid container spacing={0} className={classes.container} data-testid="login-container">
      {isLoading && <Loading />}
      <Grid item xs={1} md={6} className={`${isLoading ? classes.loadingHidden : ''} hide-on-small`}>
        <SigninPresentation />
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        className={`${classes.signinContainer} ${isLoading ? classes.loadingHidden : ''}`}
      >
        <SignIn isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} wrapperSetLoading={setIsLoading} />
      </Grid>
    </Grid>
  );
}

export default LoginPage;
