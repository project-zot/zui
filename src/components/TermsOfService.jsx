import React from 'react';


import { makeStyles } from '@mui/styles';
import { Stack, Typography } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  subtext: {
    color: "#00000099",
    margin: 0
  }
}));

export default function TermsOfService(props) {
  const classes = useStyles();
  return (
    <Stack spacing={0}>
      <Typography variant="caption" className={classes.subtext} align="center" {...props} pb={6}>
        By creating an account, you agree to the Terms of Service. For more information about our privacy practices, see the zot's Privacy Policy.
      </Typography>
      <Typography variant="caption" className={classes.subtext} align="center" {...props}>
        Privacy Policy | Terms of Service
      </Typography>
    </Stack>
  );
}

