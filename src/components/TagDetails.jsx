import { useParams } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';

// utility
import { api, endpoints } from '../api';
import { mapToImage } from '../utilities/objectModels';
// components
import {
  Box,
  Button,
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
  InputBase
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TagDetailsMetadata from './TagDetailsMetadata';
import VulnerabilitiesDetails from './VulnerabilitiesDetails';
import HistoryLayers from './HistoryLayers';
import DependsOn from './DependsOn';
import IsDependentOn from './IsDependentOn';
import { isEmpty } from 'lodash';
import Loading from './Loading';
import { dockerPull, podmanPull, skopeoPull } from 'utilities/pullStrings';
import { VulnerabilityIconCheck, SignatureIconCheck } from 'utilities/vulnerabilityAndSignatureCheck';

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
  selectedPullTab: {
    background: '#D83C0E',
    borderRadius: '1.5rem'
  },
  tabPanel: {
    height: '100%',
    paddingLeft: '0rem!important',
    marginRight: '2rem!important'
  },
  metadata: {
    marginTop: '8rem',
    paddingLeft: '1.5rem'
  },
  pull: {
    paddingLeft: '1.5rem',
    justifyContent: 'flex-start'
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
    boxShadow: 'none!important'
  },
  copyStringSelect: {
    '& fieldset': {
      border: ' 0.0625rem solid #52637A'
    },
    width: '20.625rem',
    color: '#14191F',
    borderRadius: '0.5rem',
    textAlign: 'left'
  },
  cardRoot: {
    boxShadow: 'none!important'
  },
  header: {
    paddingLeft: '2rem'
  },
  tabBox: {
    padding: '0.5rem'
  },
  pullText: {
    width: '14.5rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  textEllipsis: {
    padding: '0rem 1rem'
  },
  inputTextEllipsis: {
    width: '16.125rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: '0rem',
    border: 'none'
  },
  pullStringBox: {
    width: '19.365rem',
    border: '0.0625rem solid rgba(0, 0, 0, 0.23)',
    borderRadius: '0.5rem',
    padding: '0rem 0rem',
    fontSize: '1rem'
  },
  pullStringBoxCopied: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#2EAE4E',
    padding: '0rem 1rem 0rem 1rem',
    fontFamily: 'Roboto',
    fontSize: '1rem',
    color: '#FFFFFF',
    width: '20.625rem',
    border: '0.0625rem solid rgba(0, 0, 0, 0.23)',
    borderRadius: '0.5rem',
    height: '3.5rem',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#2EAE4E'
    }
  },
  focus: {
    backgroundColor: '#FFFFFF'
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
  const [selectedPullTab, setSelectedPullTab] = useState('');
  const abortController = useMemo(() => new AbortController(), []);

  // get url param from <Route here (i.e. image name)
  const { reponame, tag } = useParams();

  const [pullString, setPullString] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    // if same-page navigation because of tag update, following 2 lines help ux
    setSelectedTab('Layers');
    window?.scrollTo(0, 0);
    setIsLoading(true);
    api
      .get(`${host()}${endpoints.detailedImageInfo(reponame, tag)}`, abortController.signal)
      .then((response) => {
        if (response.data && response.data.data) {
          let imageInfo = response.data.data.Image;
          let imageData = mapToImage(imageInfo);
          setImageDetailData(imageData);
          setPullString(dockerPull(imageData.name));
          setSelectedPullTab(dockerPull(imageData.name));
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setImageDetailData({});
        setIsLoading(false);
      });
    return () => {
      abortController.abort();
    };
  }, [reponame, tag]);

  const getPlatform = () => {
    return imageDetailData?.platform ? imageDetailData.platform : '--/--';
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handlePullTabChange = (event, newValue) => {
    setSelectedPullTab(newValue);
    setPullString(newValue);
  };

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  }, [isCopied]);

  const handleRenderPullString = () => {
    return 'Pull Image';
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
                        !isEmpty(imageDetailData?.logo)
                          ? `data:image/  png;base64, ${imageDetailData?.logo}`
                          : randomImage()
                      }
                      alt="icon"
                    />
                    <Typography variant="h3" className={classes.repoName}>
                      {reponame}:{tag}
                    </Typography>
                    <VulnerabilityIconCheck
                      vulnerabilitySeverity={imageDetailData.vulnerabiltySeverity}
                      count={imageDetailData.vulnerabilityCount}
                    />
                    <SignatureIconCheck isSigned={imageDetailData.isSigned} />
                    {/* <BookmarkIcon sx={{color:"#52637A"}}/> */}
                  </Stack>
                  <Typography
                    pt={1}
                    sx={{ fontSize: 16, lineHeight: '1.5rem', color: 'rgba(0, 0, 0, 0.6)', paddingLeft: '4rem' }}
                    gutterBottom
                    align="left"
                  >
                    DIGEST: {imageDetailData?.digest}
                  </Typography>
                </Grid>
                <Grid item xs={4} className={classes.pull}>
                  {isCopied ? (
                    <Button className={classes.pullStringBoxCopied} data-testid="successPulled-buton">
                      Copied Pull Command
                      <CheckCircleIcon />
                    </Button>
                  ) : (
                    <FormControl variant="outlined" sx={{ width: '100%', height: '3.5rem' }}>
                      <Select
                        className={classes.copyStringSelect}
                        value={''}
                        displayEmpty={true}
                        renderValue={handleRenderPullString}
                        inputProps={{ 'aria-label': 'Without label' }}
                        MenuProps={{
                          disableScrollLock: true,
                          classes: { root: classes.copyStringSelect }
                        }}
                        data-testid="pull-dropdown"
                      >
                        <MenuItem
                          sx={{
                            width: '100%',
                            overflow: 'hidden',
                            padding: '0rem',
                            '&:hover': { backgroundColor: '#FFFFFF' },
                            '&:focus': { backgroundColor: '#FFFFFF' },
                            '&.Mui-focusVisible': {
                              backgroundColor: '#FFFFFF!important'
                            }
                          }}
                          data-testid="pull-meniuItem"
                        >
                          <TabContext value={selectedPullTab}>
                            <Box>
                              <TabList
                                onChange={handlePullTabChange}
                                TabIndicatorProps={{ className: classes.selectedPullTab }}
                                sx={{ '& button.Mui-selected': { color: '#14191F', fontWeight: '600' } }}
                              >
                                <Tab
                                  value={dockerPull(imageDetailData.name)}
                                  label="Docker"
                                  className={classes.tabContent}
                                />
                                <Tab
                                  value={podmanPull(imageDetailData.name)}
                                  label="Podman"
                                  className={classes.tabContent}
                                />
                                <Tab
                                  value={skopeoPull(imageDetailData.name)}
                                  label="Skopeo"
                                  className={classes.tabContent}
                                />
                              </TabList>
                              <Grid container>
                                <Grid item xs={12}>
                                  <TabPanel value={dockerPull(imageDetailData.name)} className={classes.tabPanel}>
                                    <Box className={classes.tabBox}>
                                      <Grid container item xs={12} className={classes.pullStringBox}>
                                        <Grid item xs={10}>
                                          <InputBase
                                            classes={{ input: classes.pullText }}
                                            className={classes.textEllipsis}
                                            defaultValue={dockerPull(imageDetailData.name)}
                                          />
                                        </Grid>
                                        <Grid
                                          item
                                          xs={2}
                                          sx={{
                                            borderLeft: '0.0625rem solid rgba(0, 0, 0, 0.23)',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'center'
                                          }}
                                        >
                                          <IconButton
                                            aria-label="copy"
                                            onClick={() => {
                                              navigator.clipboard.writeText(pullString);
                                              setIsCopied(true);
                                            }}
                                            data-testid="pullcopy-btn"
                                          >
                                            <ContentCopyIcon sx={{ fontSize: '1rem' }} />
                                          </IconButton>
                                        </Grid>
                                      </Grid>
                                    </Box>
                                  </TabPanel>
                                  <TabPanel value={podmanPull(imageDetailData.name)} className={classes.tabPanel}>
                                    <Box className={classes.tabBox}>
                                      <Grid container item xs={12} className={classes.pullStringBox}>
                                        <Grid item xs={10}>
                                          <InputBase
                                            classes={{ input: classes.pullText }}
                                            className={classes.textEllipsis}
                                            defaultValue={podmanPull(imageDetailData.name)}
                                            data-testid="podman-input"
                                          />
                                        </Grid>
                                        <Grid
                                          item
                                          xs={2}
                                          sx={{
                                            borderLeft: '0.0625rem solid rgba(0, 0, 0, 0.23)',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'center'
                                          }}
                                        >
                                          <IconButton
                                            aria-label="copy"
                                            onClick={() => {
                                              navigator.clipboard.writeText(pullString);
                                              setIsCopied(true);
                                            }}
                                            data-testid="podmanPullcopy-btn"
                                          >
                                            <ContentCopyIcon sx={{ fontSize: '1rem' }} />
                                          </IconButton>
                                        </Grid>
                                      </Grid>
                                    </Box>
                                  </TabPanel>
                                  <TabPanel value={skopeoPull(imageDetailData.name)} className={classes.tabPanel}>
                                    <Box className={classes.tabBox}>
                                      <Grid container item xs={12} className={classes.pullStringBox}>
                                        <Grid item xs={10}>
                                          <InputBase
                                            classes={{ input: classes.pullText }}
                                            className={classes.textEllipsis}
                                            defaultValue={skopeoPull(imageDetailData.name)}
                                          />
                                        </Grid>
                                        <Grid
                                          item
                                          xs={2}
                                          sx={{
                                            borderLeft: '0.0625rem solid rgba(0, 0, 0, 0.23)',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'center'
                                          }}
                                        >
                                          <IconButton
                                            aria-label="copy"
                                            onClick={() => {
                                              navigator.clipboard.writeText(pullString);
                                              setIsCopied(true);
                                            }}
                                            data-testid="skopeoPullcopy-btn"
                                          >
                                            <ContentCopyIcon sx={{ fontSize: '1rem' }} />
                                          </IconButton>
                                        </Grid>
                                      </Grid>
                                    </Box>
                                  </TabPanel>
                                </Grid>
                              </Grid>
                            </Box>
                          </TabContext>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}
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
                            <HistoryLayers name={imageDetailData.name} history={imageDetailData.history} />
                          </TabPanel>
                          <TabPanel value="DependsOn" className={classes.tabPanel}>
                            <DependsOn name={imageDetailData.name} />
                          </TabPanel>
                          <TabPanel value="IsDependentOn" className={classes.tabPanel}>
                            <IsDependentOn name={imageDetailData.name} />
                          </TabPanel>
                          <TabPanel value="Vulnerabilities" className={classes.tabPanel}>
                            <VulnerabilitiesDetails name={reponame} tag={tag} />
                          </TabPanel>
                        </Grid>
                      </Grid>
                    </Box>
                  </TabContext>
                </Grid>
                <Grid item xs={4} className={classes.metadata}>
                  <TagDetailsMetadata
                    platform={getPlatform()}
                    size={imageDetailData?.size}
                    lastUpdated={imageDetailData?.lastUpdated}
                    license={imageDetailData?.license}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

export default TagDetails;
