// react global
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// utility
import { api, endpoints } from '../../api';
import { host } from '../../host';
import { isEmpty, isObject } from 'lodash';

// components
import { Card, CardContent, CssBaseline } from '@mui/material';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Loading from '../Shared/Loading';

import { GoogleLoginButton, GithubLoginButton, OIDCLoginButton } from './ThirdPartyLoginComponents';

// styling
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  cardContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  loginCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
    height: '60%',
    background: '#FFFFFF',
    boxShadow: '0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)',
    borderRadius: '0.75rem',
    minWidth: '30rem'
  },
  loginCardContent: {
    display: 'flex',
    flexDirection: 'column',
    border: '0.1875rem black',
    width: '100%',
    padding: '3rem'
  },
  text: {
    color: '#14191F',
    width: '100%',
    fontSize: '1.5rem',
    lineHeight: '2.25rem',
    letterSpacing: '-0.01rem',
    marginBottom: '0.25rem'
  },
  subtext: {
    color: '#52637A',
    width: '100%',
    fontSize: '1rem',
    marginBottom: '2.375rem'
  },
  textField: {
    borderRadius: '0.25rem',
    marginTop: 0,
    marginBottom: '1.5rem'
  },
  textColor: {
    color: '#8596AD'
  },
  labelColor: {
    color: '#667C99',
    '&:focused': {
      color: '#667C99'
    }
  },
  continueButton: {
    textTransform: 'none',
    background: '#F15527',
    color: '#FFFFFF',
    fontSize: '1.438rem',
    fontWeight: '600',
    height: '3.125rem',
    borderRadius: '0.25rem',
    letterSpacing: '0.01rem',
    marginBottom: '1rem',
    padding: 0,
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#F15527',
      boxShadow: 'none'
    }
  },
  continueAsGuestButton: {
    textTransform: 'none',
    background: '#FFFFFF',
    color: '#52637A',
    fontSize: '1.438rem',
    fontWeight: '600',
    height: '3.125rem',
    borderRadius: '0.25rem',
    border: '1px solid #52637A',
    letterSpacing: '0.01rem',
    marginBottom: '1rem',
    padding: 0,
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#FFFFFF',
      boxShadow: 'none'
    }
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
  },
  divider: {
    color: '#C2CBD6',
    marginBottom: '2rem',
    width: '100%'
  },
  thirdPartyLoginContainer: {
    width: '100%',
    marginBottom: '2rem'
  }
}));

