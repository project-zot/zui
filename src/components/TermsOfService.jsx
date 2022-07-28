import React from 'react';


import { makeStyles } from '@mui/styles';
import { Stack, Typography } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  subtext: {
    color: "rgba(0, 0, 0, 0.6)",
    margin: 0,
    fontSize:"12px",
    lineHeight:"166%",
    letterSpacing:"0.4px"
  }
}));

export default function TermsOfService(props) {
  const classes = useStyles();
  return (
    <Stack spacing={0}>
      <Typography variant="caption" className={classes.subtext} align="justify" {...props} pb={6}>
        By creating an account, you agree to the Terms of Service. For more information about our privacy practices, see the zot's Privacy Policy.
      </Typography>
      <Typography variant="caption" className={classes.subtext} align="center" {...props}>
        Privacy Policy | Terms of Service
      </Typography>
    </Stack>
  );
}

