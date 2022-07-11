import { Card, CardActionArea, CardContent, CardMedia, Chip, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DateTime } from 'luxon';
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
  const imageArray = [repocube1,repocube2,repocube3,repocube4];
  return imageArray[randomIntFromInterval(0,3)];
};

const useStyles = makeStyles(() => ({
  card: {
      marginBottom: 2,
      display:"flex",
      flexDirection:"row",
      alignItems:"center",
      background:"#FFFFFF",
      boxShadow:"0px 5px 10px rgba(131, 131, 131, 0.08)",
      borderRadius:"24px",
      flex:"none",
      alignSelf:"stretch",
      flexGrow:0,
      order:0,
      width:"100%",
  },
  avatar: {
      height:"23px",
      width:"23px"
  },
  cardBtn: {
    height: "100%",
    width: "100%"
  },
  media: {
    borderRadius: '50px',
  },
  content: {
     textAlign: "left",
     color: "#606060",
  },
  signedBadge: {
    color: '#9ccc65',
    height: '22px',
    width: '22px',
    marginLeft: 10,
  }
}));

function RepoCard(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const {name, lastUpdated} = props;

  const goToDetails = (repo) => {
    navigate(`/image/${name}`, {state: {lastDate: (lastUpdated? DateTime.fromISO(lastUpdated) : DateTime.now().minus({days:1})).toRelative({unit:'days'})}});
  };

  const verifiedCheck = () => {
    return (<CheckCircleOutlineOutlinedIcon sx={{color:"#388E3C!important"}}/>);
  }

  return (
    <Card variant="outlined" className={classes.card}>
        <CardActionArea onClick={() => goToDetails()} className={classes.cardBtn}>
            <CardContent className={classes.content}>
              <Grid container spacing={1}>
                <Grid container item xs={12}>
                  <CardMedia classes={{
                      root: classes.media,
                      img: classes.avatar,
                  }}
                    component="img"
                    image={randomImage()}
                    alt="icon"
                  />
                  <Typography variant="h5" component="div">
                    {name}
                  </Typography>
                  {verifiedCheck()}
                </Grid>
                <Grid container item xs={12}>
                  <Typography variant="body2">Official*PH</Typography>
                </Grid>
                <Grid container item xs={12}>
                </Grid>
                <Grid container item xs={12}>
                  <Typography variant="subtitle2" sx={{color:"#7C4DFF"}}>Discover more</Typography>
                </Grid>
              </Grid>
            </CardContent>
        </CardActionArea>
    </Card>
  );
};

export default RepoCard;