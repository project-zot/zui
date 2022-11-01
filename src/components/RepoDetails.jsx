// react global
import { useParams } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';

// utility
import { api, endpoints } from '../api';

// components
import Tags from './Tags.jsx';
import { Box, Card, CardContent, CardMedia, Chip, Grid, Stack, Tab, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { host } from '../host';

// placeholder images
import repocube1 from '../assets/repocube-1.png';
import repocube2 from '../assets/repocube-2.png';
import repocube3 from '../assets/repocube-3.png';
import repocube4 from '../assets/repocube-4.png';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import RepoDetailsMetadata from './RepoDetailsMetadata';
import Loading from './Loading';
import { isEmpty } from 'lodash';
import { VulnerabilityIconCheck, SignatureIconCheck } from 'utilities/vulnerabilityAndSignatureCheck';
import { mapToRepoFromRepoInfo } from 'utilities/objectModels';

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
    textAlign: 'left',
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

function RepoDetails() {
  const [repoDetailData, setRepoDetailData] = useState({});
  const [tags, setTags] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Overview');
  // get url param from <Route here (i.e. image name)
  const { name } = useParams();
  const abortController = useMemo(() => new AbortController(), []);
  const classes = useStyles();

  useEffect(() => {
    api
      .get(`${host()}${endpoints.detailedRepoInfo(name)}`, abortController.signal)
      .then((response) => {
        if (response.data && response.data.data) {
          let repoInfo = response.data.data.ExpandedRepoInfo;
          let imageData = mapToRepoFromRepoInfo(repoInfo);
          setRepoDetailData(imageData);
          setTags(imageData.images);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setRepoDetailData({});
        setIsLoading(false);
        setTags([]);
      });
    return () => {
      abortController.abort();
    };
  }, [name]);

  const platformChips = () => {
    const platforms = repoDetailData?.platforms || [];

    return platforms.map((platform, index) => (
      <Stack key={`stack${platform?.Os}${platform?.Arch}`} alignItems="center" direction="row" spacing={2}>
        <Chip
          key={`${name}${platform?.Os}${index}`}
          label={platform?.Os}
          sx={{
            backgroundColor: '#E0E5EB',
            color: '#52637A',
            fontSize: '0.8125rem'
          }}
        />
        <Chip
          key={`${name}${platform?.Arch}${index}`}
          label={platform?.Arch}
          sx={{
            backgroundColor: '#E0E5EB',
            color: '#52637A',
            fontSize: '0.8125rem'
          }}
        />
      </Stack>
    ));
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const renderOverview = () => {
    return (
      <Card className={classes.card} data-testid="overview-container">
        <CardContent>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(0, 0, 0, 0.6)',
              fontSize: '1rem',
              lineHeight: '150%',
              marginTop: '5%',
              alignSelf: 'stretch'
            }}
          >
            {repoDetailData.description || 'Description not available'}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
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
                      // eslint-disable-next-line prettier/prettier
                      image={
                        !isEmpty(repoDetailData?.logo)
                          ? `data:image/png;base64, ${repoDetailData?.logo}`
                          : randomImage()
                      }
                      alt="icon"
                    />
                    <Typography variant="h3" className={classes.repoName}>
                      {name}
                    </Typography>
                    <VulnerabilityIconCheck
                      vulnerabilitySeverity={repoDetailData.vulnerabiltySeverity}
                      count={repoDetailData?.vulnerabilityCount}
                    />
                    <SignatureIconCheck isSigned={repoDetailData.isSigned} />
                    {/* <BookmarkIcon sx={{color:"#52637A"}}/> */}
                  </Stack>
                  <Typography
                    pt={1}
                    sx={{ fontSize: 16, lineHeight: '1.5rem', color: 'rgba(0, 0, 0, 0.6)', paddingLeft: '4rem' }}
                    gutterBottom
                    align="left"
                  >
                    {repoDetailData?.title || 'Title not available'}
                  </Typography>
                  <Stack alignItems="center" sx={{ paddingLeft: '4rem' }} direction="row" spacing={2} pt={1}>
                    {platformChips()}
                  </Stack>
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
                        <Tab value="Overview" label="Overview" className={classes.tabContent} />
                        <Tab value="Tags" label="Tags" className={classes.tabContent} />
                      </TabList>
                      <Grid container>
                        <Grid item xs={12}>
                          <TabPanel value="Overview" className={classes.tabPanel}>
                            {renderOverview()}
                          </TabPanel>
                          <TabPanel value="Tags" className={classes.tabPanel}>
                            <Tags tags={tags} />
                          </TabPanel>
                        </Grid>
                      </Grid>
                    </Box>
                  </TabContext>
                </Grid>
                <Grid item xs={4} className={classes.metadata}>
                  <RepoDetailsMetadata
                    totalDownloads={repoDetailData?.downloads}
                    repoURL={repoDetailData?.source}
                    lastUpdated={repoDetailData?.lastUpdated}
                    size={repoDetailData?.size}
                    latestTag={repoDetailData?.newestTag}
                    license={repoDetailData?.license}
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
export default RepoDetails;
