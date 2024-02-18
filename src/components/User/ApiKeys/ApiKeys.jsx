import React, { useEffect, useMemo, useState } from 'react';

import { isEmpty, isNil } from 'lodash';
import { api, endpoints } from 'api';
import { host } from '../../../host';

import { Grid, Stack, Card, CardContent, Typography, Button } from '@mui/material';
import Loading from '../../Shared/Loading';
import ApiKeyDialog from './ApiKeyDialog';
import ApiKeyConfirmDialog from './ApiKeyConfirmDialog';
import ApiKeyCard from './ApiKeyCard';

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  pageWrapper: {
    backgroundColor: 'transparent',
    height: '100%'
  },
  header: {
    [theme.breakpoints.down('md')]: {
      padding: '0'
    }
  },
  cardRoot: {
    boxShadow: 'none!important'
  },
  pageTitle: {
    fontWeight: '600',
    fontSize: '1.5rem',
    color: theme.palette.secondary.main,
    textAlign: 'left'
  },
  apikeysContainer: {
    marginTop: '1.5rem',
    height: '100%',
    [theme.breakpoints.down('md')]: {
      padding: '0'
    }
  },
  apikeysContent: {
    padding: '1.5rem'
  }
}));

function ApiKeys() {
  const abortController = useMemo(() => new AbortController(), []);
  const [isLoading, setIsLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState([]);
  const [newApiKey, setNewApiKey] = useState();
  const classes = useStyles();

  // ApiKey dialog props
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [apiKeyConfirmationOpen, setApiKeyConfirmationOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    api
      .get(`${host()}${endpoints.apiKeys}`)
      .then((response) => {
        if (response.data && response.data.apiKeys) {
          setApiKeys(response.data.apiKeys);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
      });
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (!isNil(newApiKey) && !apiKeyConfirmationOpen) {
      setApiKeyConfirmationOpen(true);
    }
  }, [newApiKey]);

  const handleApiKeyDialogOpen = () => {
    setApiKeyDialogOpen(true);
  };

  const handleApiKeyCreateConfirm = (apiKey) => {
    setNewApiKey(apiKey);
    setApiKeys((prevState) => [...prevState, apiKey]);
  };

  const handleApiKeyRevokeConfirm = (status, apiKey) => {
    if (status === 200) setApiKeys((prevState) => prevState.filter((ak) => ak.uuid != apiKey.uuid));
  };

  const renderApiKeys = () => {
    return apiKeys.map((apiKey) => (
      <ApiKeyCard key={apiKey.uuid} apiKey={apiKey} onRevoke={handleApiKeyRevokeConfirm} />
    ));
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Grid container className={classes.pageWrapper}>
          <Grid item xs={12} md={12}>
            <Card className={classes.cardRoot}>
              <CardContent>
                <Grid container className={classes.header}>
                  <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h4" className={classes.pageTitle}>
                        Manage your API Keys
                      </Typography>
                      <Button variant="contained" color="success" onClick={handleApiKeyDialogOpen}>
                        Create new API key
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {!isLoading && !isEmpty(apiKeys) && (
            <Grid item xs={12} className={classes.apikeysContainer}>
              <Card className={classes.cardRoot}>
                <CardContent className={classes.apikeysContent}>
                  <Stack direction="column" spacing={1}>
                    {renderApiKeys()}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}
          <ApiKeyDialog open={apiKeyDialogOpen} setOpen={setApiKeyDialogOpen} onConfirm={handleApiKeyCreateConfirm} />
          {!isNil(newApiKey) && (
            <ApiKeyConfirmDialog open={apiKeyConfirmationOpen} setOpen={setApiKeyConfirmationOpen} apiKey={newApiKey} />
          )}
        </Grid>
      )}
    </>
  );
}

export default ApiKeys;
