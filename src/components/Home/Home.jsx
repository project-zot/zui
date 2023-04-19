import { Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { api, endpoints } from 'api';
import { host } from '../../host';
import React, { useEffect, useMemo, useState } from 'react';
import RepoCard from '../Shared/RepoCard';
import { mapToRepo } from 'utilities/objectModels';
import Loading from '../Shared/Loading';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { sortByCriteria } from 'utilities/sortCriteria';
import { HOME_POPULAR_PAGE_SIZE, HOME_RECENT_PAGE_SIZE } from 'utilities/paginationConstants';

const useStyles = makeStyles((theme) => ({
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
  sectionHeaderContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'column',
    width: '100%',
    paddingTop: '1rem',
    marginBottom: '1rem',
    [theme.breakpoints.up('md')]: {
      alignItems: 'flex-end',
      flexDirection: 'row'
    }
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#0F2139',
    width: '100%',
    fontSize: '2rem',
    textAlign: 'center',
    lineHeight: '2.375rem',
    letterSpacing: '-0.01rem',
    marginLeft: '0.5rem'
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
    color: '#52637A',
    fontWeight: '600',
    fontSize: '1rem',
    lineHeight: '1.5rem',
    cursor: 'pointer',
    marginRight: '0.5rem'
  }
}));

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [popularData, setPopularData] = useState([]);
  const [recentData, setRecentData] = useState([]);
  const navigate = useNavigate();
  const abortController = useMemo(() => new AbortController(), []);
  const classes = useStyles();

  const getPopularData = () => {
    setIsLoading(true);
    api
      .get(
        `${host()}${endpoints.globalSearch({
          searchQuery: '',
          pageNumber: 1,
          pageSize: HOME_POPULAR_PAGE_SIZE,
          sortBy: sortByCriteria.downloads?.value
        })}`,
        abortController.signal
      )
      .then((response) => {
        if (response.data && response.data.data) {
          let repoList = response.data.data.GlobalSearch.Repos;
          let repoData = repoList.map((responseRepo) => {
            return mapToRepo(responseRepo);
          });
          setPopularData(repoData);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getRecentData = () => {
    setIsLoading(true);
    api
      .get(
        `${host()}${endpoints.globalSearch({
          searchQuery: '',
          pageNumber: 1,
          pageSize: HOME_RECENT_PAGE_SIZE,
          sortBy: sortByCriteria.updateTime?.value
        })}`,
        abortController.signal
      )
      .then((response) => {
        if (response.data && response.data.data) {
          let repoList = response.data.data.GlobalSearch.Repos;
          let repoData = repoList.map((responseRepo) => {
            return mapToRepo(responseRepo);
          });
          setRecentData(repoData);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getPopularData();
    getRecentData();
    return () => {
      abortController.abort();
    };
  }, []);

  const handleClickViewAll = (target) => {
    navigate({ pathname: `/explore`, search: createSearchParams({ sortby: target }).toString() });
  };

  const renderMostPopular = () => {
    return (
      popularData &&
      popularData.map((item, index) => {
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
      recentData &&
      recentData.map((item, index) => {
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
        <Stack alignItems="center" className={classes.gridWrapper}>
          <Stack className={classes.sectionHeaderContainer} sx={{ paddingTop: '3rem' }}>
            <div>
              <Typography variant="h4" align="left" className={classes.sectionTitle}>
                Most popular images
              </Typography>
            </div>
            <div onClick={() => handleClickViewAll(sortByCriteria.downloads.value)}>
              <Typography variant="body2" className={classes.viewAll}>
                View all
              </Typography>
            </div>
          </Stack>
          {renderMostPopular()}
          {/* currently most popular will be by downloads until stars are implemented */}
          <Stack className={classes.sectionHeaderContainer}>
            <div>
              <Typography variant="h4" align="left" className={classes.sectionTitle}>
                Recently updated images
              </Typography>
            </div>
            <div>
              <Typography
                variant="body2"
                className={classes.viewAll}
                onClick={() => handleClickViewAll(sortByCriteria.updateTime.value)}
              >
                View all
              </Typography>
            </div>
          </Stack>
          {renderRecentlyUpdated()}
        </Stack>
      )}
    </>
  );
}

export default Home;
