// react global
import React, {  } from 'react';

// components
import SignIn from '../components/SignIn.js'

import makeStyles from '@mui/styles/makeStyles';
import { Grid } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "100vh",
    paddingTop: 50,
    backgroundColor: "#F5F5F5",
  },
}));

function LoginPage({username, updateUsername, password, updatePassword }) {
  const classes = useStyles();

  return (
        <Grid container spacing={2} className={classes.container}>
          <Grid item xs={6}>
            <SignIn username={username} updateUsername={updateUsername} password={password} updatePassword={updatePassword} />
          </Grid>
          <Grid item xs={6}>  
            
          </Grid>
        </Grid>
  );
}

export default LoginPage;
