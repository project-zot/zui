import { Card, CardActionArea, CardContent, CardMedia, Grid, Stack, Tooltip, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useNavigate } from 'react-router-dom';

// placeholder images
import repocube1 from '../../assets/repocube-1.png';
import repocube2 from '../../assets/repocube-2.png';
import repocube3 from '../../assets/repocube-3.png';
import repocube4 from '../../assets/repocube-4.png';

import { isEmpty } from 'lodash';
import { VulnerabilityIconCheck, SignatureIconCheck } from 'utilities/vulnerabilityAndSignatureCheck';

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
  const { name, isSigned, vulnerabilityData, logo } = props;

  const goToDetails = () => {
    navigate(`/image/${encodeURIComponent(name)}`);
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
                  <VulnerabilityIconCheck {...vulnerabilityData} />
                  <SignatureIconCheck isSigned={isSigned} />
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
