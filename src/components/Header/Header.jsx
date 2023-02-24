// react global
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// components
import { AppBar, Toolbar, Stack, Grid } from '@mui/material';

// styling
import makeStyles from '@mui/styles/makeStyles';
import logo from '../../assets/zotLogo.svg';
import logoxs from '../../assets/zotLogoSmall.png';
import { useState, useEffect } from 'react';
import SearchSuggestion from './SearchSuggestion';

const useStyles = makeStyles(() => ({
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
    backgroundColor: '#fff',
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
    maxHeight: '50px'
  },
  userAvatar: {
    height: 46,
    width: 46
  },
  link: {
    color: '#000'
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
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

function Header() {
  const show = setNavShow();
  const classes = useStyles();
  const path = useLocation().pathname;

  return (
    <AppBar position={show ? 'fixed' : 'absolute'} sx={{ height: '10vh' }}>
      <Toolbar className={classes.header}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" className={classes.headerContainer}>
          <Grid container className={classes.grid}>
            <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'start' }}>
              <Link to="/home" className={classes.grid}>
                <picture>
                  <source media="(min-width:600px)" srcSet={logo} />
                  <img alt="zot" src={logoxs} className={classes.logo} />
                </picture>
              </Link>
            </Grid>
            <Grid item xs={8}>
              {path !== '/' && <SearchSuggestion />}
            </Grid>
            <Grid item md={2} xs={0}>
              <div>{''}</div>
            </Grid>
          </Grid>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
