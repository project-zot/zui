// react global
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { isAuthenticated, isAuthenticationEnabled, logoutUser } from '../../utilities/authUtilities';

// components
import { AppBar, Toolbar, Grid, Button } from '@mui/material';
import SearchSuggestion from './SearchSuggestion';
import UserAccountMenu from './UserAccountMenu';
// styling
import makeStyles from '@mui/styles/makeStyles';
import logo from '../../assets/zotLogoWhite.svg';
import logoxs from '../../assets/zotLogoWhiteSmall.svg';
import githubLogo from '../../assets/Git.png';

const useStyles = makeStyles((theme) => ({
  barOpen: {
    position: 'sticky',
    minHeight: '10%'
  },
  barClosed: {
    position: 'sticky',
    minHeight: '10%',
    backgroundColor: 'red'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    backgroundColor: '#0F2139',
    height: '100%',
    width: '100%',
    borderBottom: '0.0625rem solid #BDBDBD',
    boxShadow: '0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)'
  },
  headerContainer: {
    minWidth: '60%'
  },
  searchIcon: {
    color: '#52637A',
    paddingRight: '3%'
  },
  input: {
    color: '#464141',
    marginLeft: 1,
    width: '90%'
  },

  icons: {
    color: '#001e44'
  },
  appName: {
    marginLeft: 10,
    marginTop: 8,
    color: '#464141'
  },
  logoWrapper: {},
  logo: {
    maxWidth: '130px',
    maxHeight: '30px'
  },
  headerLinkContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  link: {
    color: '#F6F7F9',
    fontSize: '1rem',
    fontWeight: 600
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '2.875rem',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'space-between'
    }
  },
  gridItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  signInBtn: {
    border: '1px solid #F6F7F9',
    borderRadius: '0.625rem',
    backgroundColor: 'transparent',
    color: '#F6F7F9',
    fontSize: '1rem',
    textTransform: 'none',
    fontWeight: 600
  }
}));

function setNavShow() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(null);

  const controlNavbar = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY < lastScrollY) {
        setShow(true);
      } else {
        setShow(false);
      }

      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);
  return show;
}

function Header({ setSearchCurrentValue = () => {} }) {
  const show = setNavShow();
  const classes = useStyles();
  const path = useLocation().pathname;

  const handleSignInClick = () => {
    logoutUser();
  };

  return (
    <AppBar position={show ? 'fixed' : 'absolute'} sx={{ height: '5rem' }}>
      <Toolbar className={classes.header}>
        <Grid container className={classes.grid}>
          <Grid item container xs={3} md={4} spacing="1.5rem" className={classes.gridItem}>
            <Grid item>
              <Link to="/home">
                <picture>
                  <source media="(min-width:600px)" srcSet={logo} />
                  <img alt="zot" src={logoxs} className={classes.logo} />
                </picture>
              </Link>
            </Grid>
            <Grid item className={classes.headerLinkContainer}>
              <a className={classes.link} href="https://zotregistry.dev" target="_blank" rel="noreferrer">
                Product
              </a>
            </Grid>
            <Grid item className={classes.headerLinkContainer}>
              <a
                className={classes.link}
                href="https://zotregistry.dev/v2.0.0/general/concepts/"
                target="_blank"
                rel="noreferrer"
              >
                Docs
              </a>
            </Grid>
          </Grid>
          <Grid item xs={6} md={4} className={classes.gridItem}>
            {path !== '/' && <SearchSuggestion setSearchCurrentValue={setSearchCurrentValue} />}
          </Grid>
          <Grid item container xs={2} md={3} spacing="1.5rem" className={`${classes.gridItem}`}>
            <Grid item className={classes.headerLinkContainer}>
              <a className={classes.link} href="https://github.com/project-zot/zot" target="_blank" rel="noreferrer">
                <img alt="github repository" src={githubLogo} className={classes.logo} />
              </a>
            </Grid>
            {isAuthenticated() && isAuthenticationEnabled() && (
              <Grid item>
                <UserAccountMenu />
              </Grid>
            )}
            {!isAuthenticated() && isAuthenticationEnabled() && (
              <Grid item>
                <Button className={classes.signInBtn} onClick={handleSignInClick}>
                  Sign in
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
