// react global
import React, { useEffect, useState } from 'react';

// components
import Header from './Header.jsx'
import SignIn from './SignIn.js'
import {Grid} from '@material-ui/core';
import {Container, Typography} from '@material-ui/core';

// styling
import {makeStyles} from '@material-ui/core';
import logo from '../assets/zot_1T.png';

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "100vh",
    paddingTop: 50,
    backgroundColor: "#f2f2f2a1",
  },
}));

function LoginPage({ host, updateHost, username, updateUsername, password, updatePassword }) {
  const classes = useStyles();

  return (
      <div className={classes.wrapper}>
        <Header></Header>
        <div className={classes.container}>
          <SignIn host={host} updateHost={updateHost} username={username} updateUsername={updateUsername} password={password} updatePassword={updatePassword} />
        </div>
      </div>
  );
}

export default LoginPage;
