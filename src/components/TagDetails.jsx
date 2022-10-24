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
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import makeStyles from '@mui/styles/makeStyles';
import { host } from '../host';

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
import { isEmpty } from 'lodash';
import Loading from './Loading';
import { dockerPull, podmanPull, skopeoPull } from 'utilities/pullStrings';
import { VulnerabilityIconCheck, SignatureIconCheck } from 'utilities/vulnerabilityAndSignatureCheck';

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
    width: '3rem',
    objectFit: 'fill'
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
  pull: {
    paddingLeft: '1.5rem',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%'
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
  copyStringSelect: {
    '& fieldset': {
      border: '0.125rem solid #52637A'
    },
    m: '0.5rem 0',
    borderRadius: '0.5rem',
    color: '#14191F',
    alignContent: 'left'
  },
  cardRoot: {
    boxShadow: 'none!important'
  },
  header: {
    paddingLeft: '2rem'
  },
  textEllipsis: {
    textOverflow: 'ellipsis'
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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Layers');
  const abortController = useMemo(() => new AbortController(), []);

  // get url param from <Route here (i.e. image name)
  const { name, tag } = useParams();
  const [fullName, setFullName] = useState(name + ':' + tag);

  const [pullString, setPullString] = useState('');
  const [snackBarOpen, setSnackbarOpen] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    // if same-page navigation because of tag update, following 2 lines help ux
    setSelectedTab('Layers');
    window?.scrollTo(0, 0);
    setIsLoading(true);
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
            history: imageInfo.History,
            license: imageInfo.Licenses,
            vulnerabiltySeverity: imageInfo.Vulnerabilities?.MaxSeverity,
            vulnerabilityCount: imageInfo.Vulnerabilities?.Count,
            isSigned: imageInfo.IsSigned,
            logo: imageInfo.Logo
          };
          setImageDetailData(imageData);
          setFullName(imageData.name + ':' + imageData.tag);
          setPullString(dockerPull(imageData.name + ':' + imageData.tag));
          setIsLoading(false);
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

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={classes.pageWrapper}>
          <Card className={classes.cardRoot}>
            <CardContent>
              <Grid container>
                <Grid item xs={8} className={classes.header}>
                  <Stack alignItems="center" direction="row" spacing={2}>
                    <CardMedia
                      classes={{
                        root: classes.media,
                        img: classes.avatar
                      }}
                      component="img"
                      image={
                        // @ts-ignore
                        // eslint-disable-next-line prettier/prettier
                        !isEmpty(imageDetailData?.logo)
                          ? // @ts-ignore
                            `data:image/  png;base64, ${imageDetailData?.logo}`
                          : randomImage()
                      }
                      alt="icon"
                    />
                    <Typography variant="h3" className={classes.repoName}>
                      {name}:{tag}
                    </Typography>
                    <VulnerabilityIconCheck
                      vulnerabilitySeverity={
                        // @ts-ignore
                        imageDetailData.vulnerabiltySeverity
                      }
                    />
                    <SignatureIconCheck
                      isSigned={
                        // @ts-ignore
                        imageDetailData.isSigned
                      }
                    />
                    {/* <BookmarkIcon sx={{color:"#52637A"}}/> */}
                  </Stack>
                  <Typography
                    pt={1}
                    sx={{ fontSize: 16, lineHeight: '1.5rem', color: 'rgba(0, 0, 0, 0.6)', paddingLeft: '4rem' }}
                    gutterBottom
                    align="left"
                  >
                    DIGEST:{' '}
                    {
                      // @ts-ignore
                      imageDetailData?.digest
                    }
                  </Typography>
                </Grid>
                <Grid item xs={4} className={classes.pull}>
                  <Grid container>
                    <Grid item xs={10}>
                      <Typography
                        variant="body1"
                        sx={{ color: '#52637A', fontSize: '1rem', paddingTop: '0.75rem', textAlign: 'left' }}
                      >
                        Pull this image
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton
                        aria-label="copy"
                        onClick={() => {
                          navigator.clipboard.writeText(pullString);
                          setSnackbarOpen(true);
                        }}
                        data-testid="pullcopy-btn"
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <FormControl variant="outlined" sx={{ width: '100%' }}>
                    <Select
                      className={classes.copyStringSelect}
                      value={pullString}
                      onChange={handleSelectionChange}
                      inputProps={{ 'aria-label': 'Without label' }}
                      MenuProps={{
                        disableScrollLock: true,
                        classes: { root: classes.copyStringSelect, list: classes.textEllipsis }
                      }}
                    >
                      <MenuItem value={dockerPull(fullName)}>
                        <Typography noWrap>{dockerPull(fullName)}</Typography>
                      </MenuItem>
                      <MenuItem value={podmanPull(fullName)}>
                        <Typography noWrap>{podmanPull(fullName)}</Typography>
                      </MenuItem>
                      <MenuItem value={skopeoPull(fullName)}>
                        <Typography noWrap>{skopeoPull(fullName)}</Typography>
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
                        <Tab
                          value="DependsOn"
                          label="Uses"
                          className={classes.tabContent}
                          data-testid="dependencies-tab"
                        />
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
                    // @ts-ignore
                    license={imageDetailData?.license}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
      )}
      <Snackbar
        open={snackBarOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={3000}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Alert variant="filled" severity="success" sx={{ width: '100%' }}>
          Copied!
        </Alert>
      </Snackbar>
    </>
  );
}

export default TagDetails;
