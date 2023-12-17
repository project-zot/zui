import React, { useState } from 'react';

import { Menu, MenuItem, IconButton, Avatar, Divider } from '@mui/material';

import { getLoggedInUser, logoutUser, isApiKeyEnabled } from '../../utilities/authUtilities';
import { useNavigate } from 'react-router-dom';

function UserAccountMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();

  const apiKeyManagement = () => {
    navigate('/user/apikey');
  };

  const handleUserClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={handleUserClick}
        size="small"
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar sx={{ width: 32, height: 32 }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleUserClose}
        onClick={handleUserClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleUserClose}>{getLoggedInUser()}</MenuItem>
        <Divider />
        {isApiKeyEnabled() && <MenuItem onClick={apiKeyManagement}>API Keys</MenuItem>}
        <Divider />
        <MenuItem onClick={logoutUser}>Log out</MenuItem>
      </Menu>
    </>
  );
}

export default UserAccountMenu;
