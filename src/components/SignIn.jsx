// react global
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { host } from '../constants';
// utility
import {api, endpoints} from '../api';

// components
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import TermsOfService from './TermsOfService';

// styling
import { makeStyles } from '@mui/styles';
import { Card, CardContent } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    marginTop:"20%"
  },
  loginCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: "60%",
    background: '#FFFFFF',
    gap: '10px',
    boxShadow: '0px 5px 10px rgba(131, 131, 131, 0.08)',
    borderRadius: '24px'
  },
  text: {
    color: "#383838",
  }
}));



export default function SignIn({ isAuthEnabled, setIsAuthEnabled, isLoggedIn, setIsLoggedIn }) {
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [requestProcessing, setRequestProcessing] = useState(false);
  const [requestError, setRequestError] = useState(false);
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    if(isAuthEnabled && isLoggedIn ) {
      navigate("/home");
    } else {
    api.get(`${host}/v2/`)
      .then(response => {
        if (response.status === 200) {
          setIsAuthEnabled(false);
        }
      })
      .catch(e => {
        setIsAuthEnabled(true);
      })
    }
  }, []);

  const handleClick = (event) => {
    event.preventDefault();
    setRequestProcessing(true);
    let cfg = {};
    if(isAuthEnabled) {
      const token = btoa(username + ':' + password);
      cfg = {
        headers: {
          'Authorization': `Basic ${token}`,
        }
      };
    }
    api.get(`${host}${endpoints.imageList}`,cfg)
      .then(response => {
        if (response.data && response.data.data) {
          if(isAuthEnabled) {
            const token = btoa(username + ':' + password);
            localStorage.setItem('token',token);
            setRequestProcessing(false);
            setRequestError(false);
          }
          setIsLoggedIn(true);
          navigate("/home");
        }
      })
      .catch(e => {
        setRequestError(true);
        setRequestProcessing(false);
      });
  }

  const handleChange = (event, type) => {
    event.preventDefault();
    setRequestError(false);

    const val = event.target.value;
    const isEmpty = val === '';

    switch (type) {
      case 'username':
        setUsername(val);
        if (isEmpty) {
          setUsernameError('Please enter a username');
        } else {
          setUsernameError(null);
        }
        break;
      case 'password':
        setPassword(val);
        if (isEmpty) {
          setPasswordError('Please enter a password');
        } else {
          setPasswordError(null);
        }
        break;
      default:
        break;
    }
  }


  return (
    <Box className={classes.cardContainer}>
        <Card className={classes.loginCard} >
          <CardContent>
              <CssBaseline />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: '3px black',
                }}
              >
                {isAuthEnabled ?
                  (<>
                    <Typography align="left" className={classes.text} component="h1" variant="h4">
                      Sign in
                    </Typography><Typography className={classes.text} variant="subtitle1" gutterBottom component="div">
                      Welcome back! Please enter your details.
                    </Typography><Box component="form" onSubmit={null} noValidate sx={{ mt: 1 }}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        onInput={(e) => handleChange(e, 'username')}
                        error={usernameError != null}
                        helperText={usernameError} />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onInput={(e) => handleChange(e, 'password')}
                        error={passwordError != null}
                        helperText={passwordError} />
                      {requestProcessing && <CircularProgress style={{ marginTop: 20 }} color="secondary" />}
                      {requestError && <Alert style={{ marginTop: 20 }} severity="error">Authentication Failed. Please try again.</Alert>}
                      <div>
                        <Button
                          fullWidth
                          variant="contained"
                          sx={{ mt: 3, mb: 2, background: "#7C4DFF",  border: 'white' }}
                          onClick={handleClick}
                        > Continue
                        </Button>
                      </div>
                    </Box>
                  </>) : (
                    <div>
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 3, mb: 2}}
                        onClick={handleClick}
                      > Continue as Guest
                      </Button>
                    </div>
                  )
                }
              </Box>
              <TermsOfService sx={{ mt: 2, mb: 4 }} />
          </CardContent>
        </Card>
    </Box>
  );
}
