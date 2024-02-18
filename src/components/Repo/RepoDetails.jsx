// react global
import React, { useEffect, useMemo, useRef, useState } from 'react';

// external
import { DateTime } from 'luxon';
import { isEmpty, uniq } from 'lodash';

// utility
import { api, endpoints } from '../../api';
import { host } from '../../host';
import { useParams, useNavigate, createSearchParams } from 'react-router-dom';
import { mapToRepoFromRepoInfo } from 'utilities/objectModels';
import { isAuthenticated } from 'utilities/authUtilities';

// components
import { Card, CardContent, CardMedia, Chip, Grid, Stack, Tooltip, Typography, IconButton } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Tags from './Tabs/Tags.jsx';
import RepoDetailsMetadata from './RepoDetailsMetadata';
import Loading from '../Shared/Loading';
import { Markdown } from 'utilities/MarkdowntojsxWrapper';
import { VulnerabilityIconCheck, SignatureIconCheck } from 'utilities/vulnerabilityAndSignatureCheck';

// placeholder images
import repocube1 from '../../assets/repocube-1.png';
import repocube2 from '../../assets/repocube-2.png';
import repocube3 from '../../assets/repocube-3.png';
import repocube4 from '../../assets/repocube-4.png';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  pageWrapper: {
    backgroundColor: 'transparent',
    height: '100%'
  },
  repoName: {
    fontWeight: '600',
    fontSize: '1.5rem',
    color: theme.palette.secondary.main,
    textAlign: 'left'
  },
  avatar: {
    height: '1.438rem',
    width: '1.438rem',
    objectFit: 'fill'
  },
  cardBtn: {
    height: '100%',
    width: '100%'
  },
  media: {
    borderRadius: '3.125em'
  },
  tags: {
    marginTop: '1.5rem',
    height: '100%',
    [theme.breakpoints.down('md')]: {
      padding: '0'
    }
  },
  metadata: {
    marginTop: '1.5rem',
    paddingLeft: '1.25rem',
    [theme.breakpoints.down('md')]: {
      marginTop: '1rem',
      paddingLeft: '0'
    }
  },
  card: {
    marginBottom: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    background: '#FFFFFF',
    border: '0.0625rem solid #E0E5EB',
    borderRadius: '0.75rem',
    alignSelf: 'stretch',
    width: '100%',
    boxShadow: 'none!important'
  },
  tagsContent: {
    padding: '1.5rem'
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
    [theme.breakpoints.down('md')]: {
      padding: '0'
    }
  },
  repoTitle: {
    textAlign: 'left',
    fontSize: '1rem',
    lineHeight: '1.5rem',
    color: 'rgba(0, 0, 0, 0.6)',
    padding: '1rem 0 0 0',
    [theme.breakpoints.down('md')]: {
      padding: '0.5rem 0 0 0'
    }
  },
  platformChipsContainer: {
    alignItems: 'center',
    padding: '0.15rem 0 0 0',
    [theme.breakpoints.down('md')]: {
      padding: '0.5rem 0 0 0'
    }
  },
  platformChips: {
    backgroundColor: '#E0E5EB',
    color: '#52637A',
    fontSize: '0.813rem',
    lineHeight: '0.813rem',
    borderRadius: '0.375rem',
    padding: '0.313rem 0.625rem'
  },
  chipLabel: {
    padding: '0'
  },
  vendor: {
    color: theme.palette.primary.main,
    fontSize: '0.75rem',
    maxWidth: '50%',
    textOverflow: 'ellipsis',
    lineHeight: '1.125rem'
  },
  versionLast: {
    color: theme.palette.secondary.dark,
    fontSize: '0.75rem',
    lineHeight: '1.125rem',
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

function RepoDetails() {
  const [repoDetailData, setRepoDetailData] = useState({});
  const [tags, setTags] = useState([]);
  const placeholderImage = useRef(randomImage());
  const [isLoading, setIsLoading] = useState(true);
  // get url param from <Route here (i.e. image name)
  const { name } = useParams();
  const navigate = useNavigate();
  const abortController = useMemo(() => new AbortController(), []);
  const classes = useStyles();

  useEffect(() => {
    setIsLoading(true);
    api
      .get(`${host()}${endpoints.detailedRepoInfo(name)}`, abortController.signal)
      .then((response) => {
        if (response.data && response.data.data) {
          let repoInfo = response.data.data.ExpandedRepoInfo;
          let imageData = mapToRepoFromRepoInfo(repoInfo);
          setRepoDetailData(imageData);
          setTags(imageData.images);
        } else if (!isEmpty(response.data.errors)) {
          navigate('/home');
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

  const handleDeleteTag = (removed) => {
    setTags((prevState) => prevState.filter((tag) => tag.tag !== removed));
  };

  const handlePlatformChipClick = (event) => {
    const { textContent } = event.target;
    event.stopPropagation();
    event.preventDefault();
    navigate({ pathname: `/explore`, search: createSearchParams({ filter: textContent }).toString() });
  };

  const platformChips = () => {
    const platforms = repoDetailData?.platforms || [];
    const filteredPlatforms = platforms?.flatMap((platform) => [platform.Os, platform.Arch]);

    return uniq(filteredPlatforms).map((platform, index) => (
      <Chip
        key={`${name}${platform}${index}`}
        label={platform}
        onClick={handlePlatformChipClick}
        className={classes.platformChips}
        classes={{
          label: classes.chipLabel
        }}
      />
    ));
  };

  const handleBookmarkClick = () => {
    api.put(`${host()}${endpoints.bookmarkToggle(name)}`, abortController.signal).then((response) => {
      if (response && response.status === 200) {
        setRepoDetailData((prevState) => ({
          ...prevState,
          isBookmarked: !prevState.isBookmarked
        }));
      }
    });
  };

  const handleStarClick = () => {
    api.put(`${host()}${endpoints.starToggle(name)}`, abortController.signal).then((response) => {
      if (response.status === 200) {
        setRepoDetailData((prevState) => ({
          ...prevState,
          isStarred: !prevState.isStarred
        }));
      }
    });
  };

  const getVendor = () => {
    return `${repoDetailData.newestTag?.Vendor || 'Vendor not available'} •`;
  };
  const getVersion = () => {
    return `published ${repoDetailData.newestTag?.Tag} •`;
  };
  const getLast = () => {
    const lastDate = repoDetailData.lastUpdated
      ? DateTime.fromISO(repoDetailData.lastUpdated).toRelative({ unit: ['weeks', 'days', 'hours', 'minutes'] })
      : `Timestamp N/A`;
    return lastDate;
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Grid container className={classes.pageWrapper}>
          <Grid item xs={12} md={12}>
            <Card className={classes.cardRoot}>
              <CardContent>
                <Grid container className={classes.header}>
                  <Grid item xs={12} md={8}>
                    <Stack alignItems="center" direction={{ xs: 'column', md: 'row' }} spacing={2}>
                      <Stack alignItems="center" sx={{ width: { xs: '100%', md: 'auto' } }} direction="row" spacing={2}>
                        <CardMedia
                          classes={{
                            root: classes.media,
                            img: classes.avatar
                          }}
                          component="img"
                          image={placeholderImage.current}
                          alt="icon"
                        />
                        <Typography variant="h4" className={classes.repoName}>
                          {name}
                        </Typography>
                      </Stack>
                      <Stack alignItems="center" sx={{ width: { xs: '100%', md: 'auto' } }} direction="row" spacing={2}>
                        <VulnerabilityIconCheck vulnerabilitySeverity={repoDetailData?.vulnerabilitySeverity} />
                        <SignatureIconCheck
                          isSigned={repoDetailData.isSigned}
                          signatureInfo={repoDetailData.signatureInfo}
                        />
                      </Stack>
                      <Stack alignItems="center" sx={{ width: { xs: '100%', md: 'auto' } }} direction="row" spacing={1}>
                        {isAuthenticated() && (
                          <IconButton component="span" onClick={handleStarClick} data-testid="star-button">
                            {repoDetailData?.isStarred ? (
                              <StarIcon data-testid="starred" />
                            ) : (
                              <StarBorderIcon data-testid="not-starred" />
                            )}
                          </IconButton>
                        )}
                        {isAuthenticated() && (
                          <IconButton component="span" onClick={handleBookmarkClick} data-testid="bookmark-button">
                            {repoDetailData?.isBookmarked ? (
                              <BookmarkIcon data-testid="bookmarked" />
                            ) : (
                              <BookmarkBorderIcon data-testid="not-bookmarked" />
                            )}
                          </IconButton>
                        )}
                      </Stack>
                    </Stack>
                    <Typography gutterBottom className={classes.repoTitle}>
                      {repoDetailData?.title || 'Title not available'}
                    </Typography>
                    <Stack direction="row" spacing={1} className={classes.platformChipsContainer}>
                      {platformChips()}
                    </Stack>
                    <Stack alignItems="center" direction="row" spacing={1} pt={'0.5rem'}>
                      <Tooltip title={getVendor()} placement="top" className="hide-on-mobile">
                        <Typography className={classes.vendor} variant="body2" noWrap>
                          {<Markdown options={{ forceInline: true }}>{getVendor()}</Markdown>}
                        </Typography>
                      </Tooltip>
                      <Tooltip title={getVersion()} placement="top" className="hide-on-mobile">
                        <Typography className={classes.versionLast} variant="body2" noWrap>
                          {getVersion()}
                        </Typography>
                      </Tooltip>
                      <Tooltip title={repoDetailData.lastUpdated?.slice(0, 16) || ' '} placement="top">
                        <Typography className={classes.versionLast} variant="body2" noWrap>
                          {getLast()}
                        </Typography>
                      </Tooltip>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8} className={classes.tags}>
            <Card className={classes.cardRoot}>
              <CardContent className={classes.tagsContent}>
                <Tags tags={tags} repoName={name} onTagDelete={handleDeleteTag} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} className={classes.metadata}>
            <RepoDetailsMetadata
              totalDownloads={repoDetailData?.downloads}
              repoURL={repoDetailData?.source}
              lastUpdated={repoDetailData?.lastUpdated}
              size={repoDetailData?.size}
              latestTag={repoDetailData?.newestTag}
              license={repoDetailData?.license}
              description={repoDetailData?.description}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
}
export default RepoDetails;
