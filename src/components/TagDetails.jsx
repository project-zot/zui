// react global
import { useParams } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';

// utility
import { api, endpoints } from '../api';

// components
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  FormControl,
  IconButton,
  Stack,
  Select,
  MenuItem,
  Tab,
  Typography
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import makeStyles from '@mui/styles/makeStyles';
import { host, hostRoot } from '../host';

// placeholder images
import repocube1 from '../assets/repocube-1.png';
import repocube2 from '../assets/repocube-2.png';
import repocube3 from '../assets/repocube-3.png';
import repocube4 from '../assets/repocube-4.png';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import TagDetailsMetadata from './TagDetailsMetadata';
import VulnerabilitiesDetails from './VulnerabilitiesDetails';
import HistoryLayers from './HistoryLayers';
import DependsOn from './DependsOn';
import IsDependentOn from './IsDependentOn';

// @ts-ignore
const useStyles = makeStyles(() => ({
  pageWrapper: {
    backgroundColor: '#FFFFFF',
    height: '100vh'
  },
  container: {
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 100,
    backgroundColor: '#FFFFFF'
  },
  repoName: {
    fontWeight: '700',
    fontSize: '2.5rem',
    color: '#0F2139',
    textAlign: 'left'
  },
  avatar: {
    height: '3rem',
    width: '3rem'
  },
  cardBtn: {
    height: '100%',
    width: '100%'
  },
  media: {
    borderRadius: '3.125em'
  },
  tabs: {
    marginTop: '3rem',
    padding: '0.5rem',
    height: '100%'
  },
  tabContent: {
    height: '100%'
  },
  selectedTab: {
    background: '#D83C0E',
    borderRadius: '1.5rem'
  },
  tabPanel: {
    height: '100%',
    paddingLeft: '0rem!important'
  },
  metadata: {
    marginTop: '8rem',
    paddingLeft: '1.5rem'
  },
  card: {
    marginBottom: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    background: '#FFFFFF',
    border: '0.0625rem solid #E0E5EB',
    borderRadius: '2rem',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%',
    boxShadow: 'none!important'
  },
  platformText: {
    backgroundColor: '#EDE7F6',
    color: '#220052',
    fontWeight: '400',
    fontSize: '0.8125rem',
    lineHeight: '1.125rem',
    letterSpacing: '0.01rem'
  },
  inputForm: {
    '& fieldset': {
      border: '0.125rem solid #52637A'
    }
  },
  cardRoot: {
    boxShadow: 'none!important'
  },
  header: {
    paddingLeft: '2rem'
  }
}));

// temporary utility to get image
const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomImage = () => {
  const imageArray = [repocube1, repocube2, repocube3, repocube4];
  return imageArray[randomIntFromInterval(0, 3)];
};

