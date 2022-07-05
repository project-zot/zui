// react global
import {Link} from "react-router-dom";

// utility

// components
import {Card, CardActionArea, CardMedia, CardContent, Typography} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import makeStyles from '@mui/styles/makeStyles';
import avatar from '../avatar.svg';
import React from "react";

const useStyles = makeStyles(() => ({
  card: {
      marginBottom: 2,
  },
  cardLg: {
      marginBottom: 2,
      height: 200,
  },
  avatar: {
      objectFit: "contain",
  },
  cardBtn: {
    height: "100%",
  },
  media: {
    padding: 2,
    maxWidth: 150,
    borderRadius: '50px',
    marginTop: 20,
  },
  mediaLg: {
    maxWidth: 220,
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

function ImageTile(props) {
  const classes = useStyles();
  const {name, version, vendor, shown} = props;

  let style = {};
  if (!shown) {
    style = {display: 'none'};
  }

  return (
    <div style={style}>
    <Link to={`/image/${name}`} state={{data: props}} className={props.size === "lg" ? 'card-link' : ''}>
        <Card variant="outlined" className={props.size === "lg" ? classes.cardLg : classes.card}>
            <CardActionArea className={classes.cardBtn}>
                <div style={{display: 'flex'}}>
                    <CardMedia classes={{
                        root: props.size === "lg" ? classes.mediaLg : classes.media,
                        img: classes.avatar,
                    }}
                      component="img"
                      height= {props.size === "lg" ? 130 : 80}
                      image={avatar}
                    />
                    <CardContent className={classes.content}>
                      <Typography variant="h5" component="div">
                        {name}
                        <VerifiedUserIcon className={classes.signedBadge}/>
                      </Typography>
                      <Typography sx={{ fontSize: 12 }} gutterBottom>
                        {vendor || 'vendor'}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }}>
                        {version}
                      </Typography>
                      <Typography variant="body2">
                        {name + " is a linux distribution that's composed entirely of free and open source software."}
                      </Typography>
                    </CardContent>
                </div>
            </CardActionArea>
        </Card>
    </Link>
    </div>
  );
}

export default ImageTile;
