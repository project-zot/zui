import { useLocation, useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useMemo, useState, useRef } from 'react';

// utility
import { api, endpoints } from '../../api';
import { host } from '../../host';
import { mapToImage } from '../../utilities/objectModels';
import { isEmpty, head } from 'lodash';

// components
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  FormControl,
  Stack,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  InputLabel
} from '@mui/material';
import TagDetailsMetadata from './TagDetailsMetadata';
import VulnerabilitiesDetails from './Tabs/VulnerabilitiesDetails';
import HistoryLayers from './Tabs/HistoryLayers';
import DependsOn from './Tabs/DependsOn';
import IsDependentOn from './Tabs/IsDependentOn';
import Loading from '../Shared/Loading';
import { VulnerabilityIconCheck, SignatureIconCheck } from 'utilities/vulnerabilityAndSignatureCheck';
import ReferredBy from './Tabs/ReferredBy';
import makeStyles from '@mui/styles/makeStyles';

// placeholder images
import repocube1 from '../../assets/repocube-1.png';
import repocube2 from '../../assets/repocube-2.png';
import repocube3 from '../../assets/repocube-3.png';
import repocube4 from '../../assets/repocube-4.png';

const useStyles = makeStyles((theme) => ({
  pageWrapper: {
    backgroundColor: 'transparent',
    display: 'flex',
    marginBottom: '3%'
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
  digest: {
    textAlign: 'left',
    fontSize: '1rem',
    lineHeight: '1.5rem',
    color: '#52637A',
    maxWidth: '100%',
    [theme.breakpoints.down('md')]: {
      padding: '0.5rem 0 0 0',
      fontSize: '0.5rem'
    }
  },
  media: {
    borderRadius: '3.125em'
  },
  tabsContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    margin: '1.625rem 0'
  },
  tabs: {
    borderRadius: '0.375rem'
  },
  tabsButtons: {
    backgroundColor: '#F6F7F9',
    color: '#656C75',
    border: '2px solid #E0E5EB',
    borderRadius: '0.375rem',
    padding: '0.313rem 0.75rem',
    textTransform: 'none',
    fontWeight: '700',
    fontSize: '0.875rem',
    marginLeft: '0!important',
    '&.Mui-selected': {
      backgroundColor: 'rgba(15, 33, 57, 0.05)',
      color: theme.palette.secondary.main,
      border: '2px solid #0F2139!important'
    }
  },
  tabContent: {
    height: '100%',
    [theme.breakpoints.down('md')]: {
      padding: '0'
    }
  },
  metadata: {
    paddingLeft: '1.25rem',
    [theme.breakpoints.down('md')]: {
      marginTop: '1rem',
      paddingLeft: '0'
    }
  },
  cardContent: {
    paddingBottom: '1rem'
  },
  tabCardContent: {
    padding: '1.5rem'
  },
  cardRoot: {
    boxShadow: 'none!important',
    borderRadius: '0.75rem'
  },
  header: {
    letterSpacing: '-0.01rem',
    [theme.breakpoints.down('md')]: {
      padding: '0'
    }
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
  const [selectedManifest, setSelectedManifest] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Layers');
  const placeholderImage = useRef(randomImage());
  const abortController = useMemo(() => new AbortController(), []);
  const navigate = useNavigate();

  // check for optional preselected digest
  const { state } = useLocation() || {};
  const { digest } = state || '';

  // get url param from <Route here (i.e. image name)
  const { reponame, tag } = useParams();

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
          if (!isEmpty(digest)) {
            const preselectedManifest = imageData.manifests?.find((el) => el.digest === digest);
            if (preselectedManifest) {
              setSelectedManifest(preselectedManifest);
            } else {
              setSelectedManifest(head(imageData.manifests));
            }
          } else {
            setSelectedManifest(head(imageData.manifests));
          }
        } else if (!isEmpty(response.data.errors)) {
          navigate('/home');
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
    return selectedManifest.platform ? selectedManifest.platform : '--/--';
  };

  const handleTabChange = (event, newValue) => {
    if (newValue) setSelectedTab(newValue);
  };

  const handleOSArchChange = (e) => {
    const { value } = e.target;
    setSelectedManifest(value);
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'DependsOn':
        return <DependsOn name={imageDetailData.name} digest={selectedManifest.digest} />;
      case 'IsDependentOn':
        return <IsDependentOn name={imageDetailData.name} digest={selectedManifest.digest} />;
      case 'Vulnerabilities':
        return (
          <VulnerabilitiesDetails
            name={reponame}
            tag={tag}
            digest={selectedManifest?.digest}
            platform={selectedManifest.platform}
          />
        );
      case 'ReferredBy':
        return <ReferredBy referrers={imageDetailData.referrers} />;
      default:
        return <HistoryLayers name={imageDetailData.name} history={selectedManifest.history} />;
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Grid container className={classes.pageWrapper}>
          <Grid item xs={12} md={12}>
            <Card className={classes.cardRoot}>
              <CardContent className={classes.cardContent}>
                <Grid container>
                  <Grid item xs={12} md={9} className={classes.header}>
                    <Stack
                      alignItems="center"
                      sx={{ width: { xs: '100%', md: 'auto' }, marginBottom: '1rem' }}
                      direction={{ xs: 'column', md: 'row' }}
                      spacing={1}
                    >
                      <Stack alignItems="center" sx={{ width: { xs: '100%', md: 'auto' } }} direction="row" spacing={1}>
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
                          <span className="hide-on-mobile">{reponame}</span>:{tag}
                        </Typography>
                      </Stack>

                      <Stack alignItems="center" sx={{ width: { xs: '100%', md: 'auto' } }} direction="row" spacing={1}>
                        <VulnerabilityIconCheck
                          vulnerabilitySeverity={imageDetailData.vulnerabiltySeverity}
                          count={imageDetailData.vulnerabilityCount}
                        />
                        <SignatureIconCheck
                          isSigned={imageDetailData.isSigned}
                          signatureInfo={imageDetailData.signatureInfo}
                        />
                      </Stack>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing="1rem">
                      <FormControl sx={{ m: '1', minWidth: '4.6875rem' }} className={classes.sortForm} size="small">
                        <InputLabel>OS/Arch</InputLabel>
                        {!isEmpty(selectedManifest) && (
                          <Select
                            label="OS/Arch"
                            value={selectedManifest}
                            onChange={handleOSArchChange}
                            MenuProps={{ disableScrollLock: true }}
                          >
                            {imageDetailData.manifests.map((el) => (
                              <MenuItem key={el.digest} value={el}>
                                {`${el.platform?.Os}/${el.platform?.Arch}`}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      </FormControl>
                      <Typography gutterBottom className={classes.digest}>
                        Digest: {selectedManifest?.digest}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={12} className={classes.tabsContainer}>
            <ToggleButtonGroup
              color="primary"
              classes={{
                root: classes.tabs,
                grouped: classes.tabsButtons
              }}
              value={selectedTab}
              exclusive
              onChange={handleTabChange}
              aria-label="Tabs"
              disabled={isLoading}
            >
              <ToggleButton value="Layers" role="tab">
                Layers
              </ToggleButton>
              <ToggleButton value="DependsOn" role="tab" data-testid="dependencies-tab">
                Uses
              </ToggleButton>
              <ToggleButton value="IsDependentOn" role="tab">
                Used by
              </ToggleButton>
              <ToggleButton value="Vulnerabilities" role="tab">
                Vulnerabilities
              </ToggleButton>
              <ToggleButton value="ReferredBy" role="tab">
                Referred by
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card className={classes.cardRoot}>
              <CardContent className={classes.tabCardContent}>{renderTabContent()}</CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} className={classes.metadata}>
            <TagDetailsMetadata
              platform={getPlatform()}
              size={selectedManifest?.size}
              lastUpdated={selectedManifest?.lastUpdated}
              license={imageDetailData?.license}
              imageName={imageDetailData?.name}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default TagDetails;
