// react global
import React from 'react';
import { useNavigate } from 'react-router-dom';

// utility
import { DateTime } from 'luxon';
// components
import { Card, CardActionArea, CardMedia, CardContent, Typography, Stack, Chip, Grid, Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

// placeholder images
import repocube1 from '../assets/repocube-1.png';
import repocube2 from '../assets/repocube-2.png';
import repocube3 from '../assets/repocube-3.png';
import repocube4 from '../assets/repocube-4.png';

import { VulnerabilityIconCheck, SignatureIconCheck } from 'utilities/vulnerabilityAndSignatureCheck';
import { Markdown } from 'utilities/MarkdowntojsxWrapper';
import { isEmpty } from 'lodash';

// temporary utility to get image
const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomImage = () => {
  const imageArray = [repocube1, repocube2, repocube3, repocube4];
  return imageArray[randomIntFromInterval(0, 3)];
};

const useStyles = makeStyles(() => ({
  card: {
    marginBottom: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
    borderRadius: '1.5rem',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%',
    maxWidth: '72rem',
    '&:hover': {
      boxShadow: '0rem 1.1875rem 1.4375rem rgba(131, 131, 131, 0.19)',
      borderRadius: '1.5rem'
    }
  },
  avatar: {
    height: '1.4375rem',
    width: '1.4375rem',
    objectFit: 'fill'
  },
  cardBtn: {
    height: '100%',
    width: '100%',
    borderRadius: '1.5rem',
    borderColor: '#FFFFFF',
    '&:hover $focusHighlight': {
      opacity: 0
    }
  },
  focusHighlight: {},
  media: {
    borderRadius: '3.125rem'
  },
  content: {
    textAlign: 'left',
    color: '#606060',
    maxHeight: '9.25rem',
    backgroundColor: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#FFFFFF'
    }
  },
  contentRight: {
    height: '100%'
  },
  signedBadge: {
    color: '#9ccc65',
    height: '1.375rem',
    width: '1.375rem',
    marginLeft: 10
  },
  vendor: {
    color: '#14191F',
    fontSize: '1rem',
    maxWidth: '50%',
    textOverflow: 'ellipsis'
  },
  versionLast: {
    color: '#52637A',
    fontSize: '1rem',
    textOverflow: 'ellipsis'
  },
  cardTitle: {
    textOverflow: 'ellipsis',
    maxWidth: '70%'
  }
}));

function RepoCard(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const { name, vendor, platforms, description, downloads, isSigned, lastUpdated, logo, version, vulnerabilityData } =
    props;

  const goToDetails = () => {
    navigate(`/image/${encodeURIComponent(name)}`);
  };

  const platformChips = () => {
    // if platforms not received, mock data
    const platformsOsArch = platforms || [];
    return platformsOsArch.map((platform, index) => (
      <Stack key={`stack${platform?.Os}${platform?.Arch}`} alignItems="center" direction="row" spacing={2}>
        <Chip
          key={`${name}${platform?.Os}${index}`}
          label={platform?.Os}
          sx={{
            backgroundColor: '#E0E5EB',
            color: '#52637A',
            fontSize: '0.8125rem'
          }}
        />
        <Chip
          key={`${name}${platform?.Arch}${index}`}
          label={platform?.Arch}
          sx={{
            backgroundColor: '#E0E5EB',
            color: '#52637A',
            fontSize: '0.8125rem'
          }}
        />
      </Stack>
    ));
  };

  const getVendor = () => {
    return `${vendor || 'Vendor not available'} •`;
  };
  const getVersion = () => {
    return `published ${version} •`;
  };
  const getLast = () => {
    const lastDate = lastUpdated ? DateTime.fromISO(lastUpdated) : DateTime.now().minus({ days: 1 });
    return `${lastDate.toRelative({ unit: ['weeks', 'days', 'hours', 'minutes'] })}`;
  };

  return (
    <Card variant="outlined" className={classes.card}>
      <CardActionArea
        onClick={() => goToDetails()}
        classes={{
          root: classes.cardBtn,
          focusHighlight: classes.focusHighlight
        }}
      >
        <CardContent className={classes.content}>
          <Grid container>
            <Grid item xs={10}>
              <Stack alignItems="center" direction="row" spacing={2}>
                <CardMedia
                  classes={{
                    root: classes.media,
                    img: classes.avatar
                  }}
                  component="img"
                  image={!isEmpty(logo) ? `data:image/png;base64, ${logo}` : randomImage()}
                  alt="icon"
                />
                <Tooltip title={name} placement="top">
                  <Typography variant="h5" component="div" noWrap className={classes.cardTitle}>
                    {name}
                  </Typography>
                </Tooltip>
                <VulnerabilityIconCheck {...vulnerabilityData} />
                <SignatureIconCheck isSigned={isSigned} />
                {/* <Chip label="Verified licensee" sx={{ backgroundColor: "#E8F5E9", color: "#388E3C" }} variant="filled" onDelete={() => { return }} deleteIcon={vulnerabilityCheck()} /> */}
              </Stack>
              <Tooltip title={description || 'Description not available'} placement="top">
                <Typography className={classes.versionLast} pt={1} sx={{ fontSize: 12 }} gutterBottom noWrap>
                  {description || 'Description not available'}
                </Typography>
              </Tooltip>
              <Stack alignItems="center" direction="row" spacing={2} pt={1}>
                {platformChips()}
              </Stack>
              <Stack alignItems="center" direction="row" spacing={1} pt={2}>
                <Tooltip title={getVendor()} placement="top">
                  <Typography className={classes.vendor} variant="body2" noWrap>
                    {<Markdown options={{ forceInline: true }}>{getVendor()}</Markdown>}
                  </Typography>
                </Tooltip>
                <Tooltip title={getVersion()} placement="top">
                  <Typography className={classes.versionLast} variant="body2" noWrap>
                    {getVersion()}
                  </Typography>
                </Tooltip>
                <Tooltip title={lastUpdated?.slice(0, 16) || ' '} placement="top">
                  <Typography className={classes.versionLast} variant="body2" noWrap>
                    {getLast()}
                  </Typography>
                </Tooltip>
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack
                alignItems="flex-end"
                justifyContent="space-between"
                direction="column"
                className={classes.contentRight}
              >
                <Stack direction="column" alignItems="flex-end">
                  <Typography variant="body2">Downloads • {!isNaN(downloads) ? downloads : `not available`}</Typography>
                  {/* <Typography variant="body2">Rating • {rating || '-'}</Typography> */}
                </Stack>
                {/* <BookmarkIcon sx={{color:"#52637A"}}/> */}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default RepoCard;
