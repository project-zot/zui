import React from 'react';

import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import githubLogo from '../../assets/GhIcon.svg';

// styling
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  githubButton: {
    textTransform: 'none',
    background: '#161614',
    color: '#FFFFFF',
    borderRadius: '0.25rem',
    padding: 0,
    height: '3.125rem',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#161614',
      boxShadow: 'none'
    }
  },
  googleButton: {
    textTransform: 'none',
    background: '#FFFFFF',
    color: '#52637A',
    borderRadius: '0.25rem',
    border: '1px solid #52637A',
    padding: 0,
    height: '3.125rem',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#FFFFFF',
      boxShadow: 'none'
    }
  },
  buttonsText: {
    lineHeight: '2.125rem',
    height: '2.125rem',
    fontSize: '1.438rem',
    fontWeight: '600',
    letterSpacing: '0.01rem'
  }
}));

function GithubLoginButton({ handleClick }) {
  const classes = useStyles();

  return (
    <Button
      fullWidth
      variant="contained"
      className={classes.githubButton}
      endIcon={<SvgIcon fontSize="medium">{githubLogo}</SvgIcon>}
      onClick={(e) => handleClick(e, 'github')}
    >
      <span className={classes.buttonsText}>Continue with Github</span>
    </Button>
  );
}

function GoogleLoginButton({ handleClick }) {
  const classes = useStyles();

  return (
    <Button fullWidth variant="contained" className={classes.googleButton} onClick={(e) => handleClick(e, 'google')}>
      <span className={classes.buttonsText}>Continue with Google</span>
    </Button>
  );
}

function GitlabLoginButton({ handleClick }) {
  const classes = useStyles();

  return (
    <Button fullWidth variant="contained" className={classes.button} onClick={(e) => handleClick(e, 'gitlab')}>
      Sign in with Gitlab
    </Button>
  );
}

function OIDCLoginButton({ handleClick, oidcName }) {
  const classes = useStyles();
  const loginWithName = oidcName || 'OIDC';

  return (
    <Button fullWidth variant="contained" className={classes.button} onClick={(e) => handleClick(e, 'oidc')}>
      Sign in with {loginWithName}
    </Button>
  );
}

export { GithubLoginButton, GoogleLoginButton, GitlabLoginButton, OIDCLoginButton };
