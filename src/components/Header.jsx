// react global
import React from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";

// components
import ExploreHeader from "./ExploreHeader";
import {Badge, AppBar, Toolbar, InputBase, Button, Popper, MenuList, MenuItem, ClickAwayListener, Paper, Grow, Stack} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';

// styling
import { alpha } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import logo from '../assets/zot_1T.png';


const useStyles = makeStyles((theme) => ({
    header: {
      display: "flex",
      paddingLeft: 0,
      justifyContent: "space-between",
      backgroundColor: "#fff",
      height:"100%"
    },
    search: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      boxShadow:"0px 5px 10px rgba(131, 131, 131, 0.08)",
      borderRadius: "40px",
      border:"2px solid #E7E7E7",
      minWidth: "35%",
      marginLeft: 16,
    },
    searchIcon: {
      color:"#A53692",
      paddingRight:"3%"
    },
    input: {
      color: "#464141",
      marginLeft: 1,
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
      window.location.reload();
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const goToExplore = () => {
    navigate(`/explore`);
  }

  return (
      <AppBar sx={{position:"sticky", minHeight:"9%"}}>
        <Toolbar className={classes.header}>
           <div>
             <Link to="/home" className={classes.icons}>
               <div className={classes.wrapper}>
                   <Avatar
                      alt="zot"
                      src={logo}
                      className={classes.logo}
                      variant="square"
                      sx={{ height: 60, width: 64 }}
                  />
                </div>
             </Link>
           </div>
           {path !== '/' &&
            <Stack className={classes.search} direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <InputBase style={{paddingLeft:10,height: 46, color:"rgba(0, 0, 0, 0.6)"}} 
                        placeholder="Search for content..." 
                        className={classes.input} 
                        onKeyDown={() => goToExplore()}
                        />
              <SearchIcon className={classes.searchIcon}/>
            </Stack>}
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
            </div>
        </Toolbar>
      </AppBar>
  );
}

export default Header;
