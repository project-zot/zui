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
  Stack
  //IconButton
} from '@mui/material';
import Avatar from '@mui/material/Avatar';

// styling
import makeStyles from '@mui/styles/makeStyles';
import logo from '../assets/Zot-white-text.svg';
//import placeholderProfileButton from '../assets/Profile_button_placeholder.svg';
import { useState, useRef } from 'react';
import SearchSuggestion from './SearchSuggestion';

const useStyles = makeStyles(() => ({
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
    width: '143px'
  },
  userAvatar: {
    height: 46,
    width: 46
  },
  link: {
    color: '#000'
  }
}));

function Header() {
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
    <AppBar sx={{ position: 'sticky', minHeight: '10%' }}>
      <Toolbar className={classes.header}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ minWidth: '60%' }}>
          <Link to="/home" className={classes.logoWrapper}>
            <Avatar alt="zot" src={logo} className={classes.logo} variant="square" />
          </Link>
          {path !== '/' && <SearchSuggestion />}
          <div></div>
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
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
