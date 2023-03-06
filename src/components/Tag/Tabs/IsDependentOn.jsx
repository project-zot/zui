import React, { useEffect, useMemo, useState, useRef } from 'react';
import { isEmpty, head } from 'lodash';

// utility
import { api, endpoints } from '../../../api';

// components
import { Divider, Typography, Stack } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { host } from '../../../host';
import Loading from '../../Shared/Loading';
import TagCard from '../../Shared/TagCard';
import { mapToImage } from 'utilities/objectModels';
import { EXPLORE_PAGE_SIZE } from 'utilities/paginationConstants';

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

function IsDependentOn(props) {
  const [images, setImages] = useState([]);
  const { name } = props;
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const abortController = useMemo(() => new AbortController(), []);

  // pagination props
  const [pageNumber, setPageNumber] = useState(1);
  const [isEndOfList, setIsEndOfList] = useState(false);
  const listBottom = useRef(null);

  const getPaginatedResults = () => {
    setIsLoading(true);
    api
      .get(
        `${host()}${endpoints.isDependentOnForImage(name, { pageNumber, pageSize: EXPLORE_PAGE_SIZE })}`,
        abortController.signal
      )
      .then((response) => {
        if (response.data && response.data.data) {
          let imagesData = response.data.data.DerivedImageList?.Results?.map((img) => mapToImage(img));
          const newImageList = [...images, ...imagesData];
          setImages(newImageList);
          setIsEndOfList(
            response.data.data.DerivedImageList?.Page?.ItemCount < EXPLORE_PAGE_SIZE ||
              newImageList.length >= response.data.data.DerivedImageList?.Page?.TotalCount
          );
        } else if (response.data.errors) {
          setIsEndOfList(true);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
        setIsEndOfList(true);
      });
  };

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

  const renderDependents = () => {
    return !isEmpty(images) ? (
      images.map((dependence, index) => {
        return (
          <TagCard
            repoName={dependence.repoName}
            tag={dependence.tag}
            vendor={dependence.vendor}
            platform={head(dependence.manifests)?.platform}
            isSigned={dependence.isSigned}
            size={head(dependence.manifests)?.size}
            digest={head(dependence.manifests)?.digest}
            key={index}
            lastUpdated={dependence.lastUpdated}
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
    if (!isLoading && !isEndOfList) {
      return <div ref={listBottom} />;
    }
    return '';
  };

  return (
    <div>
      <Divider
        variant="fullWidth"
        sx={{ margin: '5% 0% 5% 0%', background: 'rgba(0, 0, 0, 0.38)', height: '0.00625rem', width: '100%' }}
      />
      <Stack direction="column" spacing={2}>
        <Stack direction="column" spacing={2}>
          {renderDependents()}
          {renderListBottom()}
        </Stack>
      </Stack>
    </div>
  );
}

export default IsDependentOn;
