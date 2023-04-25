import React, { useEffect, useMemo, useState } from 'react';

// components
import { Stack, Typography } from '@mui/material';
import LayerCard from '../../Shared/LayerCard.jsx';
import makeStyles from '@mui/styles/makeStyles';
import Loading from '../../Shared/Loading';

const useStyles = makeStyles(() => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#FFFFFF',
    boxShadow: '0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)',
    borderRadius: '1.875rem',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%',
    marginTop: '0rem',
    marginBottom: '0rem',
    padding: '1rem 1.5rem '
  },
  content: {
    textAlign: 'left',
    color: '#606060',
    width: '100%',
    flexDirection: 'column'
  },
  title: {
    color: '#14191F',
    fontSize: '1rem',
    fontWeight: '400',
    paddingRight: '0.5rem',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem'
  },
  layer: {
    color: '#14191F',
    fontSize: '1rem',
    fontWeight: '400',
    paddingRight: '0.5rem',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem',
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    cursor: 'pointer'
  },
  values: {
    color: '#52637A',
    fontSize: '1rem',
    fontWeight: '400',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem',
    textAlign: 'right'
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

function HistoryLayers(props) {
  const classes = useStyles();
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const abortController = useMemo(() => new AbortController(), []);
  const { name, history } = props;

  useEffect(() => {
    setHistoryData(history);
    setIsLoading(false);
    return () => {
      abortController.abort();
    };
  }, [name]);

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
        component="div"
        align="left"
        style={{
          marginBottom: '1.7rem',
          color: 'rgba(0, 0, 0, 0.87)',
          fontSize: '1.5rem',
          fontWeight: '600'
        }}
      >
        Layers
      </Typography>
      {isLoading ? (
        <Loading />
      ) : (
        <Stack direction="column" spacing={2} sx={{ marginTop: '1.7rem' }} data-testid="layer-card-container">
          {historyData?.length > 0 ? (
            historyData.map((layer, index) => {
              return (
                <LayerCard
                  key={`${layer?.Layer?.Size}${index}`}
                  index={index + 1}
                  layer={layer?.Layer}
                  historyDescription={layer?.HistoryDescription}
                />
              );
            })
          ) : (
            <div>
              <Typography className={classes.none}> No Layer data available </Typography>
            </div>
          )}
        </Stack>
      )}
    </>
  );
}

export default HistoryLayers;