function TagDetails() {
  const [imageDetailData, setImageDetailData] = useState({});
  // @ts-ignore
  //const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Layers');
  const abortController = useMemo(() => new AbortController(), []);

  // get url param from <Route here (i.e. image name)
  const { name, tag } = useParams();
  const [fullName, setFullName] = useState(name + ':' + tag);
  const [pullString, setPullString] = useState(`docker pull ${hostRoot()}/${fullName}`);
  const classes = useStyles();

  useEffect(() => {
    // if same-page navigation because of tag update, following 2 lines help ux
    setSelectedTab('Layers');
    window?.scrollTo(0, 0);
    api
      .get(`${host()}${endpoints.detailedImageInfo(name, tag)}`, abortController.signal)
      .then((response) => {
        if (response.data && response.data.data) {
          let imageInfo = response.data.data.Image;
          let imageData = {
            name: imageInfo.RepoName,
            tag: imageInfo.Tag,
            lastUpdated: imageInfo.LastUpdated,
            size: imageInfo.Size,
            digest: imageInfo.ConfigDigest,
            platform: imageInfo.Platform,
            vendor: imageInfo.Vendor,
            history: imageInfo.History
          };
          setImageDetailData(imageData);
          setFullName(imageData.name + ':' + imageData.tag);
          //setIsLoading(false);
        }
      })
      .catch((e) => {
        console.error(e);
        setImageDetailData({});
      });
    return () => {
      abortController.abort();
    };
  }, [name, tag]);
  //function that returns a random element from an array
  // function getRandom(list) {
  //   return list[Math.floor(Math.random() * list.length)];
  // }

  // const signatureCheck = () => {
  //   const unverifiedSignature = <Chip label="Unverified Signature" sx={{backgroundColor: "#FEEBEE",color: "#E53935",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <GppBadOutlinedIcon sx={{ color: "#E53935!important" }} />}/>;
  //   const untrustedSignature = <Chip label="Untrusted Signature" sx={{backgroundColor: "#ECEFF1",color: "#52637A",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <GppMaybeOutlinedIcon sx={{ color: "#52637A!important" }} />}/>;
  //   const verifiedSignature = <Chip label="Verified Signature" sx={{backgroundColor: "#E8F5E9",color: "#388E3C",fontSize: "0.8125rem",}} variant="filled" onDelete={() => { return; }} deleteIcon={ <GppGoodOutlinedIcon sx={{ color: "#388E3C!important" }} />}/>;

  //   const arrSignature = [unverifiedSignature, untrustedSignature, verifiedSignature]
  //   return(getRandom(arrSignature));
  // }

  const getPlatform = () => {
    // @ts-ignore
    return imageDetailData?.platform ? imageDetailData.platform : '--/--';
  };

  // @ts-ignore
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSelectionChange = (event) => {
    setPullString(event.target.value);
  };

  return (
    <div className={classes.pageWrapper}>
      <Card className={classes.cardRoot}>
        <CardContent>
          <Grid container className={classes.header}>
            <Grid item xs={8}>
              <Stack alignItems="center" direction="row" spacing={2}>
                <CardMedia
                  classes={{
                    root: classes.media,
                    img: classes.avatar
                  }}
                  component="img"
                  image={randomImage()}
                  alt="icon"
                />
                <Typography variant="h3" className={classes.repoName}>
                  {name}:{tag}
                </Typography>
                {/* {vulnerabilityCheck()}
                      {signatureCheck()} */}
                {/* <BookmarkIcon sx={{color:"#52637A"}}/> */}
              </Stack>
              <Typography
                pt={1}
                sx={{ fontSize: 16, lineHeight: '1.5rem', color: 'rgba(0, 0, 0, 0.6)', paddingLeft: '4rem' }}
                gutterBottom
                align="left"
              >
                Digest:{' '}
                {
                  // @ts-ignore
                  imageDetailData?.digest
                }
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Stack direction="row">
                <Grid item xs={10}>
                  <Typography variant="body1" sx={{ color: '#52637A', fontSize: '1rem', paddingTop: '0.75rem' }}>
                    Copy and pull to pull this image
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    aria-label="copy"
                    onClick={() => navigator.clipboard.writeText(pullString)}
                    data-testid="pullcopy-btn"
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Grid>
              </Stack>
              <FormControl sx={{ m: 1, paddingLeft: '1.5rem' }} variant="outlined">
                <Select
                  className={classes.inputForm}
                  value={pullString}
                  onChange={handleSelectionChange}
                  inputProps={{ 'aria-label': 'Without label' }}
                  sx={{ m: 1, width: '20.625rem', borderRadius: '0.5rem', color: '#14191F', alignContent: 'left' }}
                >
                  <MenuItem value={`docker pull ${hostRoot()}/${fullName}`}>
                    docker pull {hostRoot()}/{fullName}
                  </MenuItem>
                  <MenuItem value={`podman pull ${hostRoot()}/${fullName}`}>
                    podman pull {hostRoot()}/{fullName}
                  </MenuItem>
                  <MenuItem value={`skopeo copy docker://${hostRoot()}/${fullName}`}>
                    skopeo copy docker://{hostRoot()}/{fullName}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={8} className={classes.tabs}>
              <TabContext value={selectedTab}>
                <Box>
                  <TabList
                    onChange={handleTabChange}
                    TabIndicatorProps={{ className: classes.selectedTab }}
                    sx={{ '& button.Mui-selected': { color: '#14191F', fontWeight: '600' } }}
                  >
                    <Tab value="Layers" label="Layers" className={classes.tabContent} />
                    <Tab value="DependsOn" label="Uses" className={classes.tabContent} data-testid="dependencies-tab" />
                    <Tab value="IsDependentOn" label="Used by" className={classes.tabContent} />
                    <Tab value="Vulnerabilities" label="Vulnerabilities" className={classes.tabContent} />
                  </TabList>
                  <Grid container>
                    <Grid item xs={12}>
                      <TabPanel value="Layers" className={classes.tabPanel}>
                        <HistoryLayers
                          name={fullName}
                          history={
                            // @ts-ignore
                            imageDetailData.history
                          }
                        />
                      </TabPanel>
                      <TabPanel value="DependsOn" className={classes.tabPanel}>
                        <DependsOn name={fullName} />
                      </TabPanel>
                      <TabPanel value="IsDependentOn" className={classes.tabPanel}>
                        <IsDependentOn name={fullName} />
                      </TabPanel>
                      <TabPanel value="Vulnerabilities" className={classes.tabPanel}>
                        <VulnerabilitiesDetails name={name} tag={tag} />
                      </TabPanel>
                    </Grid>
                  </Grid>
                </Box>
              </TabContext>
            </Grid>
            <Grid item xs={4} className={classes.metadata}>
              <TagDetailsMetadata
                // @ts-ignore
                platform={getPlatform()}
                // @ts-ignore
                size={imageDetailData?.size}
                // @ts-ignore
                lastUpdated={imageDetailData?.lastUpdated}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}

export default TagDetails;
