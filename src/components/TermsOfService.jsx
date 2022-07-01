import React from 'react';


import { makeStyles } from '@mui/styles';
import { Typography } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  subtext: {
    color: "#00000099",
  }
}));

export default function TermsOfService(props) {
  const classes = useStyles();
  return (
    <Typography variant="caption" className={classes.subtext} align="center" {...props}>
      By creating an account, you agree to the Terms of Service. For more information about our privacy practices, see the zot's Privacy Policy.
    </Typography>
  );
}

