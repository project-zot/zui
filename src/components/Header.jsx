// react global
import React, { useState} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";

// components
import ExploreHeader from "./ExploreHeader";
import {Typography, Badge, AppBar, Toolbar, InputBase, Button, Popper, MenuList, MenuItem, ClickAwayListener, Paper, Grow} from '@material-ui/core';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';

// styling
import {makeStyles, alpha} from '@material-ui/core/styles';
import logo from '../assets/zot_1T.png';


const useStyles = makeStyles((theme) => ({
    header: {
      display: "flex",
      paddingLeft: 0,
      justifyContent: "space-between",
      backgroundColor: "#fff"
    },
    search: {
      display: "flex",
      alignItems: "center",
      backgroundColor: alpha('#464141', 0.05),
      '&:hover': {
        backgroundColor: alpha('#464141', 0.15),
      },
      borderRadius: theme.shape.borderRadius,
      width: "52%",
      marginLeft: 16,
    },
    searchIcon: {
      paddingLeft: 10,
    },
    input: {
      color: "#464141",
      marginLeft: theme.spacing(1),
    },

    icons: {
      color: '#001e44',
    },
    appName: {
      marginLeft: 10,
      marginTop: 8,
      color: '#464141',
    },
    wrapper: {
      display: "flex",
      alignItems: "center",
    },
    logo: {
      margin: '10px 10px 10px 16px',
    },
    link: {
      color: "#000",
    }

}));

function Header({ updateKeywords }) {
  const classes = useStyles();
  const path = useLocation().pathname;
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
      localStorage.removeItem('host');
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      window.location.reload(true);
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  // onSearch = (event) => {
  //     this.setState({
  //         searchValue: event.target.value
  //     });
  // };

  return (
      <AppBar position="fixed">
        <Toolbar className={classes.header}>
           <div>
             <Link to="/home" className={classes.icons}>
               <div className={classes.wrapper}>
                   <Avatar
                      alt="zot"
                      src={logo}
                      className={classes.logo}
                      variant="square"
                      sx={{ height: 36, width: 40 }}
                  />
                   {
                   // <Typography className={classes.appName}
                   //   variant="h6"
                   //   noWrap
                   //   component="div"
                   //   color="secondary"
                   //   sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>zot
                   // </Typography>
                   }
                </div>
             </Link>
           </div>
           {path !== '/login' && path !== '/' &&
            <div className={classes.search}>
              <SearchIcon className={classes.searchIcon}/>
              <InputBase style={{height: 46}} placeholder="Search packages..." className={classes.input} onChange={e => updateKeywords(e.target.value)} disabled={path == '/' || path == '/login'}/>
            </div>}
            {path !== '/login' &&
            <div>
                <Button
                  className={classes.icons}
                  ref={anchorRef}
                  id="composition-button"
                  aria-controls={open ? 'composition-menu' : undefined}
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleToggle}
                >
                  <Badge color="secondary">
                    <LogoutIcon/>
                  </Badge>
                </Button>
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
                        transformOrigin:
                          placement === 'bottom-start' ? 'left top' : 'left bottom',
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                          <MenuList
                            autoFocusItem={open}
                            id="composition-menu"
                            aria-labelledby="composition-button"
                          >
                            <MenuItem onClick={handleClose}>Logout</MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
            </div>}
        </Toolbar>
        { path !== '/login' && path !== '/' && path !== '/home' && <ExploreHeader /> }
      </AppBar>
  );
}

export default Header;
