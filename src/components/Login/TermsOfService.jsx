import React from 'react';

import { makeStyles } from '@mui/styles';
import { Stack, Typography } from '@mui/material';

const useStyles = makeStyles(() => ({
  subtext: {
    color: '#52637A',
    fontSize: '0.8125rem',
    fontWeight: '400',
    lineHeight: '154%',
    letterSpacing: '0.025rem',
    marginBottom: '0'
  },
  text: {
    color: '#0F2139',
    fontSize: '0.8125rem',
    lineHeight: '154%',
    fontWeight: '600',
    letterSpacing: '0.025rem'
  }
}));

export default function TermsOfService(props) {
  const classes = useStyles();
  return (
    <Stack spacing={0}>
      <Typography variant="caption" className={classes.subtext} align="justify" {...props} pb={6}>
        By creating an account, you agree to the Terms of Service. For more information about our privacy practices, see
        the ZOT&apos;s Privacy Policy.
      </Typography>
      <Typography variant="caption" className={classes.text} align="center" {...props}>
        Privacy Policy | Terms of Service
      </Typography>
    </Stack>
  );
}