export default function SignIn({ isLoggedIn, setIsLoggedIn, wrapperSetLoading = () => {} }) {
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [requestProcessing, setRequestProcessing] = useState(false);
  const [requestError, setRequestError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authMethods, setAuthMethods] = useState({});
  const [isGuestLoginEnabled, setIsGuestLoginEnabled] = useState(false);
  const abortController = useMemo(() => new AbortController(), []);
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    setIsLoading(true);
    if (isLoggedIn) {
      setIsLoading(false);
      wrapperSetLoading(false);
      navigate('/home');
    } else {
      api
        .get(`${host()}${endpoints.authConfig}`, abortController.signal)
        .then((response) => {
          if (response.data?.http && isEmpty(response.data?.http?.auth)) {
            localStorage.setItem('authConfig', '{}');
            setIsLoggedIn(true);
            navigate('/home');
          } else if (response.data?.http?.auth) {
            setAuthMethods(response.data?.http?.auth);
            localStorage.setItem('authConfig', JSON.stringify(response.data?.http?.auth));
            setIsLoading(false);
            wrapperSetLoading(false);
            api
              .get(`${host()}${endpoints.status}`)
              .then((response) => {
                if (response.status === 200) {
                  setIsGuestLoginEnabled(true);
                }
              })
              .catch(() => console.log('could not obtain guest login status'));
          }
          setIsLoading(false);
          wrapperSetLoading(false);
        })
        .catch((e) => {
          console.error(e);
          setIsLoading(false);
          wrapperSetLoading(false);
        });
    }
    return () => {
      abortController.abort();
    };
  }, []);

  const handleBasicAuth = () => {
    setRequestProcessing(true);
    let cfg = {};
    const token = btoa(username + ':' + password);
    cfg = {
      headers: {
        Authorization: `Basic ${token}`
      },
      withCredentials: host() !== window?.location?.origin
    };
    api
      .get(`${host()}/v2/`, abortController.signal, cfg)
      .then((response) => {
        if (response.status === 200) {
          setRequestProcessing(false);
          setRequestError(false);
          setIsLoggedIn(true);
          navigate('/home');
        }
      })
      .catch(() => {
        setRequestError(true);
        setRequestProcessing(false);
      });
  };

  const handleBasicAuthSubmit = () => {
    setRequestError(false);
    const isUsernameValid = handleUsernameValidation(username);
    const isPasswordValid = handlePasswordValidation(password);
    if (Object.keys(authMethods).includes('htpasswd') && isUsernameValid && isPasswordValid) {
      handleBasicAuth();
    }
  };

  const handleClick = (event) => {
    event.preventDefault();
    handleBasicAuthSubmit();
  };

  const handleGuestClick = () => {
    setRequestProcessing(false);
    setRequestError(false);
    setIsLoggedIn(true);
    navigate('/home');
  };

  const handleClickExternalLogin = (event, provider) => {
    event.preventDefault();
    window.location.replace(
      `${host()}${endpoints.openidAuth}?callback_ui=${encodeURIComponent(
        window?.location?.origin
      )}/home&provider=${provider}`
    );
  };

  const handleUsernameValidation = (username) => {
    let isValid = true;
    if (username === '') {
      setUsernameError('Please enter a username');
      isValid = false;
    } else {
      setUsernameError(null);
    }
    return isValid;
  };

  const handlePasswordValidation = (password) => {
    let isValid = true;
    if (password === '') {
      setPasswordError('Please enter a password');
      isValid = false;
    } else {
      setPasswordError(null);
    }
    return isValid;
  };

  const handleChange = (event, type) => {
    event.preventDefault();
    setRequestError(false);

    const val = event.target?.value;

    switch (type) {
      case 'username':
        setUsername(val);
        handleUsernameValidation(val);
        break;
      case 'password':
        setPassword(val);
        handlePasswordValidation(val);
        break;
      default:
        break;
    }
  };

  const handleLoginInputFieldKeyDown = (event) => {
    const keyPressed = event.key;
    if (keyPressed === 'Enter') {
      handleBasicAuthSubmit();
    }
  };

  const renderThirdPartyLoginMethods = () => {
    let isGoogle = isObject(authMethods.openid?.providers?.google);
    // let isGitlab = isObject(authMethods.openid?.providers?.gitlab);
    let isGithub = isObject(authMethods.openid?.providers?.github);
    let isOIDC = isObject(authMethods.openid?.providers?.oidc);
    let oidcName = authMethods.openid?.providers?.oidc?.name;

    return (
      <Stack direction="column" spacing="1rem" className={classes.thirdPartyLoginContainer}>
        {isGithub && <GithubLoginButton handleClick={handleClickExternalLogin} />}
        {isGoogle && <GoogleLoginButton handleClick={handleClickExternalLogin} />}
        {/* {isGitlab && <GitlabLoginButton handleClick={handleClickExternalLogin} />} */}
        {isOIDC && <OIDCLoginButton handleClick={handleClickExternalLogin} oidcName={oidcName} />}
      </Stack>
    );
  };

  const { t } = useTranslation();

  return (
    <div className={classes.cardContainer} data-testid="signin-container">
      {isLoading ? (
        <Loading />
      ) : (
        <Card className={classes.loginCard}>
          <CardContent className={classes.loginCardContent}>
            <CssBaseline />
            <Typography align="left" className={classes.text} component="h1" variant="h4">
              {t('main.signIn')}
            </Typography>
            <Typography align="left" className={classes.subtext} variant="body1" gutterBottom>
              {t('signIn.welcomeBack')}
            </Typography>
            {renderThirdPartyLoginMethods()}
            {Object.keys(authMethods).length > 1 &&
              Object.keys(authMethods).includes('openid') &&
              Object.keys(authMethods.openid.providers).length > 0 && (
                <Divider className={classes.divider} data-testid="openid-divider">
                  {t('signIn.or')}
                </Divider>
              )}
            {Object.keys(authMethods).includes('htpasswd') && (
              <Box component="form" onSubmit={null} noValidate autoComplete="off">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label={t('signIn.username')}
                  name="username"
                  className={classes.textField}
                  inputProps={{ className: classes.textColor }}
                  InputLabelProps={{ className: classes.labelColor }}
                  onInput={(e) => handleChange(e, 'username')}
                  error={usernameError != null}
                  helperText={usernameError}
                  onKeyDown={(e) => handleLoginInputFieldKeyDown(e)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label={t('signIn.enterPassword')}
                  type="password"
                  id="password"
                  className={classes.textField}
                  inputProps={{ className: classes.textColor }}
                  InputLabelProps={{ className: classes.labelColor }}
                  onInput={(e) => handleChange(e, 'password')}
                  error={passwordError != null}
                  helperText={passwordError}
                  onKeyDown={(e) => handleLoginInputFieldKeyDown(e)}
                />
                {requestProcessing && <CircularProgress style={{ marginTop: 20 }} color="secondary" />}
                {requestError && (
                  <Alert style={{ marginTop: 20 }} severity="error">
                    {t('signIn.authFailed')}
                  </Alert>
                )}
                <div>
                  <Button
                    fullWidth
                    variant="contained"
                    className={classes.continueButton}
                    onClick={handleClick}
                    data-testid="basic-auth-submit-btn"
                  >
                    {t('signIn.continue')}
                  </Button>
                </div>
              </Box>
            )}
            {isGuestLoginEnabled && (
              <Button
                fullWidth
                variant="contained"
                className={classes.continueAsGuestButton}
                onClick={handleGuestClick}
              >
                {t('signIn.continueAsGuest')}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
