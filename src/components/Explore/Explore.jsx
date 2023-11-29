// react global
import React, { useEffect, useMemo, useRef, useState } from 'react';

// components
import RepoCard from '../Shared/RepoCard.jsx';
import Loading from '../Shared/Loading';
import Typography from '@mui/material/Typography';
import Sticky from 'react-sticky-el';
import Alert from '@mui/material/Alert';
import { Container, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Button } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

// utility
import { api, endpoints } from '../../api';
import { host } from '../../host';
import { mapToRepo } from 'utilities/objectModels.js';
import { useSearchParams } from 'react-router-dom';
import FilterCard from '../Shared/FilterCard.jsx';
import { isEmpty, isNil } from 'lodash';
import filterConstants from 'utilities/filterConstants.js';
import { sortByCriteria } from 'utilities/sortCriteria.js';
import { EXPLORE_PAGE_SIZE } from 'utilities/paginationConstants.js';
import FilterDialog from './FilterDialog.jsx';

const useStyles = makeStyles((theme) => ({
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
  resultsRow: {
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  results: {
    marginLeft: '1rem',
    color: theme.palette.secondary.dark
  },
  sortForm: {
    backgroundColor: '#ffffff',
    borderColor: '#E0E0E0',
    borderRadius: '0.375em',
    width: '23%',
    textAlign: 'left'
  },
  filterButton: {
    borderRadius: '0.4rem',
    marginBottom: '1rem',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  filterCardsContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  }
}));

function Explore({ searchInputValue }) {
  const [isLoading, setIsLoading] = useState(true);
  const [exploreData, setExploreData] = useState([]);
  const [sortFilter, setSortFilter] = useState(sortByCriteria.relevance.value);
  const [queryParams] = useSearchParams();
  const search = queryParams.get('search');
  // filtercard filters
  const [imageFilters, setImageFilters] = useState({});
  const [osFilters, setOSFilters] = useState([]);
  const [archFilters, setArchFilters] = useState([]);
  // pagination props
  const [pageNumber, setPageNumber] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isEndOfList, setIsEndOfList] = useState(false);
  const listBottom = useRef(null);
  const abortController = useMemo(() => new AbortController(), []);
  const classes = useStyles();

  // Filterdialog props
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const buildFilterQuery = () => {
    let filter = {};
    filter = !isEmpty(osFilters) ? { ...filter, Os: osFilters } : filter;
    filter = !isEmpty(archFilters) ? { ...filter, Arch: archFilters } : filter;
    if (!isEmpty(Object.keys(imageFilters))) {
      filter = { ...filter, ...imageFilters };
    }
    return filter;
  };

  const deconstructFilterQuery = () => {
    const preselectedFilter = queryParams.get('filter');
    if (!isEmpty(preselectedFilter)) {
      if (filterConstants.osFilters.map((f) => f.value).includes(preselectedFilter)) {
        setOSFilters([...osFilters, preselectedFilter]);
      } else if (filterConstants.archFilters.map((f) => f.value).includes(preselectedFilter)) {
        setArchFilters([...archFilters, preselectedFilter]);
      } else if (filterConstants.imageFilters.map((f) => f.value).includes(preselectedFilter)) {
        setImageFilters({ ...imageFilters, [preselectedFilter]: true });
      }
      queryParams.delete('filter');
    }
    const preselectedSortOrder = queryParams.get('sortby');
    if (!isEmpty(preselectedSortOrder)) {
      const sortFilterValue = Object.values(sortByCriteria).find((sbc) => sbc.value === preselectedSortOrder);
      if (sortFilterValue) {
        setSortFilter(sortFilterValue.value);
      }
      queryParams.delete('sortby');
    }
  };

  const getPaginatedResults = () => {
    setIsLoading(true);
    api
      .get(
        `${host()}${endpoints.globalSearch({
          searchQuery: !isNil(searchInputValue) ? searchInputValue : search,
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
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
        setIsEndOfList(true);
      });
  };

  const resetPagination = async () => {
    setIsEndOfList(false);
    setExploreData([]);
    if (pageNumber !== 1) {
      setPageNumber(1);
    } else {
      getPaginatedResults();
    }
  };

  // if filters changed, reset pagination and restart lookup
  useEffect(() => {
    if (isLoading) return;
    resetPagination();
  }, [search, imageFilters, osFilters, archFilters, sortFilter]);

  // on component mount or when query params change, check query params for filters
  useEffect(() => {
    if (isLoading) return;
    deconstructFilterQuery();
  }, [queryParams, isLoading]);

  useEffect(() => {
    getPaginatedResults();
    return () => {
      abortController.abort();
    };
  }, [pageNumber]);

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

  const handleSortChange = (event) => {
    setSortFilter(event.target.value);
  };

  const handleFilterDialogOpen = () => {
    setFilterDialogOpen(true);
  };

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
            stars={item.stars}
            isSigned={item.isSigned}
            signatureInfo={item.signatureInfo}
            isBookmarked={item.isBookmarked}
            isStarred={item.isStarred}
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
          wrapperLoading={isLoading}
        />
        <FilterCard
          title="Architectures"
          filters={filterConstants.archFilters}
          filterValue={archFilters}
          updateFilters={setArchFilters}
          wrapperLoading={isLoading}
        />
        <FilterCard
          title="Additional filters"
          filters={filterConstants.imageFilters}
          filterValue={imageFilters}
          updateFilters={setImageFilters}
          wrapperLoading={isLoading}
        />
      </Stack>
    );
  };

  const renderListBottom = () => {
    if (isLoading) {
      return filterDialogOpen ? <div /> : <Loading />;
    }
    if (!isLoading && !isEndOfList) {
      return <div ref={listBottom} />;
    }
    return;
  };

  return (
    <Container maxWidth="lg">
      <Grid container className={classes.gridWrapper}>
        <Grid container item xs={12}>
          <Grid item xs={3} className="hide-on-mobile"></Grid>
          <Grid item xs={12} md={9}>
            <Stack direction="row" className={classes.resultsRow}>
              <Typography variant="body2" className={`${classes.results} hide-on-mobile`}>
                Showing {exploreData?.length} results out of {totalItems}
              </Typography>
              {!isLoading && (
                <Button variant="contained" onClick={handleFilterDialogOpen} className={`${classes.filterButton}`}>
                  Filter results
                </Button>
              )}
              <FormControl
                sx={{ minWidth: '4.6875rem' }}
                disabled={isLoading}
                className={`${classes.sortForm} hide-on-mobile`}
                size="small"
              >
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
          <Grid item xs={3} md={3} className={classes.filterCardsContainer}>
            <Sticky>{renderFilterCards()}</Sticky>
          </Grid>
          <Grid item xs={12} md={9}>
            {!(exploreData && exploreData.length) && !isLoading ? (
              <Grid container className={classes.nodataWrapper}>
                <div style={{ marginTop: 20 }}>
                  <Alert style={{ marginTop: 10 }} variant="outlined" severity="warning">
                    Looks like we don&apos;t have anything matching that search. Try searching something else.
                  </Alert>
                </div>
              </Grid>
            ) : (
              <Stack direction="column">
                {renderRepoCards()}
                {renderListBottom()}
              </Stack>
            )}
          </Grid>
        </Grid>
      </Grid>
      <FilterDialog
        open={filterDialogOpen}
        setOpen={setFilterDialogOpen}
        sortValue={sortFilter}
        setSortValue={setSortFilter}
        renderFilterCards={renderFilterCards}
      />
    </Container>
  );
}

export default Explore;
