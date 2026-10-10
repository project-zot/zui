import React, { useEffect, useState } from 'react';

import { Menu, MenuItem, IconButton, Avatar, Divider, Typography } from '@mui/material';

import { getLoggedInUser, logoutUser, isApiKeyEnabled } from '../../utilities/authUtilities';
import { getServerVersionInfo } from '../../utilities/serverInfo';
import { useNavigate } from 'react-router';

// zot's commit field is usually `git describe` output (Makefile / GitHub
// release binaries), e.g. "v2.1.18-31-g3ff2b93c", but GHCR images from
// publish.yaml use "v2.1.18-<sha>" without the "g" marker. Optional "-dirty".
const getShortCommit = (commit) => {
  if (!commit) return commit;
  const match = commit.match(/-g?([0-9a-f]+)(?:-dirty)?$/i);
  return (match ? match[1] : commit).slice(0, 7);
};

function UserAccountMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [versionInfo, setVersionInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getServerVersionInfo()
      .then(setVersionInfo)
      .catch(() => console.warn('could not obtain server version info'));
  }, []);

  const apiKeyManagement = () => {
    navigate('/user/apikey');
  };

  const handleUserClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserClose = () => {
    setAnchorEl(null);
  };

  const shortCommit = getShortCommit(versionInfo?.commit);
  let versionLabel = null;
  if (versionInfo?.releaseTag) {
    versionLabel = shortCommit
      ? `zot ${versionInfo.releaseTag} (${shortCommit})`
      : `zot ${versionInfo.releaseTag}`;
  } else if (shortCommit) {
    // Local / unpackaged builds often set commit without a release tag.
    versionLabel = `zot ${shortCommit}`;
  }

  return (
    <>
      <IconButton
        onClick={handleUserClick}
        size="small"
        aria-controls={openMenu ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu ? 'true' : undefined}
        data-testid="user-icon-header-button"
      >
        <Avatar sx={{ width: 32, height: 32 }} />
      </IconButton>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleUserClose}
        onClick={handleUserClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{ list: versionLabel ? { 'aria-describedby': 'account-menu-version' } : undefined }}
      >
        <MenuItem onClick={handleUserClose}>{getLoggedInUser()}</MenuItem>
        <Divider />
        {isApiKeyEnabled() && (
          <MenuItem onClick={apiKeyManagement} data-testid="api-keys-menu-item">
            API Keys
          </MenuItem>
        )}
        {isApiKeyEnabled() && <Divider data-testid="api-keys-menu-item-divider" />}
        <MenuItem onClick={logoutUser}>Log out</MenuItem>
        {versionLabel && <Divider />}
        {versionLabel && (
          <Typography
            component="li"
            id="account-menu-version"
            variant="caption"
            color="text.secondary"
            data-testid="version-menu-item"
            sx={{ px: 2, py: 1, listStyle: 'none' }}
          >
            {versionLabel}
          </Typography>
        )}
      </Menu>
    </>
  );
}

export default UserAccountMenu;
