// react global
import React from 'react';

// components

import makeStyles from '@mui/styles/makeStyles';
import { Container, Grid, Stack } from '@mui/material';
import Header from 'components/Header/Header';
import RepoDetails from 'components/Repo/RepoDetails';
import ExploreHeader from 'components/Header/ExploreHeader';

const useStyles = makeStyles(() => ({
  pageWrapper: {
    height: '100%',
    display: 'flex',
    flexFlow: 'column'
  },
  container: {
    paddingTop: 5,
    paddingBottom: 5,
    display: 'flex',
    flexFlow: 'column',
    height: '100%'
  },
  parentWrapper: {
    height: '100vh'
  },
  gridWrapper: {
    backgroundColor: 'transparent',
    width: '100%',
    display: 'flex',
    flexFlow: 'column',
    height: '100%'
  }
}));

function RepoPage() {
  const classes = useStyles();

  return (
    <Stack direction="column" className={classes.pageWrapper} data-testid="repo-container">
      <Header />
      <Container className={classes.container}>
        <ExploreHeader />
        <Grid container className={classes.gridWrapper}>
          <Grid item xs={12}>
            <RepoDetails />
          </Grid>
        </Grid>
      </Container>
    </Stack>
  );
}

export default RepoPage;
