import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { isEmpty } from 'lodash';
import { Divider, Typography, Stack } from '@mui/material';
import ReferrerCard from '../../Shared/ReferrerCard';
import Loading from '../../Shared/Loading';
import { mapReferrer } from 'utilities/objectModels';

const useStyles = makeStyles(() => ({
  none: {
    color: '#52637A',
    fontSize: '1.4rem',
    fontWeight: '600'
  }
}));

function ReferredBy(props) {
  const { referrers } = props;
  const [referrersData, setReferrersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    if (!isEmpty(referrers)) {
      const mappedReferrersData = referrers.map((referrer) => mapReferrer(referrer));
      setReferrersData(mappedReferrersData);
    } else {
      setReferrersData([]);
    }
    setIsLoading(false);
  }, []);

  const renderReferrers = () => {
    return !isEmpty(referrersData) ? (
      referrersData.map((referrer, index) => {
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
          {isLoading ? <Loading /> : renderReferrers()}
        </Stack>
      </Stack>
    </div>
  );
}

export default ReferredBy;
