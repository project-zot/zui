import { Grid, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { api, endpoints } from 'api';
import { host } from '../constants';
import {isEmpty} from 'lodash';
import React, { useEffect, useState } from 'react';
import PreviewCard from './PreviewCard';
import RepoCard from './RepoCard';


const useStyles = makeStyles(() => ({
  gridWrapper: {
      marginTop:10
  },
  nodataWrapper: {
    backgroundColor: "#fff",
    height: '100vh',
  },
  exploreText: {
    color: '#C0C0C0',
    display: "flex",
    alignItems: "left",
  },
  resultsRow: {
    justifyContent:"space-between",
    alignItems:"center",
    color:"#00000099"
  },
  title: {
    fontWeight:"700",
    color:"#000000DE",
    width:"100%",
  },
  sectionTitle:{
    fontWeight:"700",
    color:"#000000DE",
    width:"100%"
  },
  subtitle: {
    color:"#00000099",
    fontWeight:400,
    fontSize:"1rem",
    textAlign:"center",
    lineHeight:"150%",
    letterSpacing:"0.009375rem",
    width:"65%",
  }
}));

function Home ({ keywords, data, updateData }) {
  const [isLoading, setIsLoading] = useState(true);
  const [homeData, setHomeData] = useState([]);
  const filterStr = keywords && keywords.toLocaleLowerCase();
  const classes = useStyles();

  useEffect(() => {
    api.get(`${host}${endpoints.imageList}`)
      .then(response => {
        if (response.data && response.data.data) {
            let imageList = response.data.data.ImageListWithLatestTag;
            let imagesData = imageList.map((image) => {
                return {
                    name: image.Name,
                    latestVersion: image.Latest,
                    tags: image.Labels,
                    description: image.Description,
                    licenses: image.Licenses,
                    size: image.Size,
                    vendor: image.Vendor,
                    lastUpdated: image.LastUpdated
                };
            });
            updateData(imagesData);
            setIsLoading(false);
        }
      })
      .catch((e) => {
        console.error(e);
      })
  },[])

  useEffect(() => {
    setIsLoading(false);
  }, []);
  
  useEffect(() => {
    const filtered = data && data.filter((item) => {
        return (
            isEmpty(keywords) ||
            (item.name && item.name.toLocaleLowerCase().indexOf(filterStr) >= 0 ) ||
            (item.appID && item.appID.toLocaleLowerCase().indexOf(filterStr) >= 0) ||
            (item.appId && item.appId.toLocaleLowerCase().indexOf(filterStr) >= 0)
        )
    });

    setHomeData(filtered);
  }, [keywords, data]);

  const renderPreviewCards = () => {
    return homeData && homeData.slice(0,4).map((item, index) => {
      return (
        <Grid item xs={3} key={index}><PreviewCard  name={item.name} lastUpdated={item.lastUpdated}/></Grid>
      )
    });
  };

  const renderBookmarks = () => {
    return homeData && homeData.slice(0,2).map((item,index) => {
      return (
        <RepoCard name={item.name}
        version={item.latestVersion}
        description={item.description}
        tags={item.tags}
        vendor={item.vendor}
        size={item.size}
        licenses={item.licenses}
        key={index}
        data={item}
        lastUpdated={item.lastUpdated}
        shown={true}/>
      )
    });
  }

  const renderRecentlyUpdated = () => {
    return homeData && homeData.slice(0,2).map((item,index) => {
      return (
        <RepoCard name={item.name}
        version={item.latestVersion}
        description={item.description}
        tags={item.tags}
        vendor={item.vendor}
        size={item.size}
        licenses={item.licenses}
        key={index}
        data={item}
        lastUpdated={item.lastUpdated}
        shown={true}/>
      )
    });
  }

  return (
    <Stack spacing={4} alignItems="center" className={classes.gridWrapper}>
      <Grid container item xs={12}>
        <Stack direction="column" alignItems="center" spacing={4}>
            <Typography variant="h3" className={classes.title}>Most popular repositories</Typography> 
          <Typography variant="body1" className={classes.subtitle} align="center">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet, dis pellentesque posuere nulla tortor ac eu arcu nunc. A potenti ridiculus vitae, ut venenatis in ut interdum eros.</Typography>
        </Stack>
      </Grid>
      <Grid container spacing={1}>
          {renderPreviewCards()}
      </Grid>
      <Typography variant="h4" align="left" className={classes.sectionTitle}>Bookmarks</Typography>
      {renderBookmarks()}
      <Typography variant="h4" align="left" className={classes.sectionTitle}>Recently updated repositories</Typography>
      {renderRecentlyUpdated()}
    </Stack>
  );
}

export default Home;