// react global
import React, { useRef, useMemo, useState } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';

// utility
import { DateTime } from 'luxon';
import { uniq } from 'lodash';

// api module
import { api, endpoints } from '../../api';
import { host } from '../../host';
import { isAuthenticated } from '../../utilities/authUtilities';

// components
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  Chip,
  Grid,
  Tooltip,
  IconButton,
  useMediaQuery
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useTheme } from '@emotion/react';

// placeholder images
import repocube1 from '../../assets/repocube-1.png';
import repocube2 from '../../assets/repocube-2.png';
import repocube3 from '../../assets/repocube-3.png';
import repocube4 from '../../assets/repocube-4.png';

import { VulnerabilityIconCheck, SignatureIconCheck } from 'utilities/vulnerabilityAndSignatureCheck';
import { Markdown } from 'utilities/MarkdowntojsxWrapper';

// temporary utility to get image
const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomImage = () => {
  const imageArray = [repocube1, repocube2, repocube3, repocube4];
  return imageArray[randomIntFromInterval(0, 3)];
};

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
    borderRadius: '0.75rem',
    boxShadow: '0rem 0.313rem 0.625rem rgba(131, 131, 131, 0.08)',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    width: '100%',
    maxWidth: '72rem',
    '&:hover': {
      boxShadow: '0rem 1.1875rem 1.4375rem rgba(131, 131, 131, 0.19)',
      borderRadius: '0.75rem'
    }
  },
  avatar: {
    height: '1.4375rem',
    width: '1.4375rem',
    objectFit: 'fill'
  },
  cardBtn: {
    height: '100%',
    width: '100%',
    borderRadius: '0.75rem',
    borderColor: '#FFFFFF',
    '&:hover $focusHighlight': {
      opacity: 0
    }
  },
  focusHighlight: {},
  media: {
    borderRadius: '3.125rem'
  },
  content: {
    textAlign: 'left',
    color: '#606060',
    maxHeight: '9.25rem',
    backgroundColor: '#FFFFFF',
    padding: '1.188rem 1rem',
    '&:hover': {
      backgroundColor: '#FFFFFF'
    }
  },
  contentRight: {
    justifyContent: 'flex-end',
    textAlign: 'end'
  },
  contentRightLabel: {
    fontSize: '0.75rem',
    lineHeight: '1.125rem',
    color: '#52637A',
    textAlign: 'end'
  },
  contentRightValue: {
    fontSize: '0.75rem',
    lineHeight: '1.125rem',
    fontWeight: '600',
    color: '#14191F',
    textAlign: 'end',
    marginLeft: '0.5rem'
  },
  contentRightActions: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  signedBadge: {
    color: '#9ccc65',
    height: '1.375rem',
    width: '1.375rem',
    marginLeft: 10
  },
  vendor: {
    color: theme.palette.primary.main,
    fontSize: '0.75rem',
    maxWidth: '50%',
    textOverflow: 'ellipsis',
    lineHeight: '1.125rem'
  },
  description: {
    color: '#52637A',
    fontSize: '1rem',
    lineHeight: '1.5rem',
    textOverflow: 'ellipsis',
    marginBottom: 0,
    paddingTop: '1rem'
  },
  versionLast: {
    color: theme.palette.secondary.dark,
    fontSize: '0.75rem',
    lineHeight: '1.125rem',
    textOverflow: 'ellipsis'
  },
  cardTitle: {
    textOverflow: 'ellipsis',
    maxWidth: '70%',
    fontWeight: '600',
    color: '#0F2139',
    lineHeight: '2rem'
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
  }
}));

