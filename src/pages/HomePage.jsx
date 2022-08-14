// components
import React from 'react';
import Header from '../components/Header.jsx'

import makeStyles from '@mui/styles/makeStyles';
import {Container, Grid, Stack} from '@mui/material';
import Home from 'components/Home.jsx';


const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: 30,
        paddingBottom: 5,
        height: '100%',
        minWidth:'60%'
    },
    gridWrapper: {
        // backgroundColor: "#fff",
        border: "0.0625em #f2f2f2 dashed",
    },
    pageWrapper: {
      height:"100%"
    },
    tile: {
      width: '100%',
    }
}));

function HomePage({ data, updateData, keywords, updateKeywords }) {
  const classes = useStyles();

  return (
      <Stack className={classes.pageWrapper} direction="column" data-testid="homepage-container">
        <Header updateKeywords={updateKeywords}></Header>
        <Container className={classes.container} >
            <Grid container className={classes.gridWrapper}>
                <Grid item className={classes.tile}>
                  <Home  keywords={keywords} data={data} updateData={updateData}/>
                </Grid>
            </Grid>
        </Container>
      </Stack>
  );
}

export default HomePage;
