import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';

// utility
import { api, endpoints } from '../../../api';

// components
import { Typography, Stack } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { host } from '../../../host';
import Loading from '../../Shared/Loading';
import TagCard from '../../Shared/TagCard';
import { mapToImage } from 'utilities/objectModels';
import { EXPLORE_PAGE_SIZE } from 'utilities/paginationConstants';

const useStyles = makeStyles(() => ({
  title: {
    marginBottom: '1.7rem',
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: '1.5rem',
    fontWeight: '600'
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

  const { t } = useTranslation();

  const renderDependents = () => {
    return !isEmpty(images) ? (
      images?.map((dependence, index) => {
        return (
          <TagCard
            repoName={dependence.repoName}
            tag={dependence.tag}
            vendor={dependence.vendor}
            signatureInfo={dependence.signatureInfo}
            manifests={dependence.manifests}
            key={index}
            lastUpdated={dependence.lastUpdated}
          />
        );
      })
    ) : (
      <div>{!isLoading && <Typography className={classes.none}> {t('main.nothingFound')} </Typography>}</div>
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
    <div data-testid="dependents-container">
      <Typography variant="h4" gutterBottom component="div" align="left" className={classes.title}>
        {t('main.usedBy')}
      </Typography>
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
