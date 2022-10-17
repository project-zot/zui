import { Card, CardContent, Grid, Typography, Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { DateTime } from 'luxon';
import React from 'react';
import transform from '../utilities/transform';

const useStyles = makeStyles(() => ({
  card: {
    marginBottom: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    background: '#FFFFFF',
    boxShadow: '0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)',
    borderRadius: '1.5rem',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%'
  },
  metadataHeader: {
    color: 'rgba(0, 0, 0, 0.6)'
  },
  metadataBody: {
    color: 'rgba(0, 0, 0, 0.87)',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: '150%',
    align: 'left'
  }
}));

function TagDetailsMetadata(props) {
  const classes = useStyles();
  const { platform, lastUpdated, size } = props;
  const lastDate = (lastUpdated ? DateTime.fromISO(lastUpdated) : DateTime.now().minus({ days: 1 })).toRelative({
    unit: ['weeks', 'days', 'hours', 'minutes']
  });
  return (
    <Grid container spacing={1} data-testid="tagDetailsMetadata-container">
      <Grid container item xs={12}>
        <Card variant="outlined" className={classes.card}>
          <CardContent>
            <Typography variant="body2" align="left" className={classes.metadataHeader}>
              OS/Arch
            </Typography>
            <Typography variant="body1" className={classes.metadataBody}>
              {platform?.Os || `----`} / {platform?.Arch || `----`}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid container item xs={12}>
        <Card variant="outlined" className={classes.card}>
          <CardContent>
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
            <CardContent>
              <Typography variant="body2" align="left" className={classes.metadataHeader}>
                Last Published
              </Typography>
              <Tooltip title={lastUpdated?.slice(0, 16) || ' '} placement="top">
                <Typography variant="body1" align="left" className={classes.metadataBody}>
                  {lastDate || `----`}
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
