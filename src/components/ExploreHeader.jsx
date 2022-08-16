// react global
import {Link, useLocation} from "react-router-dom";

// components
import {Typography, Breadcrumbs} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// styling

import makeStyles from '@mui/styles/makeStyles';
import React from "react";

const useStyles = makeStyles((theme) => {
    return {
        exploreHeader: {
            backgroundColor: "#FFFFFF",
            minHeight: 50,
            paddingLeft: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        explore: {
            color: '#00000099',
            letterSpacing: "0.009375rem"
        }
    }
});

function ExploreHeader() {
  const classes = useStyles();
  const location = useLocation();
  const path = location.pathname;

  return (
      <div className={classes.exploreHeader}>
          <Breadcrumbs separator="/" aria-label="breadcrumb">
              <Link to="/"><Typography variant="body1" className={classes.explore}>Home</Typography></Link>
              { path.includes('/image/') && <Typography className={classes.explore} variant="body1">{path.replace('/image/', '')}</Typography> }
          </Breadcrumbs>
      </div>
  );
}

export default ExploreHeader;
