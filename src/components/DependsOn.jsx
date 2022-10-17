import React, { useEffect, useState, useMemo } from 'react';

// utility
import { api, endpoints } from '../api';

// components
import { Divider, Typography, Stack } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { host } from '../host';
import Loading from './Loading';
import RepoCard from './RepoCard';

const useStyles = makeStyles(() => ({
  card: {
    background: '#FFFFFF',
    boxShadow: '0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)',
    borderRadius: '1.875rem',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%',
    marginTop: '2rem',
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
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
    paddingTop: '0.5rem'
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
  }
}));

function DependsOn(props) {
  const [images, setImages] = useState([]);
  const { name } = props;
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const abortController = useMemo(() => new AbortController(), []);

  useEffect(() => {
    setIsLoading(true);
    api
      .get(`${host()}${endpoints.dependsOnForImage(name)}`, abortController.signal)
      .then((response) => {
        if (response.data && response.data.data) {
          let images = response.data.data.BaseImageList;
          setImages(images);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
      });
    return () => {
      abortController.abort();
    };
  }, []);

  const renderDependencies = () => {
    return images?.length ? (
      images.map((dependence, index) => {
        return (
          <RepoCard
            name={dependence.RepoName}
            version={dependence.Tag}
            description={dependence.Description}
            vendor={dependence.Vendor}
            downloads={dependence.DownloadCount}
            platforms={[dependence.Platform]}
            isSigned={dependence.IsSigned}
            key={index}
            lastUpdated={dependence.LastUpdated}
          />
        );
      })
    ) : (
      <div>
        <Typography className={classes.none}> Nothing found </Typography>
      </div>
    );
  };

  return (
    <div data-testid="depends-on-container">
      <Divider
        variant="fullWidth"
        sx={{ margin: '5% 0% 5% 0%', background: 'rgba(0, 0, 0, 0.38)', height: '0.00625rem', width: '100%' }}
      />
      <Stack direction="column" spacing={2}>
        {isLoading ? <Loading /> : renderDependencies()}
      </Stack>
    </div>
  );
}

export default DependsOn;
