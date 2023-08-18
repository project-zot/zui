// react global
import React from 'react';

// components
import { Stack, Typography } from '@mui/material';

//styling
import makeStyles from '@mui/styles/makeStyles';

import nodataImage from '../../assets/noData.svg';

const useStyles = makeStyles((theme) => ({
  noDataContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  noDataImage: {
    maxWidth: '233px',
    maxHeight: '240px'
  },
  noDataText: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: theme.palette.secondary.main
  }
}));

function NoDataComponent({ text }) {
  const classes = useStyles();

  return (
    <Stack className={classes.noDataContainer}>
      <img src={nodataImage} className={classes.noDataImage} />
      <Typography className={classes.noDataText}>{text ? text : 'No Data'}</Typography>
    </Stack>
  );
}

export default NoDataComponent;
