// react global
import { Link, useLocation, useNavigate } from 'react-router-dom';
// localization
import { useTranslation } from 'react-i18next';

// components
import { Typography, Breadcrumbs } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// styling

import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

const useStyles = makeStyles((theme) => {
  return {
    exploreHeader: {
      backgroundColor: 'transparent',
      minHeight: 50,
      padding: '2.75rem 0 1.25rem 0',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      [theme.breakpoints.down('md')]: {
        padding: '1rem'
      }
    },
    explore: {
      color: theme.palette.secondary.dark,
      fontSize: '0.813rem',
      fontWeight: '600',
      letterSpacing: '0.009375rem',
      [theme.breakpoints.down('md')]: {
        fontSize: '0.8rem'
      }
    },
    arrowIcon: {
      color: theme.palette.secondary.dark,
      marginRight: '1.75rem',
      fontSize: { xs: '1.5rem', md: '2rem' },
      cursor: 'pointer'
    }
  };
});

function ExploreHeader() {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const pathWithoutImage = path.replace('tag/', '');
  const pathToBeDisplayed = pathWithoutImage.replace('/image/', '');
  const pathHeader = pathToBeDisplayed.replace('/', ' / ').replace(/%2F/g, '/');
  const pathWithTag = path.substring(0, path.lastIndexOf('/'));
  const { t } = useTranslation();

  return (
    <div className={classes.exploreHeader}>
      <ArrowBackIcon className={classes.arrowIcon} onClick={() => navigate(-1)} />
      <Breadcrumbs separator="/" aria-label="breadcrumb">
        <Link to="/">
          <Typography variant="body1" className={classes.explore}>
            {t('exploreHeader.home')}
          </Typography>
        </Link>
        <Link to={pathWithTag.substring(0, pathWithTag.lastIndexOf('/'))}>
          {path.includes('/image/') && (
            <Typography className={classes.explore} variant="body1">
              {pathHeader}
            </Typography>
          )}
        </Link>
      </Breadcrumbs>
      <div></div>
    </div>
  );
}

export default ExploreHeader;
