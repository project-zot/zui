// react global
import {Link, useLocation} from "react-router-dom";

// components
import {Typography, Badge, AppBar, Toolbar, InputBase, Breadcrumbs} from '@material-ui/core';
import {Tabs, Tab} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// styling
import {makeStyles, alpha} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
    console.log("theme", theme)
    return {
        exploreHeader: {
            backgroundColor: "#fafafa",
            minHeight: 50,
            paddingLeft: theme.spacing(5),
            display: "flex",
            alignItems: "center",
        },
        explore: {
            color: 'gray'
        }
    }
});

function ExploreHeader() {
  const classes = useStyles();
  const location = useLocation();
  const path = location.pathname;

  return (
      <div className={classes.exploreHeader}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
              <Link to="/"><Typography className={classes.explore}>Explore Packages</Typography></Link>
              { path.includes('/image/') && <Typography>{path.replace('/image/', '')}</Typography> }
          </Breadcrumbs>
      </div>
  );
}

export default ExploreHeader;
