// react global
import { useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react';

// utility
import {api, endpoints} from '../api';
import mockData from '../utilities/mockData';

// components
import Tags from './Tags.jsx'
import {Box, Card, CardContent, CardMedia, Chip, FormControl, Grid, IconButton, InputAdornment, OutlinedInput, Stack, Tab, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { host } from '../host';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BookmarkIcon from '@mui/icons-material/Bookmark';

// placeholder images
import repocube1 from '../assets/repocube-1.png';
import repocube2 from '../assets/repocube-2.png';
import repocube3 from '../assets/repocube-3.png';
import repocube4 from '../assets/repocube-4.png';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import RepoDetailsMetadata from './RepoDetailsMetadata';

// @ts-ignore
const useStyles = makeStyles((theme) => ({
    pageWrapper: {
        backgroundColor: "#FFFFFF",
        height: '100vh',
    },
    container: {
        paddingTop: 5,
        paddingBottom: 5,
        marginTop: 100,
        backgroundColor: "#FFFFFF",
    },
    repoName: {
      fontWeight:"400",
      fontSize:"3rem",
      color:"#220052"
    },
    avatar: {
      height:"3rem",
      width:"3rem"
    },
    cardBtn: {
      height: "100%",
      width: "100%"
    },
    media: {
      borderRadius: '3.125em',
    },
    tabs: {
      marginTop: "5%",
      border: 1, 
      borderColor: 'divider',
      padding:"0.5rem",
      boxShadow: "0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)",
      borderRadius:"2rem",
      height: "100%"
    },
    tabContent:{
      height:"100%"
    },
    selectedTab: {
      background:"#A53692",
      borderRadius:"1.5rem"
    },
    tabPanel: {
      height:"100%"
    },
    metadata: {
      padding:"1.5rem"
    },
    card: {
      marginBottom: 2,
      display:"flex",
      flexDirection:"row",
      alignItems:"start",
      background:"#FFFFFF",
      boxShadow:"0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)",
      borderRadius:"1.5rem",
      flex:"none",
      alignSelf:"stretch",
      flexGrow:0,
      order:0,
      width:"100%"
    },
    platformText:{
      backgroundColor:"#EDE7F6", 
      color: "#220052", 
      fontWeight:'400', 
      fontSize:'0.8125rem',
      lineHeight:'1.125rem',
      letterSpacing:'0.01rem'
    }
}));


// temporary utility to get image
const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
};

const randomImage = () => {
  const imageArray = [repocube1,repocube2,repocube3,repocube4];
  return imageArray[randomIntFromInterval(0,3)];
};

function RepoDetails (props) {
  const [repoDetailData, setRepoDetailData] = useState({});
  // @ts-ignore
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Overview");

  // get url param from <Route here (i.e. image name)
  const {name} = useParams();
  const classes = useStyles();
  const {description, overviewTitle, dependencies, dependents} = props;

  useEffect(() => {
      api.get(`${host()}${endpoints.detailedRepoInfo(name)}`)
        .then(response => {
          if (response.data && response.data.data) {
              let repoInfo = response.data.data.ExpandedRepoInfo;
              let imageData = {
                name: name,
                tags: repoInfo.Manifests,
                lastUpdated: repoInfo.Summary?.LastUpdated,
                size: repoInfo.Summary?.Size,
                platforms: repoInfo.Summary?.Platforms,
                vendors: repoInfo.Summary?.Vendors,
                newestTag: repoInfo.Summary?.NewestTag
              }
              setRepoDetailData(imageData);
              setIsLoading(false);
          }
        })
        .catch((e) => {
            console.error(e);
            setRepoDetailData({});
        });
  }, [name])

  const verifiedCheck = () => {
    return (<CheckCircleOutlineOutlinedIcon sx={{color:"#388E3C!important"}}/>);
  }

  const platformChips = () => {
    // if platforms not received, mock data
    // @ts-ignore
    const platforms = repoDetailData.platforms || ["Windows","PowerPC64LE","IBM Z","Linux"];
    return platforms.map((platform, index) => (
      <Chip key={index} label={platform.Os} className={classes.platformText}/>
    ));
  }

  // @ts-ignore
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const renderOverview = () => {
    return (
      <Card className={classes.card} data-testid='overview-container'>
        <CardContent>
          <Typography variant="h4" align="left">{overviewTitle || 'Quickstart'}</Typography>
          <Typography variant="body1" sx={{color:"rgba(0, 0, 0, 0.6)", fontSize:"1rem",lineHeight:"150%", marginTop:"5%"}}>{description || mockData.loremIpsum}</Typography>
        </CardContent>
      </Card>
    );
  };

  // const renderDependencies = () => {
  //   return (<Card className={classes.card}>
  //       <CardContent>
  //         <Typography variant="h4" align="left">Dependecies ({dependencies || '---'})</Typography>
  //       </CardContent>
  //     </Card>);
  // };

  // const renderDependents = () => {
  //   return (<Card className={classes.card}>
  //       <CardContent>
  //         <Typography variant="h4" align="left">Dependents ({dependents || '---'})</Typography>
  //       </CardContent>
  //     </Card>);
  // };

  // const renderVulnerabilities = () => {
  //   return (<Card className={classes.card}>
  //       <CardContent>
  //         <Typography variant="h4" align="left">Vulnerabilities</Typography>
  //       </CardContent>
  //     </Card>);
  // };


  return (
      <div className={classes.pageWrapper}>
            <Card>
              <CardContent>
                <Grid container>
                  <Grid item xs={7}>
                    <Stack alignItems="center" direction="row" spacing={2}>
                      <CardMedia classes={{
                          root: classes.media,
                          img: classes.avatar,
                      }}
                        component="img"
                        image={randomImage()}
                        alt="icon"
                      />
                      <Typography variant="h3" className={classes.repoName}>
                        {name}
                      </Typography>
                      <Chip label="Verified license" sx={{backgroundColor:"#E8F5E9", color:"#388E3C"}} variant="filled" onDelete={() => {return}} deleteIcon={verifiedCheck()}/>
                      <BookmarkIcon/>
                    </Stack>
                    <Typography pt={1} sx={{ fontSize: 16,lineHeight:"1.5rem", color:"rgba(0, 0, 0, 0.6)" }} gutterBottom align="left">
                      {description || 'The complete solution for node.js command-line programs'}
                    </Typography>
                    <Stack alignItems="center" direction="row" spacing={2} pt={1}>
                      {platformChips()}
                    </Stack>
                  </Grid>
                  <Grid item xs={5} pt={2}>
                      <Typography variant="body1" sx={{color:"rgba(0, 0, 0, 0.6)"}}>Copy and pull to pull this image</Typography>
                      <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <OutlinedInput
                          value={`Pull ${name}`}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton aria-label='copy' edge="end" onClick={() => navigator.clipboard.writeText(`Pull ${name}`)} data-testid='pullcopy-btn'>
                                <ContentCopyIcon/>
                              </IconButton>
                            </InputAdornment>
                          }
                          aria-describedby="outlined-weight-helper-text"
                          inputProps={{
                            'aria-label': 'weight',
                          }}
                        />
                      </FormControl>
                  </Grid>
                </Grid>
                <TabContext value={selectedTab}>
                  <Box className={classes.tabs}>
                    <TabList  
                      onChange={handleTabChange} 
                      TabIndicatorProps={{ className: classes.selectedTab }} 
                      sx={{ "& button.Mui-selected": {color:"#A53692"}}}
                    >
                        <Tab value="Overview" label="Overview" className={classes.tabContent}/>
                        <Tab value="Tags" label="Tags" className={classes.tabContent}/>
                        {/* <Tab value="Dependencies" label={`${dependencies || 0} Dependencies`} className={classes.tabContent}/>
                        <Tab value="Dependents" label={`${dependents || 0} Dependents`} className={classes.tabContent}/>
                        <Tab value="Vulnerabilities" label="Vulnerabilities" className={classes.tabContent}/>
                        <Tab value="6" label="Tab 6" className={classes.tabContent}/>
                        <Tab value="7" label="Tab 7" className={classes.tabContent}/>
                        <Tab value="8" label="Tab 8" className={classes.tabContent}/> */}
                    </TabList>
                    <Grid container>
                        <Grid item xs={8}>
                            <TabPanel value="Overview" className={classes.tabPanel}>
                              {renderOverview()}
                            </TabPanel>
                            <TabPanel value="Tags" className={classes.tabPanel}>
                              <Tags data={repoDetailData} />
                            </TabPanel>
                            {/* <TabPanel value="Dependencies" className={classes.tabPanel}>
                              {renderDependencies()}
                            </TabPanel>
                            <TabPanel value="Dependents" className={classes.tabPanel}>
                              {renderDependents()}
                            </TabPanel>
                            <TabPanel value="Vulnerabilities" className={classes.tabPanel}>
                              {renderVulnerabilities()}
                            </TabPanel> */}
                        </Grid>
                        <Grid item xs={4} className={classes.metadata}>
                            <RepoDetailsMetadata 
                              // @ts-ignore
                              lastUpdated={repoDetailData.lastUpdated}
                              // @ts-ignore
                              size={repoDetailData.size}
                              // @ts-ignore
                              latestTag={repoDetailData.newestTag}
                            />
                        </Grid>
                    </Grid>
                  </Box>
                </TabContext>
              </CardContent>
            </Card>
      </div>
  );
}

export default RepoDetails;
