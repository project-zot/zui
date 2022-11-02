// react global
import React, { useEffect, useMemo, useRef, useState } from 'react';

// components
import RepoCard from './RepoCard.jsx';
import Loading from './Loading';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { Container, FormControl, Grid, InputLabel, MenuItem, Select, Stack } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

// utility
import { api, endpoints } from '../api';
import { host } from '../host';
import { mapToRepo } from 'utilities/objectModels.js';
import { useSearchParams } from 'react-router-dom';
import FilterCard from './FilterCard.jsx';
import { isEmpty } from 'lodash';
import filterConstants from 'utilities/filterConstants.js';
import { sortByCriteria } from 'utilities/sortCriteria.js';
import { EXPLORE_PAGE_SIZE } from 'utilities/paginationConstants.js';

const useStyles = makeStyles(() => ({
  gridWrapper: {
    paddingTop: '2rem',
    paddingBottom: '2rem'
  },
  nodataWrapper: {
    backgroundColor: '#fff',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center'
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
  results: {
    marginLeft: '1rem'
  },
  sortForm: {
    backgroundColor: '#ffffff',
    borderColor: '#E0E0E0',
    borderRadius: '0.375em',
    width: '25%',
    textAlign: 'left'
  }
}));

function Explore() {
  const [isLoading, setIsLoading] = useState(true);
  const [exploreData, setExploreData] = useState([]);
  const [sortFilter, setSortFilter] = useState(sortByCriteria.relevance.value);
  const [queryParams] = useSearchParams();
  const search = queryParams.get('search');
  // filtercard filters
  const [imageFilters, setImageFilters] = useState(false);
  const [osFilters, setOSFilters] = useState([]);
  const [archFilters, setArchFilters] = useState([]);
  // pagination props
  const [pageNumber, setPageNumber] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isEndOfList, setIsEndOfList] = useState(false);
  const listBottom = useRef(null);
  const abortController = useMemo(() => new AbortController(), []);
  const classes = useStyles();

  const buildFilterQuery = () => {
    let filter = {};
    // workaround until backend bugfix
    filter = !isEmpty(osFilters) ? { ...filter, Os: osFilters } : filter;
    filter = !isEmpty(archFilters) ? { ...filter, Arch: archFilters } : filter;
    if (imageFilters) {
      filter = { ...filter, HasToBeSigned: imageFilters };
    }
    return filter;
  };

  const getPaginatedResults = () => {
    setIsLoading(true);
    api
      .get(
        `${host()}${endpoints.globalSearch({
          searchQuery: search,
          pageNumber,
          pageSize: EXPLORE_PAGE_SIZE,
          sortBy: sortFilter,
          filter: buildFilterQuery()
        })}`,
        abortController.signal
      )
      .then((response) => {
        if (response.data && response.data.data) {
          let repoList = response.data.data.GlobalSearch.Repos;
          let repoData = repoList.map((responseRepo) => {
            return mapToRepo(responseRepo);
          });
          setTotalItems(response.data.data.GlobalSearch.Page?.TotalCount);
          setIsEndOfList(response.data.data.GlobalSearch.Page?.ItemCount < EXPLORE_PAGE_SIZE);
          setExploreData((previousState) => [...previousState, ...repoData]);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
        setIsEndOfList(true);
      });
  };

  useEffect(() => {
    if (isLoading) return;
    getPaginatedResults();
    return () => {
      abortController.abort();
    };
  }, [pageNumber]);

  const resetPagination = () => {
    if (pageNumber === 1) {
      getPaginatedResults();
    } else {
      setPageNumber(1);
    }
    setIsEndOfList(false);
    setExploreData([]);
  };

  // if filters changed, reset pagination and restart lookup
  useEffect(() => {
    resetPagination();
  }, [search, queryParams, imageFilters, osFilters, archFilters, sortFilter]);

  const handleSortChange = (event) => {
    setSortFilter(event.target.value);
  };

  // setup intersection obeserver for infinite scroll
  useEffect(() => {
    if (isLoading || isEndOfList) return;
    const handleIntersection = (entries) => {
      if (isLoading || isEndOfList) return;
      const [target] = entries;
      if (target?.isIntersecting) {
        setPageNumber((pageNumber) => pageNumber + 1);
      }
    };
    const intersectionObserver = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0
    });

    if (listBottom.current) {
      intersectionObserver.observe(listBottom.current);
    }

    return () => {
      intersectionObserver.disconnect();
    };
  }, [isLoading, isEndOfList]);

  const renderRepoCards = () => {
    return (
      exploreData &&
      exploreData.map((item, index) => {
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

  const renderFilterCards = () => {
    return (
      <Stack spacing={2}>
        <FilterCard
          title="Operating system"
          filters={filterConstants.osFilters}
          filterValue={osFilters}
          updateFilters={setOSFilters}
        />
        <FilterCard
          title="Architectures"
          filters={filterConstants.archFilters}
          filterValue={archFilters}
          updateFilters={setArchFilters}
        />
        <FilterCard
          title="Additional filters"
          filters={filterConstants.imageFilters}
          filterValue={imageFilters}
          updateFilters={setImageFilters}
        />
      </Stack>
    );
  };

  const renderListBottom = () => {
    if (isLoading) {
      return <Loading />;
    }
    if (!isLoading && !isEndOfList) {
      return <div ref={listBottom} />;
    }
    return '';
  };

  return (
    <Container maxWidth="lg">
      <Grid container className={classes.gridWrapper}>
        <Grid container item xs={12}>
          <Grid item xs={3}></Grid>
          <Grid item xs={9}>
            <Stack direction="row" className={classes.resultsRow}>
              <Typography variant="body2" className={classes.results}>
                Showing {exploreData?.length} results out of {totalItems}
              </Typography>
              <FormControl sx={{ m: '1', minWidth: '4.6875rem' }} className={classes.sortForm} size="small">
                <InputLabel>Sort</InputLabel>
                <Select
                  label="Sort"
                  value={sortFilter}
                  onChange={handleSortChange}
                  MenuProps={{ disableScrollLock: true }}
                >
                  {Object.values(sortByCriteria).map((el) => (
                    <MenuItem key={el.value} value={el.value}>
                      {el.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={5} pt={1}>
          <Grid item xs={3}>
            {renderFilterCards()}
          </Grid>
          <Grid item xs={9}>
            {!(exploreData && exploreData.length) && !isLoading ? (
              <Grid container className={classes.nodataWrapper}>
                <div style={{ marginTop: 20 }}>
                  <Alert style={{ marginTop: 10, width: '100%' }} variant="outlined" severity="warning">
                    Looks like we don&apos;t have anything matching that search. Try searching something else.
                  </Alert>
                </div>
              </Grid>
            ) : (
              <Stack direction="column" spacing={2}>
                {renderRepoCards()}
                {renderListBottom()}
              </Stack>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Explore;
