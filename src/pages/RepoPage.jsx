// react global
import React, { useRef, useEffect } from 'react';

// components

import makeStyles from '@mui/styles/makeStyles';
import { Container, Grid, Stack } from '@mui/material';
import Header from 'components/Header';
import RepoDetails from 'components/RepoDetails';
import ExploreHeader from 'components/ExploreHeader';

import { useInView } from 'react-intersection-observer';

const useStyles = makeStyles(() => ({
  pageWrapper: {
    height: '100%'
  },
  container: {
    paddingTop: 5,
    paddingBottom: 5
  },
  parentWrapper: {
    height: '100vh'
  },
  gridWrapper: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
    width: '100%'
  }
}));

function RepoPage() {
  const classes = useStyles();
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    console.log('Element is in view: ', isInView);
  }, [isInView]);

  return (
    <Stack direction="column" className={classes.pageWrapper} data-testid="repo-container">
      <Header ref={ref} />
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
