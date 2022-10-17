import { Card, CardActionArea, CardContent, CardMedia, Grid, Stack, Tooltip, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useNavigate } from 'react-router-dom';

// placeholder images
import repocube1 from '../assets/repocube-1.png';
import repocube2 from '../assets/repocube-2.png';
import repocube3 from '../assets/repocube-3.png';
import repocube4 from '../assets/repocube-4.png';

//icons
import GppBadOutlinedIcon from '@mui/icons-material/GppBadOutlined';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import PestControlOutlinedIcon from '@mui/icons-material/PestControlOutlined';
import PestControlIcon from '@mui/icons-material/PestControl';
import { isEmpty } from 'lodash';
//import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';

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
    boxShadow: '0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)',
    borderRadius: '1.5rem',
    borderColor: '#FFFFFF',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%',
    maxWidth: '16.875rem',
    maxHeight: '8.625rem'
  },
  avatar: {
    height: '1.4375rem',
    width: '1.4375rem',
    objectFit: 'fill'
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
    color: '#606060'
  },
  signedBadge: {
    color: '#9ccc65',
    height: '1.375rem',
    width: '1.375rem',
    marginLeft: 10
  }
}));

function PreviewCard(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const { name, isSigned, vulnerabiltySeverity, vulnerabilityCount, logo } = props;

  const goToDetails = () => {
    navigate(`/image/${encodeURIComponent(name)}`);
  };

  const vulnerabilityCheck = () => {
    const noneVulnerability = (
      <PestControlOutlinedIcon
        sx={{
          color: '#43A047!important',
          padding: '0.2rem',
          background: '#E8F5E9',
          borderRadius: '1rem',
          height: '1.5rem',
          width: '1.6rem'
        }}
        data-testid="none-vulnerability-icon"
      />
    );
    const unknownVulnerability = (
      <PestControlOutlinedIcon
        sx={{
          color: '#52637A!important',
          padding: '0.2rem',
          background: '#ECEFF1',
          borderRadius: '1rem',
          height: '1.5rem',
          width: '1.6rem'
        }}
        data-testid="unknown-vulnerability-icon"
      />
    );
    const lowVulnerability = (
      <PestControlOutlinedIcon
        sx={{
          color: '#FB8C00!important',
          padding: '0.2rem',
          background: '#FFF3E0',
          borderRadius: '1rem',
          height: '1.5rem',
          width: '1.6rem'
        }}
        data-testid="low-vulnerability-icon"
      />
    );
    const mediumVulnerability = (
      <PestControlIcon
        sx={{
          color: '#FB8C00!important',
          padding: '0.2rem',
          background: '#FFF3E0',
          borderRadius: '1rem',
          height: '1.5rem',
          width: '1.6rem'
        }}
        data-testid="medium-vulnerability-icon"
      />
    );
    const highVulnerability = (
      <PestControlOutlinedIcon
        sx={{
          color: '#E53935!important',
          padding: '0.2rem',
          background: '#FEEBEE',
          borderRadius: '1rem',
          height: '1.5rem',
          width: '1.6rem'
        }}
        data-testid="high-vulnerability-icon"
      />
    );
    const criticalVulnerability = (
      <PestControlIcon
        sx={{
          color: '#E53935!important',
          padding: '0.2rem',
          background: '#FEEBEE',
          borderRadius: '1rem',
          height: '1.5rem',
          width: '1.6rem'
        }}
        data-testid="critical-vulnerability-icon"
      />
    );

    let result;
    switch (vulnerabiltySeverity) {
      case 'NONE':
        result = noneVulnerability;
        break;
      case 'LOW':
        result = lowVulnerability;
        break;
      case 'MEDIUM':
        result = mediumVulnerability;
        break;
      case 'HIGH':
        result = highVulnerability;
        break;
      case 'CRITICAL':
        result = criticalVulnerability;
        break;
      default:
        result = unknownVulnerability;
    }

    return result;
  };

  const signatureCheck = () => {
    const unverifiedSignature = (
      <GppBadOutlinedIcon
        sx={{
          color: '#E53935!important',
          padding: '0.2rem',
          background: '#FEEBEE',
          borderRadius: '1rem',
          height: '1.5rem',
          width: '1.6rem'
        }}
        data-testid="unverified-icon"
      />
    );
    //const untrustedSignature = <GppMaybeOutlinedIcon sx={{ color: "#52637A!important", padding:"0.2rem", background: "#ECEFF1", borderRadius: "1rem", height:"1.5rem", width:"1.6rem" }} />;
    const verifiedSignature = (
      <GppGoodOutlinedIcon
        sx={{
          color: '#43A047!important',
          padding: '0.2rem',
          background: '#E8F5E9',
          borderRadius: '1rem',
          height: '1.5rem',
          width: '1.6rem'
        }}
        data-testid="verified-icon"
      />
    );
    if (isSigned) {
      return verifiedSignature;
    } else {
      return unverifiedSignature;
    }
  };

  return (
    <Card variant="outlined" className={classes.card}>
      <CardActionArea onClick={() => goToDetails()} className={classes.cardBtn}>
        <CardContent className={classes.content}>
          <Grid container spacing={1}>
            <Grid container item xs={12}>
              <Stack direction="row" spacing={4} sx={{ display: 'flex', alignItems: 'left', flexWrap: 'wrap' }}>
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
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{
                      size: '1.5rem',
                      lineHeight: '2rem',
                      color: '#220052',
                      width: '5rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {name}
                  </Typography>
                </Tooltip>
                <Stack direction="row" spacing={0.5} sx={{ marginLeft: 'auto', marginRight: 0 }}>
                  <Tooltip title={!isNaN(vulnerabilityCount) ? vulnerabilityCount : ''} placement="top">
                    {vulnerabilityCheck()}
                  </Tooltip>
                  {signatureCheck()}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} mt={2}></Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default PreviewCard;
