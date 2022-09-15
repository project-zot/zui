import { Card, CardActionArea, CardContent, CardMedia, Grid, Stack, Typography, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import PestControlOutlinedIcon from '@mui/icons-material/PestControlOutlined';
import PestControlIcon from '@mui/icons-material/PestControl';
import GppBadOutlinedIcon from '@mui/icons-material/GppBadOutlined';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';

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
    borderColor: "#FFFFFF",
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

//function that returns a random element from an array
function getRandom (list) {
  return list[Math.floor((Math.random()*list.length))];
}

function PreviewCard(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const { name } = props;

  const goToDetails = (repo) => {
    navigate(`/image/${name}`);
  };

  const vulnerabilityCheck = () => {
    const noneVulnerability = <PestControlOutlinedIcon sx={{ color: "#43A047!important", padding:"0.2rem", background: "#E8F5E9", borderRadius: "1rem", height:"1.5rem", width:"1.6rem" }} />;
    const unknownVulnerability = <PestControlOutlinedIcon sx={{ color: "#52637A!important", padding:"0.2rem", background: "#ECEFF1", borderRadius: "1rem", height:"1.5rem", width:"1.6rem" }} />;
    const lowVulnerability = <PestControlOutlinedIcon sx={{ color: "#FB8C00!important", padding:"0.2rem", background: "#FFF3E0", borderRadius: "1rem", height:"1.5rem", width:"1.6rem" }} />;
    const mediumVulnerability = <PestControlIcon sx={{ color: "#FB8C00!important", padding:"0.2rem", background: "#FFF3E0", borderRadius: "1rem", height:"1.5rem", width:"1.6rem" }} />;
    const highVulnerability = <PestControlOutlinedIcon sx={{ color: "#E53935!important", padding:"0.2rem", background: "#FEEBEE", borderRadius: "1rem", height:"1.5rem", width:"1.6rem" }} />;
    const criticalVulnerability = <PestControlIcon sx={{ color: "#E53935!important", padding:"0.2rem", background: "#FEEBEE", borderRadius: "1rem", height:"1.5rem", width:"1.6rem" }} />;

    const arrVulnerability = [noneVulnerability, unknownVulnerability, lowVulnerability, mediumVulnerability, highVulnerability, criticalVulnerability]
    return(getRandom(arrVulnerability));
  }

  const SignatureCheck = () => {
    const unverifiedSignature = <GppBadOutlinedIcon sx={{ color: "#E53935!important", padding:"0.2rem", background: "#FEEBEE", borderRadius: "1rem", height:"1.5rem", width:"1.6rem" }} />;
    const untrustedSignature = <GppMaybeOutlinedIcon sx={{ color: "#52637A!important", padding:"0.2rem", background: "#ECEFF1", borderRadius: "1rem", height:"1.5rem", width:"1.6rem" }} />;
    const verifiedSignature = <GppGoodOutlinedIcon sx={{ color: "#43A047!important", padding:"0.2rem", background: "#E8F5E9", borderRadius: "1rem", height:"1.5rem", width:"1.6rem" }} />;

    const arrSignature = [unverifiedSignature, untrustedSignature, verifiedSignature]
    return(getRandom(arrSignature));
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
                {vulnerabilityCheck()}
                {SignatureCheck()}
              </Stack>
            </Grid>
            <Grid item xs={12} mt={2}>
              <Stack alignItems="flex-end" justifyContent="space-between" direction="row">
                <Typography variant="body2" sx={{fontSize:"0.875rem", lineHeight:"143%", letterSpacing:"0.010625rem"}}>Official</Typography>
                <BookmarkBorderOutlinedIcon/>
              </Stack>
            </Grid>
            
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PreviewCard;