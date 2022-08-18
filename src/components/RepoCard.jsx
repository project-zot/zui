// react global
import React from "react";
import { useNavigate } from "react-router-dom";

// utility
import { DateTime } from 'luxon';
// components
import { Card, CardActionArea, CardMedia, CardContent, Typography, Stack, Chip, Grid } from '@mui/material';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import makeStyles from '@mui/styles/makeStyles';

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
    maxWidth: "72rem"
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
    maxHeight: "9.25rem"
  },
  contentRight: {
    height: "100%"
  },
  signedBadge: {
    color: '#9ccc65',
    height: '1.375rem',
    width: '1.375rem',
    marginLeft: 10,
  }
}));

function RepoCard(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const { name, vendor, description, lastUpdated, downloads, rating, version } = props;

  const goToDetails = (repo) => {
    navigate(`/image/${name}`);
  }

  const verifiedCheck = () => {
    return (<CheckCircleOutlineOutlinedIcon sx={{ color: "#388E3C!important" }} />);
  }

  const platformChips = () => {
    // if platforms not received, mock data
    const platforms = props.platforms || ["Windows", "PowerPC64LE", "IBM Z", "Linux"];
    return platforms.map((platform, index) => (
      <Chip key={index} label={platform} sx={{ backgroundColor: "#EDE7F6", color: "#311B92" }} />
    ));
  }

  const getVendorLastPublish = () => {
    const lastDate = lastUpdated ? DateTime.fromISO(lastUpdated) : DateTime.now().minus({ days: 1 });
    return `${vendor || 'andrewc'} • published ${version} • ${lastDate.toRelative({ unit: 'days' })}`;
  }

  return (
    <Card variant="outlined" className={classes.card}>
      <CardActionArea onClick={() => goToDetails()} className={classes.cardBtn}>
        <CardContent className={classes.content}>
          <Grid container>
            <Grid item xs={10}>
              <Stack alignItems="center" direction="row" spacing={2}>
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
                <Chip label="Verified license" sx={{ backgroundColor: "#E8F5E9", color: "#388E3C" }} variant="filled" onDelete={() => { return }} deleteIcon={verifiedCheck()} />
              </Stack>
              <Typography pt={1} sx={{ fontSize: 12 }} gutterBottom>
                {description || 'The complete solution for node.js command-line programs'}
              </Typography>
              <Stack alignItems="center" direction="row" spacing={2} pt={1}>
                {platformChips()}
              </Stack>
              <Typography variant="body2" pt={1}>
                {getVendorLastPublish()}
              </Typography>
            </Grid>
            <Grid item xs={2} >
              <Stack alignItems="flex-end" justifyContent="space-between" direction="column" className={classes.contentRight}>
                <Stack direction="column" alignItems="flex-end">
                  <Typography variant="body2">Downloads • {downloads || '-'}</Typography>
                  <Typography variant="body2">Rating • {rating || '-'}</Typography>
                </Stack>
                <BookmarkIcon />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default RepoCard;
