// react global
import {Link, useLocation, useNavigate} from "react-router-dom";

// components
import {Typography, Breadcrumbs} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// styling

import makeStyles from '@mui/styles/makeStyles';
import React from "react";

const useStyles = makeStyles((theme) => {
    return {
        exploreHeader: {
            backgroundColor: "#FFFFFF",
            minHeight: 50,
            paddingLeft: "3rem",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "2rem"
        },
        explore: {
            color: '#52637A',
            fontSize: "1rem",
            letterSpacing: "0.009375rem"
        }
    }
});

function ExploreHeader() {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  return (
      <div className={classes.exploreHeader}>
          <ArrowBackIcon sx={{color: "#14191F",fontSize: "2rem", cursor: "pointer"}} onClick={() => navigate(-1)}/>
          <Breadcrumbs separator="/" aria-label="breadcrumb">
              <Link to="/"><Typography variant="body1" className={classes.explore}>Home</Typography></Link>
              { path.includes('/image/') && <Typography className={classes.explore} variant="body1">{path.replace('/image/', '')}</Typography> }
          </Breadcrumbs>
          <div></div>
      </div>
  );
}

export default ExploreHeader;
