// react global
import React, {useState } from 'react';
import {useNavigate} from "react-router-dom";

// utility
import axios from 'axios';
import {SESSION} from '../session.js';

// components
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

// styling
import { makeStyles } from '@material-ui/core/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useGradientBtnStyles } from '@mui-treasury/styles/button/gradient';
import { usePushingGutterStyles } from '@mui-treasury/styles/gutter/pushing';

const useStyles = makeStyles((theme) => ({
    paper: {
      padding: 25,
      width: 800,
      margin: '100px auto'
    },
    text: {
      color: "#383838",
    },
    subtext: {
      color: "#A0A0A0",
    }
}));

function Copyright(props) {
  const classes = useStyles();
  return (
    <Typography variant="body2" className={classes.subtext} align="center" {...props}>
      <Link color="inherit" href="https://github.com/njiandan1255/zot-gui">
        zot-ui
      </Link>
      {' X '}
      <Link color="inherit" href="https://github.com/project-zot/zot/">
        project zot
      </Link>{' '}
      {new Date().getFullYear()}
      {''}
    </Typography>
  );
}


export default function SignIn({ host, updateHost, username, updateUsername, password, updatePassword }) {
   // const [password, setPassword] = useState('');
   const [usernameError, setUsernameError] = useState(null);
   const [passwordError, setPasswordError] = useState(null);
   const [hostError, setHostError] = useState(null);
   const [requestProcessing, setRequestProcessing] = useState(false);
   const [requestError, setRequestError] = useState(false);
   const navigate = useNavigate();
   const classes = useStyles();

  const handleClick = (event) => {
    event.preventDefault();
    setRequestProcessing(true);

    // todo: get credentials from global state
    // const token = btoa("test:test123");
    const token = btoa(username + ':' + password);

    const cfg = {
      headers: {
        'Authorization': `Basic ${token}`,
      }
    };

    axios.get(`${host}/query?query={ImageListWithLatestTag(){Name%20Latest%20Description%20Vendor%20Licenses%20Labels%20Size%20LastUpdated}}`, cfg)
      .then(response => {
        if (response.data && response.data.data) {
            // let imageList = response.data.data.ImageListWithLatestTag;
            // let imagesData = imageList.map((image) => {
            //     return {
            //         name: image.Name,
            //         latestVersion: image.Latest,
            //         tags: image.Labels,
            //         description: image.Descri    ption,
            //         licenses: image.Licenses,
            //         size: image.Size,
            //         vendor: image.Vendor
            //     };
            // });
            // setData(imagesData);
            // setIsLoading(false);

            localStorage.setItem('host', host);
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);

            // TODO: why is this needed?
            window.location.reload(true);

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

  // static data
  // const handleClick = (event) => {
  //   event.preventDefault();
  //   setRequestProcessing(true);
  //
  //   localStorage.setItem('host', host);
  //   window.location.reload(true);
  //
  //   setRequestProcessing(false);
  //   setRequestError(false);
  //   navigate("/home");
  // }

  const  handleChange = (event, type) => {
    event.preventDefault();
    setRequestError(false);

    const val = event.target.value;
    const isEmpty = val == '';

    switch (type) {
      case 'host':
            updateHost(val);
            if (isEmpty) {
                setHostError('Please enter a host address');
            } else {
                setHostError(null);
            }
            break;
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


  const buttonStyles = useGradientBtnStyles();
  const chubbyStyles = useGradientBtnStyles({ chubby: true });
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.light' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography className={classes.text} component="h1" variant="h5">
            Sign in
          </Typography>
          <Typography className={classes.text} variant="subtitle1" gutterBottom component="div">
           Connect to a zot server
         </Typography>
          <Box component="form" onSubmit={null} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="host"
              label="Host"
              name="host"
              autoComplete="host"
              autoFocus
              onInput={(e) => handleChange(e, 'host')}
              error={hostError != null}
              helperText={hostError}
              placeholder="ex: https://aci-zot.cisco.com:5050"
            />
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
              helperText={usernameError}
            />
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
              helperText={passwordError}
            />
            {requestProcessing && <CircularProgress style={{marginTop: 20}} color="secondary"/>}
            {requestError && <Alert style={{marginTop: 20}} severity="error">Authentication Failed. Please try again.</Alert>}
            <div className={gutterStyles.parent}>
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 3, mb: 2, color: "#fff", border: 'white' }}
                onClick={handleClick}
                classes={chubbyStyles}
              > Sign In
              </Button>
            </div>
          </Box>
        </Box>
        <Copyright sx={{ mt: 2, mb: 4 }} />
      </Container>
      </Paper>

  );
}
