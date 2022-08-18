import { Card, CardActionArea, CardContent, CardMedia, Grid, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

// placeholder images
import repocube1 from '../assets/repocube-1.png';
import repocube2 from '../assets/repocube-2.png';
import repocube3 from '../assets/repocube-3.png';
import repocube4 from '../assets/repocube-4.png';

// temporary utility to get image
const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
};

const randomImage = () => {
  const imageArray = [repocube1, repocube2, repocube3, repocube4];
  return imageArray[randomIntFromInterval(0, 3)];
};

const useStyles = makeStyles(() => ({
  card: {
    marginBottom: 2,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    background: "#FFFFFF",
    boxShadow: "0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)",
    borderRadius: "1.5rem",
    flex: "none",
    alignSelf: "stretch",
    flexGrow: 0,
    order: 0,
    width: "100%",
    maxWidth:"16.875rem",
    maxHeight:"8.625rem"
  },
  avatar: {
    height: "1.4375rem",
    width: "1.4375rem"
  },
  cardBtn: {
    height: "100%",
    width: "100%"
  },
  media: {
    borderRadius: '3.125rem',
  },
  content: {
    textAlign: "left",
    color: "#606060",
  },
  signedBadge: {
    color: '#9ccc65',
    height: '1.375rem',
    width: '1.375rem',
    marginLeft: 10,
  }
}));

function PreviewCard(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const { name } = props;

  const goToDetails = (repo) => {
    navigate(`/image/${name}`);
  };

  const verifiedCheck = () => {
    return (<CheckCircleOutlineOutlinedIcon sx={{ color: "#388E3C!important", height:"2rem", width:"2rem" }} />);
  }

  return (
    <Card variant="outlined" className={classes.card}>
      <CardActionArea onClick={() => goToDetails()} className={classes.cardBtn}>
        <CardContent className={classes.content}>
          <Grid container spacing={1}>
            <Grid container item xs={12}>
              <Stack direction="row" spacing={3} sx={{display:"flex",alignItems:"center", flexWrap:"wrap"}}>
                <CardMedia classes={{
                  root: classes.media,
                  img: classes.avatar,
                }}
                  component="img"
                  image={randomImage()}
                  alt="icon"
                />
                <Typography variant="h5" component="div" sx={{size:"1.5rem", lineHeight:"2rem", color:"#220052"}}>
                  {name}
                </Typography>
                {verifiedCheck()}
              </Stack>
            </Grid>
            <Grid container item xs={12} mt={2}>
              <Typography variant="body2" sx={{fontSize:"0.875rem", lineHeight:"143%", letterSpacing:"0.010625rem"}}>Official*PH</Typography>
            </Grid>
            <Grid container item xs={12}>
            </Grid>
            <Grid container item xs={12}>
              <Typography variant="subtitle2" sx={{ color: "#7C4DFF" }}>Discover more</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PreviewCard;