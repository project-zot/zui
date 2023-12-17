import React from 'react';

import { api, endpoints } from 'api';
import { host } from 'host';

import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Typography, Grid } from '@mui/material';

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  gridWrapper: {
    paddingTop: '2rem',
    paddingBottom: '2rem'
  },
  apiKeyDisplay: {
    boxSizing: 'border-box',
    color: '#52637A',
    fontSize: '1rem',
    fontWeight: '400',
    padding: '0.75rem',
    backgroundColor: '#F7F7F7',
    borderRadius: '0.9rem',
    overflowWrap: 'break-word'
  }
}));

function ApiKeyRevokeDialog(props) {
  const { open, setOpen, apiKey, onConfirm } = props;

  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    api
      .delete(`${host()}${endpoints.apiKeys}`, { id: apiKey.uuid })
      .then((response) => {
        onConfirm(response?.status, apiKey);
        setOpen(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Revoke &quot;{apiKey?.label}&quot; key</DialogTitle>
      <DialogContent className={classes.apiKeyForm}>
        <Grid container className={classes.gridWrapper}>
          <Grid item xs={12}>
            <Typography>Are you sure you want to revoke this api key?</Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="error" onClick={handleSubmit}>
          Revoke
        </Button>
        <Button variant="outlined" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ApiKeyRevokeDialog;
