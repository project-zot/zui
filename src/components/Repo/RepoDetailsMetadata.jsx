import { Card, CardContent, Grid, Typography, Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { DateTime } from 'luxon';
import { Markdown } from 'utilities/MarkdowntojsxWrapper';
import React from 'react';
import transform from '../../utilities/transform';

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    background: '#FFFFFF',
    border: '0',
    borderRadius: '0.5rem',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%'
  },
  cardContent: {
    '&:last-child': {
      padding: '0.5rem 1rem'
    }
  },
  metadataHeader: {
    color: theme.palette.secondary.dark,
    fontSize: '0.75rem',
    lineHeight: '1.125rem'
  },
  metadataBody: {
    color: theme.palette.primary.main,
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: '150%',
    align: 'left'
  }
}));

function RepoDetailsMetadata(props) {
  const classes = useStyles();
  const { repoURL, totalDownloads, lastUpdated, size, license, description } = props;

  const lastDate = lastUpdated
    ? DateTime.fromISO(lastUpdated).toRelative({ unit: ['weeks', 'days', 'hours', 'minutes'] })
    : `Timestamp N/A`;
  return (
    <Grid container spacing={1}>
      <Grid container item xs={12}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="body2" align="left" className={classes.metadataHeader}>
              Repository
            </Typography>
            <Typography variant="body1" align="left" className={classes.metadataBody}>
              {repoURL || `not available`}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid container item xs={12}>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="body2" align="left" className={classes.metadataHeader}>
              Total downloads
            </Typography>
            <Typography variant="body1" align="left" className={classes.metadataBody}>
              {!isNaN(totalDownloads) ? totalDownloads : `not available`}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={6}>
          <Card variant="outlined" className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography variant="body2" align="left" className={classes.metadataHeader}>
                Last publish
              </Typography>
              <Tooltip title={lastUpdated?.slice(0, 16) || ' '} placement="top">
                <Typography variant="body1" align="left" className={classes.metadataBody}>
                  {lastDate}
                </Typography>
              </Tooltip>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card variant="outlined" className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography variant="body2" align="left" className={classes.metadataHeader}>
                Total size
              </Typography>
              <Typography variant="body1" align="left" className={classes.metadataBody}>
                {transform.formatBytes(size) || `----`}
              </Typography>
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
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12}>
          <Card variant="outlined" className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography variant="body2" align="left" className={classes.metadataHeader}>
                Description
              </Typography>
              <Typography variant="body1" align="left" className={classes.metadataBody}>
                {description ? <Markdown>{description}</Markdown> : `Description not available`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default RepoDetailsMetadata;
