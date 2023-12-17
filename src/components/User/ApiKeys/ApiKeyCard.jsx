import React, { useState } from 'react';

import { DateTime } from 'luxon';
import { isNil } from 'lodash';

import { Card, CardContent, Typography, Grid, Divider, Stack, Collapse, Button } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';
import ApiKeyRevokeDialog from './ApiKeyRevokeDialog';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  card: {
    marginBottom: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E0E5EB',
    borderRadius: '0.75rem',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%'
  },
  content: {
    textAlign: 'left',
    color: '#52637A',
    width: '100%',
    boxSizing: 'border-box',
    padding: '1rem',
    backgroundColor: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#FFFFFF'
    },
    '&:last-child': {
      paddingBottom: '1rem'
    }
  },
  label: {
    fontSize: '1rem',
    fontWeight: '400',
    paddingRight: '0.5rem',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem',
    textAlign: 'left',
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    cursor: 'pointer'
  },
  expirationDate: {
    fontSize: '1rem',
    fontWeight: '400',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem',
    textAlign: 'right'
  },
  revokeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'right'
  },
  dropdownText: {
    color: '#1479FF',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center'
  },
  dropdownButton: {
    color: '#1479FF',
    fontSize: '0.8125rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  dropdownContentBox: {
    boxSizing: 'border-box',
    color: '#52637A',
    fontSize: '1rem',
    fontWeight: '400',
    padding: '0.75rem',
    backgroundColor: '#F7F7F7',
    borderRadius: '0.9rem',
    overflowWrap: 'break-word'
  },
  keyCardDivider: {
    margin: '1rem 0'
  }
}));

function ApiKeyCard(props) {
  const classes = useStyles();
  const { apiKey, onRevoke } = props;
  const [openDropdown, setOpenDropdown] = useState(false);
  const [apiKeyRevokeOpen, setApiKeyRevokeOpen] = useState(false);

  const getExpirationDisplay = () => {
    const expDateTime = DateTime.fromISO(apiKey.expirationDate);
    return `Expires on ${expDateTime.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}`;
  };

  const handleApiKeyRevokeDialogOpen = () => {
    setApiKeyRevokeOpen(true);
  };

  return (
    <Card variant="outlined" className={classes.card}>
      <CardContent className={classes.content}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={6}>
            <Typography variant="body1" className={classes.label}>
              {apiKey.label}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" className={classes.expirationDate}>
              {getExpirationDisplay()}
            </Typography>
          </Grid>
          <Grid item xs={2} className={classes.revokeButton}>
            <Button color="error" variant="contained" onClick={handleApiKeyRevokeDialogOpen}>
              Revoke
            </Button>
          </Grid>
          {!isNil(apiKey.apiKey) && (
            <>
              <Grid item xs={12}>
                <Divider className={classes.keyCardDivider} />
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" onClick={() => setOpenDropdown((prevOpenState) => !prevOpenState)}>
                  {!openDropdown ? (
                    <KeyboardArrowRight className={classes.dropdownText} />
                  ) : (
                    <KeyboardArrowDown className={classes.dropdownText} />
                  )}
                  <Typography className={classes.dropdownButton}>KEY</Typography>
                </Stack>
                <Collapse in={openDropdown} timeout="auto" unmountOnExit sx={{ marginTop: '1rem' }}>
                  <Stack direction="column" spacing="1.2rem">
                    <Typography variant="body1" align="left" className={classes.dropdownContentBox}>
                      {apiKey.apiKey}
                    </Typography>
                  </Stack>
                </Collapse>
              </Grid>
            </>
          )}
        </Grid>
        <ApiKeyRevokeDialog
          open={apiKeyRevokeOpen}
          setOpen={setApiKeyRevokeOpen}
          apiKey={apiKey}
          onConfirm={onRevoke}
        />
      </CardContent>
    </Card>
  );
}

export default ApiKeyCard;
