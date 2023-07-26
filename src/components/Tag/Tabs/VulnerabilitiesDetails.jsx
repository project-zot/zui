import React, { useEffect, useMemo, useState, useRef } from 'react';

// utility
import { api, endpoints } from '../../../api';

// components
import { Stack, Typography, InputBase } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { host } from '../../../host';
import { debounce, isEmpty } from 'lodash';
import Loading from '../../Shared/Loading';
import { mapCVEInfo } from 'utilities/objectModels';
import { EXPLORE_PAGE_SIZE } from 'utilities/paginationConstants';
import SearchIcon from '@mui/icons-material/Search';

import VulnerabilitiyCard from '../../Shared/VulnerabilityCard';

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.primary.main,
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '0'
  },
  cveId: {
    color: theme.palette.primary.main,
    fontSize: '1rem',
    fontWeight: 400,
    textDecoration: 'underline'
  },
  cveSummary: {
    color: theme.palette.secondary.dark,
    fontSize: '0.75rem',
    fontWeight: '600',
    textOverflow: 'ellipsis',
    marginTop: '0.5rem'
  },
  none: {
    color: '#52637A',
    fontSize: '1.4rem',
    fontWeight: '600'
  },
  search: {
    position: 'relative',
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: 'none',
    border: '0.063rem solid #E7E7E7',
    borderRadius: '0.625rem'
  },
  searchIcon: {
    color: '#52637A',
    paddingRight: '3%'
  },
  searchInputBase: {
    width: '90%',
    paddingLeft: '1.5rem',
    height: 40,
    color: 'rgba(0, 0, 0, 0.6)'
  },
  input: {
    color: '#464141',
    '&::placeholder': {
      opacity: '1'
    }
  }
}));

function VulnerabilitiesDetails(props) {
  const classes = useStyles();
  const [cveData, setCveData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const abortController = useMemo(() => new AbortController(), []);
  const { name, tag, digest, platform } = props;

  // pagination props
  const [cveFilter, setCveFilter] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [isEndOfList, setIsEndOfList] = useState(false);
  const listBottom = useRef(null);

  const getCVERequestName = () => {
    return digest !== '' ? `${name}@${digest}` : `${name}:${tag}`;
  };

  const getPaginatedCVEs = () => {
    api
      .get(
        `${host()}${endpoints.vulnerabilitiesForRepo(
          getCVERequestName(),
          { pageNumber, pageSize: EXPLORE_PAGE_SIZE },
          cveFilter
        )}`,
        abortController.signal
      )
      .then((response) => {
        if (response.data && response.data.data) {
          let cveInfo = response.data.data.CVEListForImage?.CVEList;
          let cveListData = mapCVEInfo(cveInfo);
          setCveData((previousState) => (pageNumber === 1 ? cveListData : [...previousState, ...cveListData]));
          setIsEndOfList(response.data.data.CVEListForImage.Page?.ItemCount < EXPLORE_PAGE_SIZE);
        } else if (response.data.errors) {
          setIsEndOfList(true);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
        setCveData([]);
        setIsEndOfList(true);
      });
  };

  const resetPagination = () => {
    setIsLoading(true);
    setIsEndOfList(false);
    if (pageNumber !== 1) {
      setPageNumber(1);
    } else {
      getPaginatedCVEs();
    }
  };

  const handleCveFilterChange = (e) => {
    const { value } = e.target;
    setCveFilter(value);
  };

  const debouncedChangeHandler = useMemo(() => debounce(handleCveFilterChange, 300));

  useEffect(() => {
    getPaginatedCVEs();
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

  useEffect(() => {
    if (isLoading) return;
    resetPagination();
  }, [cveFilter]);

  useEffect(() => {
    return () => {
      abortController.abort();
      debouncedChangeHandler.cancel();
    };
  }, []);

  const renderCVEs = () => {
    return !isEmpty(cveData) ? (
      cveData.map((cve, index) => {
        return <VulnerabilitiyCard key={index} cve={cve} name={name} platform={platform} />;
      })
    ) : (
      <div>{!isLoading && <Typography className={classes.none}> No Vulnerabilities </Typography>}</div>
    );
  };

  const renderListBottom = () => {
    if (isLoading) {
      return <Loading />;
    }
    if (!isLoading && !isEndOfList) {
      return <div ref={listBottom} />;
    }
    return;
  };

  return (
    <Stack direction="column" spacing="1rem" data-testid="vulnerability-container">
      <Typography variant="h4" gutterBottom component="div" align="left" className={classes.title}>
        Vulnerabilities
      </Typography>
      <Stack className={classes.search}>
        <InputBase
          placeholder={'Search'}
          classes={{ root: classes.searchInputBase, input: classes.input }}
          onChange={debouncedChangeHandler}
        />
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
      </Stack>
      {renderCVEs()}
      {renderListBottom()}
    </Stack>
  );
}

export default VulnerabilitiesDetails;
