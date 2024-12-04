import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

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

  const { t } = useTranslation();

  return (
    <>
      <IconButton
        onClick={handleUserClick}
        size="small"
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        data-testid="user-icon-header-button"
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
        {isApiKeyEnabled() && (
          <MenuItem onClick={apiKeyManagement} data-testid="api-keys-menu-item">
            {t('userAccountMenu.APIKeys')}
          </MenuItem>
        )}
        {isApiKeyEnabled() && <Divider data-testid="api-keys-menu-item-divider" />}
        <MenuItem onClick={logoutUser}>{t('userAccountMenu.logOut')}</MenuItem>
      </Menu>
    </>
  );
}

export default UserAccountMenu;
