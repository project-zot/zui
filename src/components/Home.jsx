import { Grid, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { api, endpoints } from 'api';
import { host } from '../host';
import React, { useEffect, useMemo, useState } from 'react';
import PreviewCard from './PreviewCard';
import RepoCard from './RepoCard';
import { mapToRepo } from 'utilities/objectModels';
import Loading from './Loading';

const useStyles = makeStyles(() => ({
  gridWrapper: {
    marginTop: 10,
    marginBottom: '5rem'
  },
  nodataWrapper: {
    backgroundColor: '#fff',
    height: '100vh'
  },
  exploreText: {
    color: '#C0C0C0',
    display: 'flex',
    alignItems: 'left'
  },
  resultsRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#00000099'
  },
  title: {
    fontWeight: '700',
    color: '#0F2139',
    width: '100%',
    display: 'inline',
    fontSize: '2.5rem',
    textAlign: 'center',
    letterSpacing: '-0.02rem'
  },
  titleRed: {
    fontWeight: '700',
    color: '#D83C0E',
    width: '100%',
    display: 'inline',
    fontSize: '2.5rem',
    textAlign: 'center',
    letterSpacing: '-0.02rem'
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#000000DE',
    width: '100%'
  },
  subtitle: {
    color: '#00000099',
    fontWeight: 400,
    fontSize: '1rem',
    textAlign: 'center',
    lineHeight: '150%',
    letterSpacing: '0.009375rem',
    width: '65%'
  }
}));

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [homeData, setHomeData] = useState([]);
  const abortController = useMemo(() => new AbortController(), []);
  const classes = useStyles();

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    api
      .get(`${host()}${endpoints.repoList()}`, abortController.signal)
      .then((response) => {
        if (response.data && response.data.data) {
          let repoList = response.data.data.RepoListWithNewestImage;
          let repoData = repoList.map((responseRepo) => {
            return mapToRepo(responseRepo);
          });
          setHomeData(repoData);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        console.error(e);
      });
    return () => {
      abortController.abort();
    };
  }, []);

  const renderPreviewCards = () => {
    return (
      homeData &&
      homeData.slice(0, 4).map((item, index) => {
        return (
          <Grid item xs={3} key={index}>
            <PreviewCard name={item.name} lastUpdated={item.lastUpdated} isSigned={item.isSigned} />
          </Grid>
        );
      })
    );
  };

  // const renderBookmarks = () => {
  //   return (
  //     homeData &&
  //     homeData.slice(0, 2).map((item, index) => {
  //       return (
  //         <RepoCard
  //           name={item.name}
  //           version={item.latestVersion}
  //           description={item.description}
  //           tags={item.tags}
  //           vendor={item.vendor}
  //           platforms={item.platforms}
  //           size={item.size}
  //           licenses={item.licenses}
  //           key={index}
  //           data={item}
  //           lastUpdated={item.lastUpdated}
  //         />
  //       );
  //     })
  //   );
  // };

  const renderRecentlyUpdated = () => {
    return (
      homeData &&
      homeData.slice(0, 2).map((item, index) => {
        return (
          <RepoCard
            name={item.name}
            version={item.latestVersion}
            description={item.description}
            downloads={item.downloads}
            isSigned={item.isSigned}
            vendor={item.vendor}
            platforms={item.platforms}
            key={index}
            lastUpdated={item.lastUpdated}
          />
        );
      })
    );
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Stack spacing={4} alignItems="center" className={classes.gridWrapper}>
          <Grid container item xs={12} sx={{ mt: 2, mb: 1 }} justifyContent="center">
            <Stack sx={{ display: 'inline' }} direction="row" justifyContent="center" spacing={1}>
              <Typography variant="h3" className={classes.title}>
                Most popular
              </Typography>
              <Typography variant="h3" className={classes.titleRed}>
                images
              </Typography>
            </Stack>
          </Grid>
          <Grid container spacing={1}>
            {renderPreviewCards()}
          </Grid>{' '}
          <Grid></Grid>
          {/* <Typography variant="h4" align="left" className={classes.sectionTitle}>
        Bookmarks
      </Typography>
      {renderBookmarks()} */}
          <Stack></Stack>
          <Typography variant="h4" align="left" className={classes.sectionTitle}>
            Recently updated repositories
          </Typography>
          {renderRecentlyUpdated()}
        </Stack>
      )}
    </>
  );
}

export default Home;
