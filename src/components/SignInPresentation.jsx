import {Stack, Typography } from '@mui/material';
import {makeStyles} from '@mui/styles';
import React from 'react';
import logoWhite from '../assets/zot-white.png'

const useStyles = makeStyles(() => ({
  container: {
    background:"#A53692",
    minHeight: "100%"
  },
  logo: {
    maxHeight:128,
    maxWidth: 138
  },
  mainText: {
    color: "#FFFFFF",
    fontWeight: 700
  },
  captionText: {
    color: "#383838",
  }
}));

export default function SigninPresentation(props) {
  const classes = useStyles();
  return (
    <Stack spacing={0} className={classes.container} alignItems="center" justifyContent="center">
      <img src={logoWhite} alt="zot logo" className={classes.logo}></img>
      <Typography variant="h2" className={classes.mainText}>
        Welcome to our repository
      </Typography>
      <Typography variant="caption" className={classes.captionText}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet, dis pellentesque posuere nulla tortor ac eu arcu nunc.
      </Typography>
      
    </Stack>
  );
}