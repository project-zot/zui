// react global
import {Link, useParams} from "react-router-dom";

// utility
import api from '../api.js';

// components
import {Button, Card, CardActions, CardActionArea, CardMedia, CardContent, Typography} from '@material-ui/core';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

// styling
import {makeStyles} from '@material-ui/core';
import avatar from '../avatar.svg';

const useStyles = makeStyles((theme) => ({
  card: {
      marginBottom: theme.spacing(2),
  },
  cardLg: {
      marginBottom: theme.spacing(2),
      height: 200,
  },
  avatar: {
      objectFit: "contain",
  },
  cardBtn: {
    height: "100%",
  },
  media: {
    padding: theme.spacing(2),
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
  const {name, description, version, vendor, size, tags, licenses, shown} = props;

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
