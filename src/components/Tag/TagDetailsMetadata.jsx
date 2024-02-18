import React from 'react';

import transform from '../../utilities/transform';
import { DateTime } from 'luxon';
import { Markdown } from 'utilities/MarkdowntojsxWrapper';

import { Card, CardContent, Grid, Typography, Tooltip } from '@mui/material';
import PullCommandButton from 'components/Shared/PullCommandButton';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    background: '#FFFFFF',
    borderRadius: '0.5rem',
    borderColor: '#FFFFFF',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%'
  },
  cardContent: {
    padding: '0.5rem 1rem',
    '&:last-child': {
      paddingBottom: '0.5rem'
    }
  },
  metadataHeader: {
    color: theme.palette.secondary.dark
  },
  metadataBody: {
    color: theme.palette.primary.main,
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: '150%',
    align: 'left'
  },
  pullImageContent: {
    padding: '0',
    width: '100%',
    '&:last-child': {
      paddingBottom: '0'
    }
  }
}));

function TagDetailsMetadata(props) {
  const classes = useStyles();
  const { platform, lastUpdated, size, license, imageName } = props;

  const lastDate = lastUpdated
    ? DateTime.fromISO(lastUpdated).toRelative({ unit: ['weeks', 'days', 'hours', 'minutes'] })
    : `Timestamp N/A`;

  return (
    <Grid container spacing={'1rem'} data-testid="tagDetailsMetadata-container">
      <Grid item xs={12} className={`hide-on-mobile`}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={`${classes.cardContent} ${classes.pullImageContent}`}>
            <PullCommandButton imageName={imageName || ''} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="body2" align="left" className={classes.metadataHeader}>
              OS/Arch
            </Typography>
            <Typography variant="body1" className={classes.metadataBody}>
              {platform?.Os || `----`} / {platform?.Arch || `----`}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="body2" align="left" className={classes.metadataHeader}>
              Total Size
            </Typography>
            <Typography variant="body1" align="left" className={classes.metadataBody}>
              {transform.formatBytes(size) || `----`}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12}>
          <Card variant="outlined" className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography variant="body2" align="left" className={classes.metadataHeader}>
                Last Published
              </Typography>
              <Tooltip title={lastUpdated?.slice(0, 16) || ' '} placement="top">
                <Typography variant="body1" align="left" className={classes.metadataBody}>
                  {lastDate}
                </Typography>
              </Tooltip>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12}>
          <Card variant="outlined" className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography variant="body2" align="left" className={classes.metadataHeader}>
                License
              </Typography>
              <Tooltip title={license || ' '} placement="top">
                <Typography variant="body1" align="left" className={classes.metadataBody}>
                  {license ? <Markdown>{license}</Markdown> : `License info not available`}
                </Typography>
              </Tooltip>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default TagDetailsMetadata;
