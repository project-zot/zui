import React, { useEffect, useState } from 'react';

import { Menu, MenuItem, IconButton, Avatar, Divider, Box, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

import { getLoggedInUser, logoutUser, isApiKeyEnabled } from '../../utilities/authUtilities';
import { getServerVersionInfo } from '../../utilities/serverInfo';
import { useNavigate } from 'react-router';

// zot's commit field is `git describe` output, e.g. "v2.1.18-31-g3ff2b93c",
// not a raw SHA, so the short hash has to be pulled from after the "-g".
const getShortCommit = (commit) => {
  if (!commit) return commit;
  const match = commit.match(/-g([0-9a-f]+)$/i);
  return (match ? match[1] : commit).slice(0, 7);
};

function UserAccountMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [versionInfo, setVersionInfo] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
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

  const handleVersionCopy = (event) => {
    event.stopPropagation();
    const { releaseTag, commit } = versionInfo;
    navigator.clipboard.writeText(`zot ${releaseTag} (commit: ${commit})`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

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
            API Keys
          </MenuItem>
        )}
        {isApiKeyEnabled() && <Divider data-testid="api-keys-menu-item-divider" />}
        <MenuItem onClick={logoutUser}>Log out</MenuItem>
        {versionInfo?.releaseTag && (
          <>
            <Divider />
            <MenuItem disableRipple onClick={(event) => event.stopPropagation()} data-testid="version-menu-item">
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="caption" color="text.secondary">
                  zot {versionInfo.releaseTag} ({getShortCommit(versionInfo.commit)})
                </Typography>
                <IconButton
                  size="small"
                  aria-label="copy version"
                  onClick={handleVersionCopy}
                  data-testid="version-copy-button"
                >
                  {isCopied ? <CheckIcon fontSize="inherit" /> : <ContentCopyIcon fontSize="inherit" />}
                </IconButton>
              </Box>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
}

export default UserAccountMenu;
