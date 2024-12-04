import React from 'react';
import { useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import logoWhite from '../../assets/zotLogoWhiteHorizontal.svg';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.secondary.main,
    minHeight: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentContainer: {
    width: '51%',
    height: '22%'
  },
  logoContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  logo: {
    width: '64%'
  },
  mainText: {
    color: '#F6F7F9',
    fontWeight: '700',
    width: '100%',
    fontSize: '2.5rem',
    lineHeight: '3rem'
  }
}));

export default function SigninPresentation() {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.container}>
      <Stack spacing={'3rem'} className={classes.contentContainer} data-testid="presentation-container">
        <div className={classes.logoContainer}>
          <img src={logoWhite} alt="zot logo" className={classes.logo}></img>
        </div>
        <Typography variant="h2" className={classes.mainText}>
          {t('signInPresentation.description')}
        </Typography>
      </Stack>
    </div>
  );
}
