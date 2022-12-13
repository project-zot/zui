import { Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { api, endpoints } from 'api';
import { host } from '../host';
import React, { useEffect, useMemo, useState } from 'react';
import RepoCard from './RepoCard';
import { mapToRepo } from 'utilities/objectModels';
import Loading from './Loading';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { sortByCriteria } from 'utilities/sortCriteria';

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
  },
  viewAll: {
    color: '#00000099',
    cursor: 'pointer',
    textAlign: 'left'
  }
}));

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [homeData, setHomeData] = useState([]);
  const navigate = useNavigate();
  const abortController = useMemo(() => new AbortController(), []);
  const classes = useStyles();

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    api
      .get(`${host()}${endpoints.repoList()}`, abortController.signal)
      .then((response) => {
        if (response.data && response.data.data) {
          let repoList = response.data.data.RepoListWithNewestImage.Results;
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

  const handleClickViewAll = (target) => {
    navigate({ pathname: `/explore`, search: createSearchParams({ sortby: target }).toString() });
  };

  const renderMostPopular = () => {
    return (
      homeData &&
      homeData.slice(0, 3).map((item, index) => {
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
            vulnerabilityData={{
              vulnerabilitySeverity: item.vulnerabiltySeverity,
              count: item.vulnerabilityCount
            }}
            lastUpdated={item.lastUpdated}
            logo={item.logo}
          />
        );
      })
    );
  };

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
            vulnerabilityData={{
              vulnerabilitySeverity: item.vulnerabiltySeverity,
              count: item.vulnerabilityCount
            }}
            lastUpdated={item.lastUpdated}
            logo={item.logo}
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
          <Stack
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'flex-end' }}
            direction={{ xs: 'column', md: 'row' }}
            sx={{ width: '100%', paddingTop: '3rem' }}
          >
            <div>
              <Typography variant="h4" align="left" className={classes.sectionTitle}>
                Most popular images
              </Typography>
            </div>
            <div className={classes.viewAll} onClick={() => handleClickViewAll(sortByCriteria.downloads.value)}>
              <Typography variant="body2">View all</Typography>
            </div>
          </Stack>
          {renderMostPopular()}
          {/* currently most popular will be by downloads until stars are implemented */}
          <Stack
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'flex-end' }}
            direction={{ xs: 'column', md: 'row' }}
            sx={{ width: '100%', paddingTop: '1rem' }}
          >
            <Typography variant="h4" align="left" className={classes.sectionTitle}>
              Recently updated images
            </Typography>
            <Typography
              variant="body2"
              className={classes.viewAll}
              onClick={() => handleClickViewAll(sortByCriteria.updateTime.value)}
            >
              View all
            </Typography>
          </Stack>
          {renderRecentlyUpdated()}
        </Stack>
      )}
    </>
  );
}

export default Home;
