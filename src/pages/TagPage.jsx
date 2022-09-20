// react global
import React from 'react';

// components

import makeStyles from '@mui/styles/makeStyles';
import { Container, Grid, Stack, Typography } from '@mui/material';
import Header from 'components/Header';
import TagDetails from 'components/TagDetails';
import ExploreHeader from 'components/ExploreHeader';

const useStyles = makeStyles((theme) => ({
  pageWrapper: {
    height:"100%"
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

function TagPage(props) {
  const classes = useStyles();

  return (
        <Stack direction="column" className={classes.pageWrapper} data-testid='tag-container'>
          <Header updateKeywords={props.updateKeywords}></Header>
          <Container className={classes.container} >
            <ExploreHeader/>
            <Grid container className={classes.gridWrapper}>
                <Grid item xs={12}>
                  <TagDetails/>
                </Grid>
            </Grid>
          </Container>          
        </Stack>
  );
}

export default TagPage;
