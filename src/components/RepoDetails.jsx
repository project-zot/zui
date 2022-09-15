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
import PestControlOutlinedIcon from "@mui/icons-material/PestControlOutlined";
import PestControlIcon from "@mui/icons-material/PestControl";
import GppBadOutlinedIcon from "@mui/icons-material/GppBadOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BookmarkIcon from '@mui/icons-material/Bookmark';

// placeholder images
import repocube1 from '../assets/repocube-1.png';
import repocube2 from '../assets/repocube-2.png';
import repocube3 from '../assets/repocube-3.png';
import repocube4 from '../assets/repocube-4.png';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import RepoDetailsMetadata from './RepoDetailsMetadata';
import { padding } from '@mui/system';

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
      fontWeight:"700",
      fontSize:"2.5rem",
      color:"#0F2139"
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
      marginTop: "3rem",
      padding:"0.5rem",
      height: "100%"
    },
    tabContent:{
      height:"100%"
    },
    selectedTab: {
      background:"#D83C0E",
      borderRadius:"1.5rem"
    },
    tabPanel: {
      height:"100%",
      paddingLeft: "0rem!important"
    },
    metadata: {
      marginTop: "8rem",
      paddingLeft:"1.5rem",
    },
    card: {
      marginBottom: 2,
      display:"flex",
      flexDirection:"row",
      alignItems:"start",
      background:"#FFFFFF",
      border: "1px solid #E0E5EB",
      borderRadius:"2rem",
      flex:"none",
      alignSelf:"stretch",
      flexGrow:0,
      order:0,
      width:"100%",
      boxShadow: "none!important"
    },
    platformText:{
      backgroundColor:"#EDE7F6", 
      color: "#220052", 
      fontWeight:'400', 
      fontSize:'0.8125rem',
      lineHeight:'1.125rem',
      letterSpacing:'0.01rem'
    },
    inputForm:{
      '& fieldset':{
        border: "2px solid #52637A",
      },
      
    },
    cardRoot:{
      boxShadow: "none!important",
    },
    header:{
      paddingLeft:"2rem"
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
  //function that returns a random element from an array
  function getRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  const vulnerabilityCheck = () => {
    const noneVulnerability = <Chip label="None Vulnerability" sx={{backgroundColor: "#E8F5E9",color: "#388E3C",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <PestControlOutlinedIcon sx={{ color: "#388E3C!important" }} />}/>;
    const unknownVulnerability = <Chip label="Unknown Vulnerability" sx={{backgroundColor: "#ECEFF1",color: "#52637A",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <PestControlOutlinedIcon sx={{ color: "#52637A!important" }} />}/>;
    const lowVulnerability = <Chip label="Low Vulnerability" sx={{backgroundColor: "#FFF3E0",color: "#FB8C00",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <PestControlOutlinedIcon sx={{ color: "#FB8C00!important" }} />}/>;
    const mediumVulnerability = <Chip label="Medium Vulnerability" sx={{backgroundColor: "#FFF3E0",color: "#FB8C00",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <PestControlIcon sx={{ color: "#FB8C00!important" }} />}/>;
    const highVulnerability = <Chip label="High Vulnerability" sx={{backgroundColor: "#FEEBEE",color: "#E53935",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <PestControlOutlinedIcon sx={{ color: "#E53935!important" }} />}/>;
    const criticalVulnerability = <Chip label="Critical Vulnerability" sx={{backgroundColor: "#FEEBEE",color: "#E53935",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <PestControlIcon sx={{ color: "#E53935!important" }} />}/>;

    const arrVulnerability = [noneVulnerability, unknownVulnerability, lowVulnerability, mediumVulnerability, highVulnerability, criticalVulnerability]
    return(getRandom(arrVulnerability));
  };

  const signatureCheck = () => {
    const unverifiedSignature = <Chip label="Unverified Signature" sx={{backgroundColor: "#FEEBEE",color: "#E53935",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <GppBadOutlinedIcon sx={{ color: "#E53935!important" }} />}/>; 
    const untrustedSignature = <Chip label="Untrusted Signature" sx={{backgroundColor: "#ECEFF1",color: "#52637A",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <GppMaybeOutlinedIcon sx={{ color: "#52637A!important" }} />}/>;
    const verifiedSignature = <Chip label="Verified Signature" sx={{backgroundColor: "#E8F5E9",color: "#388E3C",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <GppGoodOutlinedIcon sx={{ color: "#388E3C!important" }} />}/>;

    const arrSignature = [unverifiedSignature, untrustedSignature, verifiedSignature]
    return(getRandom(arrSignature));
  }

  const platformChips = () => {
    // if platforms not received, mock data
    // @ts-ignore
    const platforms = repoDetailData.platforms || ["Windows","PowerPC64LE","IBM Z","Linux"];
    return platforms.map((platform, index) => (
      <Chip key={index} label={platform.Os} sx={{
        backgroundColor: "#E0E5EB",
        color: "#52637A",
        fontSize: "0.8125rem",
      }}/>
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
          <Typography variant="body1" sx={{color:"rgba(0, 0, 0, 0.6)", fontSize:"1rem",lineHeight:"150%", marginTop:"5%", alignSelf:"stretch"}}>{description || mockData.loremIpsum}</Typography>
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
            <Card className={classes.cardRoot}>
              <CardContent>
                <Grid container className={classes.header}>
                  <Grid item xs={8}>
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
                      {vulnerabilityCheck()}
                      {signatureCheck()}
                      <BookmarkIcon sx={{color:"#52637A"}}/>
                    </Stack>
                    <Typography pt={1} sx={{ fontSize: 16,lineHeight:"1.5rem", color:"rgba(0, 0, 0, 0.6)", paddingLeft:"4rem"}} gutterBottom align="left">
                      {description || 'The complete solution for node.js command-line programs'}
                    </Typography>
                    <Stack alignItems="center" sx={{ paddingLeft:"4rem"}} direction="row" spacing={2} pt={1}>
                      {platformChips()}
                    </Stack>
                  </Grid>
                  <Grid item xs={4} >
                      <Typography variant="body1" sx={{color:"#52637A", fontSize: "1rem"}}>Copy and pull to pull this image</Typography>
                      <FormControl  sx={{ m: 1, paddingLeft:"1.5rem"}} variant="outlined">
                        <OutlinedInput
                          value={`Pull ${name}`}
                          className={classes.inputForm}
                          sx={{ m: 1, width: '20.625rem',  borderRadius: "8px", color: "#14191F"}}
                          endAdornment={
                            <InputAdornment position="end" >
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
                <Grid container>
                  <Grid item xs={8} className={classes.tabs}>
                    <TabContext value={selectedTab}>
                      <Box >
                        <TabList  
                          onChange={handleTabChange} 
                          TabIndicatorProps={{ className: classes.selectedTab }} 
                          sx={{ "& button.Mui-selected": {color:"#14191F", fontWeight:"600"}}}
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
                            <Grid item xs={12}>
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
                        </Grid>
                      </Box>
                    </TabContext>
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
              </CardContent>
            </Card>
      </div>
  );
}

export default RepoDetails;
