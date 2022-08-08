import { Card, CardContent, Grid, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import transform from '../utilities/transform';

const useStyles = makeStyles(() => ({
  card: {
    marginBottom: 2,
    display:"flex",
    flexDirection:"row",
    alignItems:"start",
    background:"#FFFFFF",
    boxShadow:"0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)",
    borderRadius:"1.5rem",
    flex:"none",
    alignSelf:"stretch",
    flexGrow:0,
    order:0,
    width:"100%"
  },
  metadataHeader: {
    color: "rgba(0, 0, 0, 0.6)"
  },
  metadataBody: {
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: 'Roboto',
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "1rem",
    lineHeight: "150%",
    align:"left"
  }
}));

function RepoDetailsMetadata (props) {
  const classes = useStyles();
  const {name, repoURL, weeklyDownloads, lastUpdated, size, filesNr, latestTag, issues, prs} = props;

  return (
    <Grid container spacing={1}>
      <Grid container item xs={12}>
          <Card variant="outlined" className={classes.card}>
            <CardContent>
              <Typography variant="body2" align="left" className={classes.metadataHeader}>Repository</Typography>
              <Typography variant="body1" className={classes.metadataBody}>{repoURL || `----`}</Typography>
            </CardContent>
          </Card>
      </Grid>
      <Grid container item xs={12}>
        <Card variant="outlined" className={classes.card}>
          <CardContent>
            <Typography variant="body2" align="left" className={classes.metadataHeader}>Weekly downloads</Typography>
            <Typography variant="body1" align="left" className={classes.metadataBody}>{weeklyDownloads || `----`}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={6}>
          <Card variant="outlined" className={classes.card}>
            <CardContent>
              <Typography variant="body2" align="left" className={classes.metadataHeader}>Last publish</Typography>
              <Typography variant="body1" className={classes.metadataBody}>{lastUpdated || `35 days ago`}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card variant="outlined" className={classes.card}>
            <CardContent>
              <Typography variant="body2" align="left" className={classes.metadataHeader}>Image size</Typography>
              <Typography variant="body1" className={classes.metadataBody}>{transform.formatBytes(size) || `----`}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={6}>
          <Card variant="outlined" className={classes.card}>
            <CardContent>
              <Typography variant="body2" align="left" className={classes.metadataHeader}>Last publish</Typography>
              <Typography variant="body1" className={classes.metadataBody}>{lastUpdated || `----`}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card variant="outlined" className={classes.card}>
            <CardContent>
              <Typography variant="body2" align="left" className={classes.metadataHeader}>Image size</Typography>
              <Typography variant="body1" className={classes.metadataBody}>{size || `----`}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={6}>
          <Card variant="outlined" className={classes.card}>
            <CardContent>
              <Typography variant="body2" align="left" className={classes.metadataHeader}>Files</Typography>
              <Typography variant="body1" align="left" className={classes.metadataBody}>{filesNr || `----`}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card variant="outlined" className={classes.card}>
            <CardContent>
              <Typography variant="body2" align="left" className={classes.metadataHeader}>Latest tag</Typography>
              <Typography variant="body1" align="left" className={classes.metadataBody}>{latestTag || `----`}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={6}>
          <Card variant="outlined" className={classes.card}>
            <CardContent>
              <Typography variant="body2" align="left" className={classes.metadataHeader}>Issues</Typography>
              <Typography variant="body1" align="left" className={classes.metadataBody}>{issues || `----`}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card variant="outlined" className={classes.card}>
            <CardContent>
              <Typography variant="body2" align="left" className={classes.metadataHeader}>Pull requests</Typography>
              <Typography variant="body1" align="left" className={classes.metadataBody}>{prs || `----`}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default RepoDetailsMetadata;