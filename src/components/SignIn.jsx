// react global
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { host } from '../host';
// utility
import { api, endpoints } from '../api';

// components
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import TermsOfService from './TermsOfService';
import google from '../assets/Google.png';
import git from '../assets/Git.png';

// styling
import { makeStyles } from '@mui/styles';
import { Card, CardContent } from '@mui/material';

const useStyles = makeStyles(() => ({
  cardContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    padding: '0.625rem',
    position: 'relative'
  },
  loginCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20%',
    width: '60%',
    height: '60%',
    background: '#FFFFFF',
    gap: '0.625em',
    boxShadow: '0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)',
    borderRadius: '1.5rem',
    minWidth: '30rem'
  },
  loginCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    border: '0.1875rem black',
    maxWidth: '73%',
    height: '90%'
  },
  text: {
    color: '#14191F',
    width: '100%',
    fontSize: '1.5rem'
  },
  subtext: {
    color: '#52637A',
    width: '100%',
    fontSize: '1rem'
  },
  textField: {
    borderRadius: '0.25rem'
  },
  button: {
    textTransform: 'none',
    color: '##FFFFFF',
    fontSize: '1.4375rem',
    fontWeight: '500',
    height: '3.125rem',
    borderRadius: '0.25rem',
    letterSpacing: '0.01rem'
  },
  gitLogo: {
    height: '24px',
    borderRadius: '0.25rem',
    paddingLeft: '1rem'
  },
  line: {
    width: '100%',
    textAlign: 'center',
    borderBottom: '0.0625rem solid #C2CBD6',
    lineHeight: '0.1rem',
    margin: '0.625rem 0 1.25rem'
  },
  lineSpan: {
    background: '#ffffff',
    color: '#C2CBD6',
    padding: '0 0.625rem',
    fontSize: '1rem',
    fontWeight: '400',
    paddingLeft: '1rem',
    paddingRight: '1rem'
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
    if (isAuthEnabled && isLoggedIn) {
      navigate('/home');
    } else {
      api
        .get(`${host()}/v2/`)
        .then((response) => {
          if (response.status === 200) {
            setIsAuthEnabled(false);
            setIsLoggedIn(true);
            navigate('/home');
          }
        })
        .catch(() => {
          setIsAuthEnabled(true);
        });
    }
  }, []);

  const handleClick = (event) => {
    event.preventDefault();
    setRequestProcessing(true);
    let cfg = {};
    if (isAuthEnabled) {
      const token = btoa(username + ':' + password);
      cfg = {
        headers: {
          Authorization: `Basic ${token}`
        }
      };
    }
    api
      .get(`${host()}${endpoints.imageList}`, cfg)
      .then((response) => {
        if (response.data && response.data.data) {
          if (isAuthEnabled) {
            const token = btoa(username + ':' + password);
            localStorage.setItem('token', token);
            setRequestProcessing(false);
            setRequestError(false);
          }
          setIsLoggedIn(true);
          navigate('/home');
        }
      })
      .catch(() => {
        setRequestError(true);
        setRequestProcessing(false);
      });
  };

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
  };

  return (
    <Box className={classes.cardContainer} data-testid="signin-container">
      <Card className={classes.loginCard}>
        <CardContent className={classes.loginCardContent}>
          <CssBaseline />
          <Typography align="left" className={classes.text} component="h1" variant="h4">
            Sign in
          </Typography>
          <Typography align="left" className={classes.subtext} variant="body1" gutterBottom>
            Welcome back! Please enter your details.
          </Typography>

          <Box component="form" onSubmit={null} noValidate autoComplete="off" sx={{ mt: 1 }}>
            <div>
              <Button
                fullWidth
                variant="contained"
                className={classes.button}
                sx={{
                  mt: 3,
                  mb: 1,
                  background: '#161614',
                  '&:hover': {
                    backgroundColor: '#1565C0',
                    color: '#FFFFFF'
                  }
                }}
              >
                {' '}
                Continue with GitHub
                <img src={git} alt="git logo" className={classes.gitLogo}></img>
              </Button>
              <Button
                fullWidth
                variant="contained"
                className={classes.button}
                sx={{
                  mt: 1,
                  mb: 1,
                  background: 'transparent',
                  color: '#52637A',
                  '&:hover': {
                    backgroundColor: '#1565C0',
                    color: '#FFFFFF'
                  }
                }}
              >
                {' '}
                Continue with Google
                <img src={google} alt="google logo" className={classes.gitLogo}></img>
              </Button>
            </div>
            <br></br>
            <h2 className={classes.line}>
              <span className={classes.lineSpan}>or</span>
            </h2>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              className={classes.textField}
              onInput={(e) => handleChange(e, 'username')}
              error={usernameError != null}
              helperText={usernameError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Enter password"
              type="password"
              id="password"
              className={classes.textField}
              onInput={(e) => handleChange(e, 'password')}
              error={passwordError != null}
              helperText={passwordError}
            />
            {requestProcessing && <CircularProgress style={{ marginTop: 20 }} color="secondary" />}
            {requestError && (
              <Alert style={{ marginTop: 20 }} severity="error">
                Authentication Failed. Please try again.
              </Alert>
            )}
            <div>
              <Button
                fullWidth
                variant="contained"
                className={classes.button}
                sx={{
                  mt: 3,
                  mb: 1,
                  background: '#1479FF',
                  '&:hover': {
                    backgroundColor: '#1565C0'
                  }
                }}
                onClick={handleClick}
              >
                {' '}
                Continue
              </Button>
              <Button
                fullWidth
                variant="contained"
                className={classes.button}
                sx={{
                  mt: 1,
                  mb: 1,
                  background: 'transparent',
                  color: '#52637A',
                  '&:hover': {
                    backgroundColor: '#EFEFEF',
                    color: '#52637A'
                  }
                }}
              >
                {' '}
                Continue as guest
              </Button>
            </div>
          </Box>
          <TermsOfService sx={{ mt: 2, mb: 4 }} />
        </CardContent>
      </Card>
    </Box>
  );
}
