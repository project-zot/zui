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

//icons
import GppBadOutlinedIcon from '@mui/icons-material/GppBadOutlined';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';

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
    background: '#FFFFFF',
    borderColor: '#FFFFFF',
    borderRadius: '1.5rem',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%',
    maxWidth: '72rem'
  },
  avatar: {
    height: '1.4375rem',
    width: '1.4375rem'
  },
  cardBtn: {
    height: '100%',
    width: '100%'
  },
  media: {
    borderRadius: '3.125rem'
  },
  content: {
    textAlign: 'left',
    color: '#606060',
    maxHeight: '9.25rem'
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
    maxWidth: '40%'
  }
}));

function RepoCard(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const { name, vendor, platforms, description, downloads, isSigned, lastUpdated, version } = props;

  //function that returns a random element from an array
  // function getRandom(list) {
  //   return list[Math.floor(Math.random() * list.length)];
  // }

  const goToDetails = () => {
    navigate(`/image/${encodeURIComponent(name)}`);
  };

  // const vulnerabilityCheck = () => {
  //   const noneVulnerability = <Chip label="None Vulnerability" sx={{backgroundColor: "#E8F5E9",color: "#388E3C",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <PestControlOutlinedIcon sx={{ color: "#388E3C!important" }} />}/>;
  //   const unknownVulnerability = <Chip label="Unknown Vulnerability" sx={{backgroundColor: "#ECEFF1",color: "#52637A",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <PestControlOutlinedIcon sx={{ color: "#52637A!important" }} />}/>;
  //   const lowVulnerability = <Chip label="Low Vulnerability" sx={{backgroundColor: "#FFF3E0",color: "#FB8C00",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <PestControlOutlinedIcon sx={{ color: "#FB8C00!important" }} />}/>;
  //   const mediumVulnerability = <Chip label="Medium Vulnerability" sx={{backgroundColor: "#FFF3E0",color: "#FB8C00",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <PestControlIcon sx={{ color: "#FB8C00!important" }} />}/>;
  //   const highVulnerability = <Chip label="High Vulnerability" sx={{backgroundColor: "#FEEBEE",color: "#E53935",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <PestControlOutlinedIcon sx={{ color: "#E53935!important" }} />}/>;
  //   const criticalVulnerability = <Chip label="Critical Vulnerability" sx={{backgroundColor: "#FEEBEE",color: "#E53935",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <PestControlIcon sx={{ color: "#E53935!important" }} />}/>;

  //   const arrVulnerability = [noneVulnerability, unknownVulnerability, lowVulnerability, mediumVulnerability, highVulnerability, criticalVulnerability]
  //   return(getRandom(arrVulnerability));
  // };

  const signatureCheck = () => {
    const unverifiedSignature = (
      <Chip
        label="Unverified Signature"
        sx={{ backgroundColor: '#FEEBEE', color: '#E53935', fontSize: '0.8125rem' }}
        variant="filled"
        onDelete={() => {
          return;
        }}
        deleteIcon={<GppBadOutlinedIcon sx={{ color: '#E53935!important' }} />}
        data-testid="unverified-chip"
      />
    );
    //const untrustedSignature = <Chip label="Untrusted Signature" sx={{backgroundColor: "#ECEFF1",color: "#52637A",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <GppMaybeOutlinedIcon sx={{ color: "#52637A!important" }} />}/>;
    const verifiedSignature = (
      <Chip
        label="Verified Signature"
        sx={{ backgroundColor: '#E8F5E9', color: '#388E3C', fontSize: '0.8125rem' }}
        variant="filled"
        onDelete={() => {
          return;
        }}
        deleteIcon={<GppGoodOutlinedIcon sx={{ color: '#388E3C!important' }} />}
        data-testid="verified-chip"
      />
    );
    if (isSigned) {
      return verifiedSignature;
    } else {
      return unverifiedSignature;
    }
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
    return `${lastDate.toRelative({ unit: 'days' })}`;
  };

  return (
    <Card variant="outlined" className={classes.card}>
      <CardActionArea onClick={() => goToDetails()} className={classes.cardBtn}>
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
                  image={randomImage()}
                  alt="icon"
                />
                <Tooltip title={name} placement="top">
                  <Typography variant="h5" component="div" noWrap className={classes.cardTitle}>
                    {name}
                  </Typography>
                </Tooltip>
                {/* {vulnerabilityCheck()} */}
                {signatureCheck()}
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
                    {getVendor()}
                  </Typography>
                </Tooltip>
                <Tooltip title={getVersion()} placement="top">
                  <Typography className={classes.versionLast} variant="body2" noWrap>
                    {getVersion()}
                  </Typography>
                </Tooltip>
                <Tooltip title={getLast()} placement="top">
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
