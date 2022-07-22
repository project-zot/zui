import {Stack, Typography } from '@mui/material';
import {makeStyles} from '@mui/styles';
import React from 'react';
import logoWhite from '../assets/zot-white.png';
import loginDrawing from '../assets/login-drawing.svg';

const useStyles = makeStyles(() => ({
  container: {
    background:"linear-gradient(149.91deg, #7A4C75 14.36%, #9A6094 116.3%)",
    minHeight: "100%",
    alignItems:"center",
  },
  logo: {
    maxHeight:128,
    maxWidth: 138,
    marginTop:"17%"
  },
  loginDrawing: {
    maxHeight:298,
    maxWidth:464,
    marginTop:"4%"
  },
  mainText: {
    color: "#FFFFFF",
    fontWeight: 700,
    maxWidth:"45%",
    marginTop:"4%"
  },
  captionText: {
    color: "rgba(255, 255, 255, 0.7)",
    maxWidth:"48%",
    marginTop:"2%"
  }
}));

export default function SigninPresentation(props) {
  const classes = useStyles();
  return (
    <Stack spacing={0} className={classes.container} >
      <img src={logoWhite} alt="zot logo" className={classes.logo}></img>
      <Typography variant="h2" className={classes.mainText}>
        Welcome to our repository
      </Typography>
      <Typography variant="body1" className={classes.captionText}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet, dis pellentesque posuere nulla tortor ac eu arcu nunc.
      </Typography>
      <img src={loginDrawing} alt="drawing" className={classes.loginDrawing}></img>
    </Stack>
  );
}