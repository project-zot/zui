// react global
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { host } from '../constants';
// utility
import api from '../api';

// components
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import TermsOfService from './TermsOfService';

// styling
import { makeStyles } from '@mui/styles';
import { usePushingGutterStyles } from '@mui-treasury/styles/gutter/pushing';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems:'flex-start',
    width: 800,
    padding:'48px 48px 15px',
    background: '#FFFFFF',
    gap: '10px',
    boxShadow:'0px 5px 10px rgba(131, 131, 131, 0.08)',
    borderRadius: '24px'
  },
  text: {
    color: "#383838",
  }
}));



export default function SignIn({ username, updateUsername, password, updatePassword }) {
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [requestProcessing, setRequestProcessing] = useState(false);
  const [requestError, setRequestError] = useState(false);
  const [isAuthEnabled, setIsAuthEnabled] = useState(true);
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    api.get(`${host}/v2`)
      .then(response => {
        if (response.status === 200) {
          setIsAuthEnabled(false);
        }
      })
      .catch(e => {
        setIsAuthEnabled(true);
      })
  }, []);

  const handleClick = (event) => {
    event.preventDefault();
    setRequestProcessing(true);

    const token = btoa(username + ':' + password);

    api.get(`${host}/query?query={ImageListWithLatestTag(){Name%20Latest%20Description%20Vendor%20Licenses%20Labels%20Size%20LastUpdated}}`)
      .then(response => {
        if (response.data && response.data.data) {
          localStorage.setItem('username', username);
          localStorage.setItem('password', password);


          setRequestProcessing(false);
          setRequestError(false);
          navigate("/home");
        }
      })
      .catch(e => {
        setRequestError(true);
        setRequestProcessing(false);
      })
  }

  const handleChange = (event, type) => {
    event.preventDefault();
    setRequestError(false);

    const val = event.target.value;
    const isEmpty = val === '';

    switch (type) {
      case 'username':
        updateUsername(val);
        if (isEmpty) {
          setUsernameError('Please enter a username');
        } else {
          setUsernameError(null);
        }
        break;
      case 'password':
        updatePassword(val);
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

  const gutterStyles = usePushingGutterStyles({ cssProp: 'marginBottom', space: 2 });

  return (
    <Paper elevation={2} className={classes.paper}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '3px black',
          }}
        >
          {isAuthEnabled ?
            (<>
              <Typography className={classes.text} component="h1" variant="h4">
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
                    variant="outlined"
                    sx={{ mt: 3, mb: 2, color: "#fff", background: "#7C4DFF", border: 'white' }}
                    onClick={handleClick}
                  > Continue
                  </Button>
                </div>
              </Box>
            </>) : (
              <div className={gutterStyles.parent}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 3, mb: 2, color: "#fff", background: "#7C4DFF", border: 'white' }}
                  onClick={handleClick}
                > Continue as Guest
                </Button>
              </div>
            )
          }
        </Box>
        <TermsOfService sx={{ mt: 2, mb: 4 }} />
      </Container>
    </Paper>

  );
}
