import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash';

import { getLoggedInUser } from 'utilities/authUtilities.js';

import { Container, Grid, Stack } from '@mui/material';

import Header from '../components/Header/Header.jsx';
import ApiKeys from '../components/User/ApiKeys/ApiKeys.jsx';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  container: {
    paddingTop: 30,
    paddingBottom: 5,
    height: '100%',
    minWidth: '60%'
  },
  gridWrapper: {
    border: '0.0625rem #f2f2f2 dashed'
  },
  pageWrapper: {
    height: '100%'
  },
  tile: {
    width: '100%',
    padding: 5
  }
}));

function UserManagementPage() {
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEmpty(getLoggedInUser())) {
      navigate('/home');
    }
  }, []);

  return (
    <Stack className={classes.pageWrapper} direction="column" data-testid="explore-container">
      <Header />
      <Container className={classes.container}>
        <Grid container className={classes.gridWrapper}>
          <Grid item className={classes.tile}>
            <ApiKeys />
          </Grid>
        </Grid>
      </Container>
    </Stack>
  );
}

export default UserManagementPage;
