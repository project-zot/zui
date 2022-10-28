// react global
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// components
import {
  AppBar,
  Toolbar,
  Popper,
  MenuList,
  MenuItem,
  ClickAwayListener,
  Paper,
  Grow,
  Stack,
  Grid
  //IconButton
} from '@mui/material';

// styling
import makeStyles from '@mui/styles/makeStyles';
import logo from '../assets/zotLogo.svg';
//import placeholderProfileButton from '../assets/Profile_button_placeholder.svg';
import { useState, useRef, useEffect } from 'react';
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
    paddingLeft: 0,
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    borderBottom: '0.0625rem solid #BDBDBD',
    boxShadow: '0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)'
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
    width: '130px'
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
    justifyContent: 'center'
  }
}));

function setNavShow() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(null);

  const controlNavbar = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY < lastScrollY) {
        // if scroll down hide the navbar
        setShow(true);
      } else {
        setShow(false);
      }

      // remember current page location to use in the next move
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      // cleanup function
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
  // const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    localStorage.removeItem('token');
    window.location.reload();
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };
  return (
    <AppBar position={show ? 'fixed' : 'absolute'} sx={{ height: '10vh' }}>
      <Toolbar className={classes.header}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ minWidth: '60%' }}>
          <Grid container className={classes.grid}>
            <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'start' }}>
              <Link to="/home" className={classes.grid}>
                <img alt="zot" src={logo} className={classes.logo} />
              </Link>
            </Grid>
            <Grid item xs={8}>
              {path !== '/' && <SearchSuggestion />}
            </Grid>
            <Grid item xs={2}>
              <div>{''}</div>
            </Grid>
            {/* <IconButton
            ref={anchorRef}
            id="composition-button"
            aria-controls={open ? 'composition-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          >
            <Avatar alt="profile" src={placeholderProfileButton} className={classes.userAvatar} variant="rounded" />
          </IconButton> */}
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom'
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleToggle}>
                      <MenuList autoFocusItem={open} id="composition-menu" aria-labelledby="composition-button">
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Grid>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
