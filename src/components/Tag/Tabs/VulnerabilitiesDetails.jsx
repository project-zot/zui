import React, { useEffect, useMemo, useState, useRef } from 'react';

// utility
import { api, endpoints } from '../../../api';

// components
import {
  IconButton,
  Stack,
  Typography,
  InputBase,
  Menu,
  MenuItem,
  Divider,
  Snackbar,
  CircularProgress
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { host } from '../../../host';
import { debounce, isEmpty } from 'lodash';
import Loading from '../../Shared/Loading';
import { mapCVEInfo, mapAllCVEInfo } from 'utilities/objectModels';
import { EXPLORE_PAGE_SIZE } from 'utilities/paginationConstants';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';

import * as XLSX from 'xlsx';
import exportFromJSON from 'export-from-json';

import VulnerabilitiyCard from '../../Shared/VulnerabilityCard';
import VulnerabilityCountCard from '../../Shared/VulnerabilityCountCard';

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.primary.main,
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '0'
  },
  cveCountSummary: {
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
  vulnerabilities: {
    position: 'relative',
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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
  },
  export: {
    alignContent: 'right'
  },
  popper: {
    width: '100%',
    overflow: 'hidden',
    padding: '0.3rem',
    display: 'flex',
    justifyContent: 'center'
  }
}));

function VulnerabilitiesDetails(props) {
  const classes = useStyles();
  const [cveData, setCveData] = useState([]);
  const [allCveData, setAllCveData] = useState([]);
  const [cveSummary, setCVESummary] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAllCve, setIsLoadingAllCve] = useState(true);
  const abortController = useMemo(() => new AbortController(), []);
  const { name, tag, digest, platform } = props;

  // pagination props
  const [cveFilter, setCveFilter] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [isEndOfList, setIsEndOfList] = useState(false);
  const listBottom = useRef(null);

  const [anchorExport, setAnchorExport] = useState(null);
  const openExport = Boolean(anchorExport);

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
          let summary = response.data.data.CVEListForImage?.Summary;
          let cveListData = mapCVEInfo(cveInfo);
          setCveData((previousState) => (pageNumber === 1 ? cveListData : [...previousState, ...cveListData]));
          setIsEndOfList(response.data.data.CVEListForImage.Page?.ItemCount < EXPLORE_PAGE_SIZE);
          setCVESummary((previousState) => {
            if (isEmpty(summary)) {
              return previousState;
            }
            return {
              Count: summary.Count,
              UnknownCount: summary.UnknownCount,
              LowCount: summary.LowCount,
              MediumCount: summary.MediumCount,
              HighCount: summary.HighCount,
              CriticalCount: summary.CriticalCount
            };
          });
        } else if (response.data.errors) {
          setIsEndOfList(true);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
        setCveData([]);
        setCVESummary(() => {});
        setIsEndOfList(true);
      });
  };

  const getAllCVEs = () => {
    api
      .get(`${host()}${endpoints.allVulnerabilitiesForRepo(getCVERequestName())}`, abortController.signal)
      .then((response) => {
        if (response.data && response.data.data) {
          const cveInfo = response.data.data.CVEListForImage?.CVEList;
          const cveListData = mapAllCVEInfo(cveInfo);
          setAllCveData(cveListData);
        }
        setIsLoadingAllCve(false);
      })
      .catch((e) => {
        console.error(e);
        setAllCveData([]);
        setIsLoadingAllCve(false);
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

  const handleOnExportExcel = () => {
    const wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(allCveData);

    XLSX.utils.book_append_sheet(wb, ws, name + '_' + tag);

    XLSX.writeFile(wb, `${name}:${tag}-vulnerabilities.xlsx`);

    handleCloseExport();
  };

  const handleOnExportCSV = () => {
    const fileName = `${name}:${tag}-vulnerabilities`;
    const exportType = exportFromJSON.types.csv;

    exportFromJSON({ data: allCveData, fileName, exportType });

    handleCloseExport();
  };

  const handleCveFilterChange = (e) => {
    const { value } = e.target;
    setCveFilter(value);
  };

  const handleClickExport = (event) => {
    setAnchorExport(event.currentTarget);
  };

  const handleCloseExport = () => {
    setAnchorExport(null);
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

  useEffect(() => {
    if (openExport && isEmpty(allCveData)) {
      getAllCVEs();
    }
  }, [openExport]);

  const renderCVEs = () => {
    return !isEmpty(cveData) ? (
      cveData.map((cve, index) => {
        return <VulnerabilitiyCard key={index} cve={cve} name={name} platform={platform} />;
      })
    ) : (
      <div>{!isLoading && <Typography className={classes.none}> No Vulnerabilities </Typography>}</div>
    );
  };

  const renderCVESummary = () => {
    if (cveSummary === undefined) {
      return;
    }
    return !isEmpty(cveSummary) ? (
      <VulnerabilityCountCard
        total={cveSummary.Count}
        critical={cveSummary.CriticalCount}
        high={cveSummary.HighCount}
        medium={cveSummary.MediumCount}
        low={cveSummary.LowCount}
        unknown={cveSummary.UnknownCount}
      />
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
      <Stack className={classes.vulnerabilities}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4" gutterBottom component="div" align="left" className={classes.title}>
            Vulnerabilities
          </Typography>
          <IconButton disableRipple onClick={handleClickExport} className={classes.export}>
            <DownloadIcon />
          </IconButton>
          <Snackbar
            open={openExport && isLoadingAllCve}
            message="Getting your data ready for export"
            action={<CircularProgress size="2rem" sx={{ color: '#FFFFFF' }} />}
          />
          <Menu
            anchorEl={anchorExport}
            open={openExport}
            onClose={handleCloseExport}
            data-testid="export-dropdown"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            <MenuItem
              onClick={handleOnExportCSV}
              disableRipple
              disabled={isLoadingAllCve}
              className={classes.popper}
              data-testid="export-csv-menuItem"
            >
              csv
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem
              onClick={handleOnExportExcel}
              disableRipple
              disabled={isLoadingAllCve}
              className={classes.popper}
              data-testid="export-excel-menuItem"
            >
              MS Excel
            </MenuItem>
          </Menu>
        </Stack>
        {renderCVESummary()}
      </Stack>
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