function RepoCard(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const placeholderImage = useRef(randomImage());
  // dynamically check device size with mui media query hook
  const theme = useTheme();
  const isXsSize = useMediaQuery(theme.breakpoints.down('md'));
  const MAX_PLATFORM_CHIPS = isXsSize ? 3 : 6;

  const abortController = useMemo(() => new AbortController(), []);

  const {
    name,
    vendor,
    platforms,
    description,
    downloads,
    stars,
    isSigned,
    signatureInfo,
    lastUpdated,
    version,
    vulnerabilityData,
    isBookmarked,
    isStarred
  } = props;

  // keep a local bookmark state to display in the ui dynamically on updates
  const [currentBookmarkValue, setCurrentBookmarkValue] = useState(isBookmarked);

  // keep a local star state to display in the ui dynamically on updates
  const [currentStarValue, setCurrentStarValue] = useState(isStarred);

  const [currentStarCount, setCurrentStarCount] = useState(stars);

  const goToDetails = () => {
    navigate(`/image/${encodeURIComponent(name)}`);
  };

  const handlePlatformChipClick = (event) => {
    const { textContent } = event.target;
    event.stopPropagation();
    event.preventDefault();
    navigate({ pathname: `/explore`, search: createSearchParams({ filter: textContent }).toString() });
  };

  const handleBookmarkClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    api.put(`${host()}${endpoints.bookmarkToggle(name)}`, abortController.signal).then((response) => {
      if (response.status === 200) {
        setCurrentBookmarkValue((prevState) => !prevState);
      }
    });
  };

  const handleStarClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    api.put(`${host()}${endpoints.starToggle(name)}`, abortController.signal).then((response) => {
      if (response.status === 200) {
        setCurrentStarValue((prevState) => !prevState);
        currentStarValue
          ? setCurrentStarCount((prevState) => {
              return !isNaN(prevState) ? prevState - 1 : prevState;
            })
          : setCurrentStarCount((prevState) => {
              return !isNaN(prevState) ? prevState + 1 : prevState;
            });
      }
    });
  };

  const platformChips = () => {
    const filteredPlatforms = uniq(platforms?.flatMap((platform) => [platform.Os, platform.Arch]));
    const hiddenChips = filteredPlatforms.length - MAX_PLATFORM_CHIPS;
    const displayedPlatforms = filteredPlatforms.slice(0, MAX_PLATFORM_CHIPS + 1);
    if (hiddenChips > 0) displayedPlatforms.push(`+${hiddenChips} more`);
    return displayedPlatforms.map((platform, index) => (
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

  const getVendor = () => {
    return `${vendor || 'Vendor not available'} •`;
  };
  const getVersion = () => {
    return `published ${version} •`;
  };
  const getLast = () => {
    const lastDate = lastUpdated
      ? DateTime.fromISO(lastUpdated).toRelative({ unit: ['weeks', 'days', 'hours', 'minutes'] })
      : `Timestamp N/A`;
    return lastDate;
  };

  const renderBookmark = () => {
    return (
      isAuthenticated() && (
        <IconButton component="span" onClick={handleBookmarkClick} data-testid="bookmark-button">
          {currentBookmarkValue ? (
            <BookmarkIcon data-testid="bookmarked" />
          ) : (
            <BookmarkBorderIcon data-testid="not-bookmarked" />
          )}
        </IconButton>
      )
    );
  };

  const renderStar = () => {
    return (
      isAuthenticated() && (
        <IconButton component="span" onClick={handleStarClick} data-testid="star-button">
          {currentStarValue ? <StarIcon data-testid="starred" /> : <StarBorderIcon data-testid="not-starred" />}
        </IconButton>
      )
    );
  };

  return (
    <Card variant="outlined" className={classes.card} data-testid="repo-card">
      <CardActionArea
        onClick={goToDetails}
        classes={{
          root: classes.cardBtn,
          focusHighlight: classes.focusHighlight
        }}
      >
        <CardContent className={classes.content}>
          <Grid container>
            <Grid item xs={12} md={10}>
              <Stack alignItems="center" direction="row" spacing={2}>
                <CardMedia
                  classes={{
                    root: classes.media,
                    img: classes.avatar
                  }}
                  component="img"
                  image={placeholderImage.current}
                  alt="icon"
                />
                <Tooltip title={name} placement="top">
                  <Typography variant="h5" component="div" noWrap className={classes.cardTitle}>
                    {name}
                  </Typography>
                </Tooltip>
                <div className="hide-on-mobile">
                  <VulnerabilityIconCheck {...vulnerabilityData} className="hide-on-mobile" />
                </div>
                <div className="hide-on-mobile">
                  <SignatureIconCheck isSigned={isSigned} signatureInfo={signatureInfo} className="hide-on-mobile" />
                </div>
              </Stack>
              <Tooltip title={description || 'Description not available'} placement="top">
                <Typography className={classes.description} pt={1} sx={{ fontSize: 12 }} gutterBottom noWrap>
                  {description || 'Description not available'}
                </Typography>
              </Tooltip>
              <Stack alignItems="center" direction="row" spacing={1} pt={1}>
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
                <Tooltip title={lastUpdated?.slice(0, 16) || ' '} placement="top">
                  <Typography className={classes.versionLast} variant="body2" noWrap>
                    {getLast()}
                  </Typography>
                </Tooltip>
              </Stack>
            </Grid>
            <Grid item container xs={2} md={2} className={`hide-on-mobile ${classes.contentRight}`}>
              <Grid item xs={12}>
                <Typography variant="body2" component="span" className={classes.contentRightLabel}>
                  Downloads •
                </Typography>
                <Typography variant="body2" component="span" className={classes.contentRightValue}>
                  {!isNaN(downloads) ? downloads : `not available`}
                </Typography>
              </Grid>
              {/* <Grid item xs={12}>
                  <Typography variant="body2" component="span" className={classes.contentRightLabel}>
                    Rating •
                  </Typography>
                  <Typography variant="body2" component="span" className={classes.contentRightValue}>
                    #1
                  </Typography>
                </Grid> */}
              <Grid item xs={12}>
                {renderStar()}
                <Typography variant="body2" component="span" className={classes.contentRightLabel}>
                  Stars •
                </Typography>
                <Typography variant="body2" component="span" className={classes.contentRightValue}>
                  {!isNaN(currentStarCount) ? currentStarCount : `not available`}
                </Typography>
              </Grid>
              <Grid container item xs={12} className={classes.contentRightActions}>
                <Grid item>{renderBookmark()}</Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default RepoCard;
