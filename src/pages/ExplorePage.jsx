// components
import React from 'react';
import Header from '../components/Header.jsx';

import makeStyles from '@mui/styles/makeStyles';
import { Container, Grid, Stack } from '@mui/material';
import Explore from 'components/Explore.jsx';

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

function ExplorePage({ data, updateData }) {
  const classes = useStyles();

  return (
    <Stack className={classes.pageWrapper} direction="column" data-testid="explore-container">
      <Header updateData={updateData} />
      <Container className={classes.container}>
        <Grid container className={classes.gridWrapper}>
          <Grid item className={classes.tile}>
            <Explore data={data} updateData={updateData} />
          </Grid>
        </Grid>
      </Container>
    </Stack>
  );
}

export default ExplorePage;
