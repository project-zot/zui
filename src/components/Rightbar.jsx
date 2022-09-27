// components
import { Container } from '@mui/material';
import Explore from './Explore.jsx';

import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

const useStyles = makeStyles(() => ({
  container: {
    padding: 5
  }
}));

function Rightbar({ data, keywords, updateData }) {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Explore keywords={keywords} data={data} updateData={updateData} />
    </Container>
  );
}

export default Rightbar;
