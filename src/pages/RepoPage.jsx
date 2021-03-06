// react global
import React from 'react';

// components

import makeStyles from '@mui/styles/makeStyles';
import { Container, Grid, Stack } from '@mui/material';
import Header from 'components/Header';
import RepoDetails from 'components/RepoDetails';
import ExploreHeader from 'components/ExploreHeader';

const useStyles = makeStyles((theme) => ({
  pageWrapper: {
    backgroundColor: "#FFFFFF",
  },
  container: {
      paddingTop: 5,
      paddingBottom: 5,
      backgroundColor: "#FFFFFF",
  },
  parentWrapper: {
      height: '100vh',
  },
  gridWrapper: {
      paddingTop: 10,
      paddingBottom: 10,
      backgroundColor: "#fff",
      width:"100%",
  },
}));

function RepoPage(props) {
  const classes = useStyles();

  return (
        <Stack direction="column" className={classes.pageWrapper}>
          <Header updateKeywords={props.updateKeywords}></Header>
          <Container className={classes.container} >
            <ExploreHeader/>
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
