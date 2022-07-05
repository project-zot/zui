// react global
import React, {  } from 'react';

// components
import SignIn from '../components/SignIn';

import makeStyles from '@mui/styles/makeStyles';
import { Grid } from '@mui/material';
import SigninPresentation from 'components/SignInPresentation';

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "100vh",
    backgroundColor: "#F5F5F5",
  },
}));

function LoginPage({username, updateUsername, password, updatePassword, isAuthEnabled, setIsAuthEnabled, isLoggedIn,setIsLoggedIn }) {
  const classes = useStyles();

  return (
        <Grid container spacing={0} className={classes.container}>
          <Grid item xs={6}>
            <SignIn username={username} updateUsername={updateUsername} password={password} updatePassword={updatePassword} isAuthEnabled={isAuthEnabled} setIsAuthEnabled={setIsAuthEnabled} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          </Grid>
          <Grid item xs={6}>
            <SigninPresentation/>
          </Grid>
        </Grid>
  );
}

export default LoginPage;
