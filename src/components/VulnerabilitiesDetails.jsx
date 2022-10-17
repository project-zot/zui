import React, { useEffect, useMemo, useState } from 'react';

// utility
import { api, endpoints } from '../api';

// components
import Collapse from '@mui/material/Collapse';
import { Box, Card, CardContent, Divider, Chip, Stack, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { host } from '../host';
import PestControlOutlinedIcon from '@mui/icons-material/PestControlOutlined';
import PestControlIcon from '@mui/icons-material/PestControl';
import { isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';

const useStyles = makeStyles(() => ({
  card: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    background: '#FFFFFF',
    boxShadow: '0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)',
    borderRadius: '1.875rem',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%',
    marginTop: '2rem',
    marginBottom: '2rem'
  },
  content: {
    textAlign: 'left',
    color: '#606060',
    padding: '2% 3% 2% 3%',
    width: '100%'
  },
  title: {
    color: '#828282',
    fontSize: '1rem',
    paddingRight: '0.5rem',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem'
  },
  values: {
    color: '#000000',
    fontSize: '1rem',
    fontWeight: '600',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem',
    textOverflow: 'ellipsis'
  },
  link: {
    color: '#52637A',
    fontSize: '1rem',
    letterSpacing: '0.009375rem',
    paddingRight: '1rem',
    textDecorationLine: 'underline'
  },
  monitor: {
    width: '27.25rem',
    height: '24.625rem',
    paddingTop: '2rem'
  },
  none: {
    color: '#52637A',
    fontSize: '1.4rem',
    fontWeight: '600'
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dropdownText: {
    color: '#1479FF',
    paddingTop: '1rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center'
  }
}));

const vulnerabilityCheck = (status) => {
  const noneVulnerability = (
    <Chip
      label="None"
      sx={{ backgroundColor: '#E8F5E9', color: '#388E3C', fontSize: '0.8125rem' }}
      variant="filled"
      onDelete={() => {
        return;
      }}
      deleteIcon={<PestControlOutlinedIcon sx={{ color: '#388E3C!important' }} />}
    />
  );
  const unknownVulnerability = (
    <Chip
      label="Unknown"
      sx={{ backgroundColor: '#ECEFF1', color: '#52637A', fontSize: '0.8125rem' }}
      variant="filled"
      onDelete={() => {
        return;
      }}
      deleteIcon={<PestControlOutlinedIcon sx={{ color: '#52637A!important' }} />}
    />
  );
  const lowVulnerability = (
    <Chip
      label="Low"
      sx={{ backgroundColor: '#FFF3E0', color: '#FB8C00', fontSize: '0.8125rem' }}
      variant="filled"
      onDelete={() => {
        return;
      }}
      deleteIcon={<PestControlOutlinedIcon sx={{ color: '#FB8C00!important' }} />}
    />
  );
  const mediumVulnerability = (
    <Chip
      label="Medium"
      sx={{ backgroundColor: '#FFF3E0', color: '#FB8C00', fontSize: '0.8125rem' }}
      variant="filled"
      onDelete={() => {
        return;
      }}
      deleteIcon={<PestControlIcon sx={{ color: '#FB8C00!important' }} />}
    />
  );
  const highVulnerability = (
    <Chip
      label="High"
      sx={{ backgroundColor: '#FEEBEE', color: '#E53935', fontSize: '0.8125rem' }}
      variant="filled"
      onDelete={() => {
        return;
      }}
      deleteIcon={<PestControlOutlinedIcon sx={{ color: '#E53935!important' }} />}
    />
  );
  const criticalVulnerability = (
    <Chip
      label="Critical"
      sx={{ backgroundColor: '#FEEBEE', color: '#E53935', fontSize: '0.8125rem' }}
      variant="filled"
      onDelete={() => {
        return;
      }}
      deleteIcon={<PestControlIcon sx={{ color: '#E53935!important' }} />}
    />
  );

  let result;
  switch (status) {
    case 'NONE':
      result = noneVulnerability;
      break;
    case 'LOW':
      result = lowVulnerability;
      break;
    case 'MEDIUM':
      result = mediumVulnerability;
      break;
    case 'HIGH':
      result = highVulnerability;
      break;
    case 'CRITICAL':
      result = criticalVulnerability;
      break;
    default:
      result = unknownVulnerability;
  }

  return result;
};

function VulnerabilitiyCard(props) {
  const classes = useStyles();
  const { cve, name } = props;
  const [openDesc, setOpenDesc] = useState(false);
  const [openFixed, setOpenFixed] = useState(false);
  const [loadingFixed, setLoadingFixed] = useState(true);
  const [fixedInfo, setFixedInfo] = useState([]);

  useEffect(() => {
    if (!openFixed || !isEmpty(fixedInfo)) {
      return;
    }
    setLoadingFixed(true);
    api
      .get(`${host()}${endpoints.imageListWithCVEFixed(cve.Id, name)}`)
      .then((response) => {
        if (response.data && response.data.data) {
          const fixedTagsList = response.data.data.ImageListWithCVEFixed?.map((e) => e.Tag);
          setFixedInfo(fixedTagsList);
        }
        setLoadingFixed(false);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [openFixed]);

  const renderFixedVer = () => {
    if (!isEmpty(fixedInfo)) {
      return fixedInfo.map((tag, index) => {
        return (
          <Link key={index} to={`/image/${encodeURIComponent(name)}/tag/${tag}`} className={classes.link}>
            {tag}
          </Link>
        );
      });
    } else {
      return 'Not fixed';
    }
  };

  return (
    <Card className={classes.card} raised>
      <CardContent className={classes.content}>
        <Stack sx={{ flexDirection: 'row' }}>
          <Typography variant="body1" align="left" className={classes.values}>
            {' '}
            {cve.Id}
          </Typography>
        </Stack>
        {vulnerabilityCheck(cve.Severity)}
        <Stack sx={{ flexDirection: 'row' }}>
          <Typography variant="body1" align="left" className={classes.values}>
            {' '}
            {cve.Title}
          </Typography>
        </Stack>
        <Stack className={classes.dropdown} onClick={() => setOpenFixed(!openFixed)}>
          {!openFixed ? (
            <KeyboardArrowRight className={classes.dropdownText} />
          ) : (
            <KeyboardArrowDown className={classes.dropdownText} />
          )}
          <Typography className={classes.dropdownText}>Fixed in</Typography>
        </Stack>
        <Collapse in={openFixed} timeout="auto" unmountOnExit>
          <Box>
            <Typography variant="body2" align="left" sx={{ color: '#0F2139', fontSize: '1rem', width: '100%' }}>
              {' '}
              {loadingFixed ? 'Loading...' : renderFixedVer()}{' '}
            </Typography>
          </Box>
        </Collapse>
        <Stack className={classes.dropdown} onClick={() => setOpenDesc(!openDesc)}>
          {!openDesc ? (
            <KeyboardArrowRight className={classes.dropdownText} />
          ) : (
            <KeyboardArrowDown className={classes.dropdownText} />
          )}
          <Typography className={classes.dropdownText}>Description</Typography>
        </Stack>
        <Collapse in={openDesc} timeout="auto" unmountOnExit>
          <Box>
            <Typography variant="body2" align="left" sx={{ color: '#0F2139', fontSize: '1rem' }}>
              {' '}
              {cve.Description}{' '}
            </Typography>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}

function VulnerabilitiesDetails(props) {
  const classes = useStyles();
  const [cveData, setCveData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const abortController = useMemo(() => new AbortController(), []);
  const { name, tag } = props;

  useEffect(() => {
    setIsLoading(true);
    api
      .get(`${host()}${endpoints.vulnerabilitiesForRepo(`${name}:${tag}`)}`, abortController.signal)
      .then((response) => {
        if (response.data && response.data.data) {
          let cveInfo = response.data.data.CVEListForImage;
          let cveListData = {
            cveList: cveInfo?.CVEList
          };
          setCveData(cveListData);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        console.error(e);
        setCveData({});
      });
    return () => {
      abortController.abort();
    };
  }, []);

  const renderCVEs = (cves) => {
    if (cves?.length !== 0) {
      return (
        cves &&
        cves.map((cve, index) => {
          return <VulnerabilitiyCard key={index} cve={cve} name={name} />;
        })
      );
    } else {
      return (
        <div>
          <Typography className={classes.none}> No Vulnerabilities </Typography>{' '}
        </div>
      );
    }
  };

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
        component="div"
        align="left"
        style={{
          color: 'rgba(0, 0, 0, 0.87)',
          fontSize: '1.5rem',
          fontWeight: '600',
          paddingTop: '0.5rem'
        }}
      >
        Vulnerabilities
      </Typography>
      <Divider
        variant="fullWidth"
        sx={{
          margin: '5% 0% 5% 0%',
          background: 'rgba(0, 0, 0, 0.38)',
          height: '0.00625rem',
          width: '100%'
        }}
      />
      {isLoading ? (
        <Loading />
      ) : (
        renderCVEs(
          // @ts-ignore
          cveData?.cveList
        )
      )}
    </>
  );
}

export default VulnerabilitiesDetails;
