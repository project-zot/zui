import React, { useEffect, useState, useMemo } from 'react';
import { makeStyles } from '@mui/styles';
import { isEmpty } from 'lodash';
import { Divider, Typography, Stack } from '@mui/material';
import ReferrerCard from './ReferrerCard';
import Loading from './Loading';
import { api, endpoints } from 'api';
import { host } from '../host';
import { mapReferrer } from 'utilities/objectModels';

const useStyles = makeStyles(() => ({
  none: {
    color: '#52637A',
    fontSize: '1.4rem',
    fontWeight: '600'
  }
}));

function ReferredBy(props) {
  const { repoName, digest } = props;
  const [referrers, setReferrers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();
  const abortController = useMemo(() => new AbortController(), []);

  useEffect(() => {
    api
      .get(`${host()}${endpoints.referrers({ repo: repoName, digest })}`, abortController.signal)
      .then((response) => {
        if (response.data && response.data.data) {
          let referrersData = response.data.data.Referrers?.map((referrer) => mapReferrer(referrer));
          if (!isEmpty(referrersData)) {
            setReferrers(referrersData);
          }
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

  const renderReferrers = () => {
    return !isEmpty(referrers) ? (
      referrers.map((referrer, index) => {
        return (
          <ReferrerCard
            key={index}
            artifactType={referrer.artifactType}
            mediaType={referrer.mediaType}
            size={referrer.size}
            digest={referrer.digest}
            annotations={referrer.annotations}
          />
        );
      })
    ) : (
      <div>{!isLoading && <Typography className={classes.none}> Nothing found </Typography>}</div>
    );
  };

  const renderListBottom = () => {
    if (isLoading) {
      return <Loading />;
    }
    if (!isLoading) {
      return <div />;
    }
    return;
  };

  return (
    <div data-testid="referred-by-container">
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
        Referred By
      </Typography>
      <Divider
        variant="fullWidth"
        sx={{ margin: '5% 0% 5% 0%', background: 'rgba(0, 0, 0, 0.38)', height: '0.00625rem', width: '100%' }}
      />
      <Stack direction="column" spacing={2}>
        <Stack direction="column" spacing={2}>
          {renderReferrers()}
          {renderListBottom()}
        </Stack>
      </Stack>
    </div>
  );
}

export default ReferredBy;
