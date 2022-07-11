// react global
import { useLocation, useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react';

// utility
import {api, endpoints} from '../api';
import mockData from '../utilities/mockData';

// components
import Tags from './Tags.jsx'
import {Box, Card, CardContent, CardMedia, Chip, FormControl, Grid, IconButton, InputAdornment, OutlinedInput, Stack, Tab, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { host } from '../constants';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

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
    },
    container: {
        paddingTop: 5,
        paddingBottom: 5,
        marginTop: 100,
        backgroundColor: "#FFFFFF",
    },
    parentWrapper: {
        height: '100vh',
    },
    gridWrapper: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#FFFFFF",
        border: "1px #f2f2f2 dashed",
    },
    avatar: {
      height:"48px",
      width:"48px"
    },
    cardBtn: {
      height: "100%",
      width: "100%"
    },
    media: {
      borderRadius: '50px',
    },
    tabs: {
      marginTop: "5%",
      border: 1, 
      borderColor: 'divider',
      padding:"8px",
      boxShadow: "0px 5px 10px rgba(131, 131, 131, 0.08)",
      background:"#EDE7F6",
      borderRadius:"32px",
      height: "100%"
    },
    selectedTab: {
      background:"#A53692",
      borderRadius:"24px"
    },
    tabPanel: {
      height:"100%"
    },
    metadata: {
      padding:"24px"
    },
    card: {
      marginBottom: 2,
      display:"flex",
      flexDirection:"row",
      alignItems:"start",
      background:"#FFFFFF",
      boxShadow:"0px 5px 10px rgba(131, 131, 131, 0.08)",
      borderRadius:"24px",
      flex:"none",
      alignSelf:"stretch",
      flexGrow:0,
      order:0,
      width:"100%"
    },
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
  const [selectedTab, setSelectedTab] = useState("Readme");

  // get url param from <Route here (i.e. image name)
  const {name} = useParams();
  const {state} = useLocation();
  // @ts-ignore
  const {lastDate} = state;
  const classes = useStyles();
  const {description, readmeTitle, dependencies, dependents} = props;

  useEffect(() => {
      api.get(`${host}${endpoints.detailedRepoInfo(name)}`)
        .then(response => {
          if (response.data && response.data.data) {
              let imageList = response.data.data.ExpandedRepoInfo;
              let imageData = {
                name: name,
                tags: imageList.Manifests
              }
              setRepoDetailData(imageData);
              setIsLoading(false);
          }
        })
        .catch((e) => {
            console.error(e);
            setRepoDetailData({});
        });
  }, [])

  const getLatestManifest = () => {
    // @ts-ignore
    const manifests = repoDetailData.tags || [{}];
    return manifests[0];
  }

  const getLatestLayer = () => {
    const layers = getLatestManifest().Layers || [{}];
    return layers[0];
  }

  const verifiedCheck = () => {
    return (<CheckCircleOutlineOutlinedIcon sx={{color:"#388E3C!important"}}/>);
  }

  const platformChips = () => {
    // if platforms not received, mock data
    const platforms = props.platforms || ["Windows","PowerPC64LE","IBM Z","Linux"];
    return platforms.map((platform, index) => (
      <Chip key={index} label={platform} sx={{backgroundColor:"#EDE7F6", color: "#311B92"}}/>
    ));
  }

  // @ts-ignore
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const renderReadme = () => {
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h4" align="left">{readmeTitle || 'Quickstart'}</Typography>
          <Typography variant="body1">{description || mockData.loremIpsum}</Typography>
        </CardContent>
      </Card>
    );
  };

  const renderDependencies = () => {
    return (<Card className={classes.card}>
        <CardContent>
          <Typography variant="h4" align="left">Dependecies ({dependencies || '---'})</Typography>
        </CardContent>
      </Card>);
  };

  const renderDependents = () => {
    return (<Card className={classes.card}>
        <CardContent>
          <Typography variant="h4" align="left">Dependents ({dependents || '---'})</Typography>
        </CardContent>
      </Card>);
  };

  const renderVulnerabilities = () => {
    return (<Card className={classes.card}>
        <CardContent>
          <Typography variant="h4" align="left">Vulnerabilities</Typography>
        </CardContent>
      </Card>);
  };


  return (
      <div className={classes.pageWrapper}>
          <div className={classes.parentWrapper}>
            <Card variant="outlined">
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
                      <Typography variant="h5" component="div">
                        {name}
                      </Typography>
                      <Chip label="Verified license" sx={{backgroundColor:"#E8F5E9", color:"#388E3C"}} variant="filled" onDelete={() => {return}} deleteIcon={verifiedCheck()}/>
                    </Stack>
                    <Typography pt={1} sx={{ fontSize: 12 }} gutterBottom align="left">
                      {description || 'The complete solution for node.js command-line programs'}
                    </Typography>
                    <Stack alignItems="center" direction="row" spacing={2} pt={1}>
                      {platformChips()}
                    </Stack>
                  </Grid>
                  <Grid item xs={5} pt={2}>
                      <Typography variant="body1">Copy and pull to pull this image</Typography>
                      <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <OutlinedInput
                          value={`Pull ${name}`}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton aria-label='copy' edge="end" onClick={() => navigator.clipboard.writeText(`Pull ${name}`)}>
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
                    <TabList  onChange={handleTabChange} TabIndicatorProps={{ className: classes.selectedTab }} >
                        <Tab value="Readme" label="Read me"/>
                        <Tab value="Tags" label="Tags"/>
                        <Tab value="Dependencies" label={`${dependencies || 0} dependencies`}/>
                        <Tab value="Dependents" label={`${dependents || 0} dependents`}/>
                        <Tab value="Vulnerabilities" label="Vulnerabilities"/>
                        <Tab value="6" label="Tab 6"/>
                        <Tab value="7" label="Tab 7"/>
                        <Tab value="8" label="Tab 8"/>
                    </TabList>
                    <Grid container>
                        <Grid item xs={8}>
                            <TabPanel value="Readme" className={classes.tabPanel}>
                              {renderReadme()}
                            </TabPanel>
                            <TabPanel value="Tags" className={classes.tabPanel}>
                              <Tags data={repoDetailData} />
                            </TabPanel>
                            <TabPanel value="Dependencies" className={classes.tabPanel}>
                              {renderDependencies()}
                            </TabPanel>
                            <TabPanel value="Dependents" className={classes.tabPanel}>
                              {renderDependents()}
                            </TabPanel>
                            <TabPanel value="Vulnerabilities" className={classes.tabPanel}>
                              {renderVulnerabilities()}
                            </TabPanel>
                        </Grid>
                        <Grid item xs={4} className={classes.metadata}>
                            <RepoDetailsMetadata 
                              name={name}
                              lastUpdated={lastDate}
                              size={getLatestLayer()?.size}
                              latestTag={getLatestManifest()?.Tag}
                            />
                        </Grid>
                    </Grid>
                  </Box>
                </TabContext>
              </CardContent>
            </Card>
         </div>
      </div>
  );
}

export default RepoDetails;
