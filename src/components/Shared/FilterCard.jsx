import { Card, CardContent, Checkbox, FormControlLabel, Stack, Tooltip, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { isArray, isNil } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    minWidth: '15%',
    alignItems: 'flex-start',
    background: '#FFFFFF',
    boxShadow: '0rem 0.313rem 0.625rem rgba(131, 131, 131, 0.08)',
    borderColor: '#FFFFFF',
    borderRadius: '0.75rem',
    color: '#14191F'
  },
  cardContent: {
    '&:last-child': {
      padding: '1rem'
    }
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
    letterSpacing: '-0.01rem',
    marginBottom: '1rem'
  },
  formControl: {
    marginLeft: '0',
    marginRight: '0'
  },
  cardContentText: {
    fontSize: '1rem',
    color: theme.palette.secondary.dark,
    lineHeight: '1.5rem',
    paddingLeft: '0.5rem'
  }
}));

function FilterCard(props) {
  const classes = useStyles();
  const { title, filters, updateFilters, filterValue, wrapperLoading } = props;

  const handleFilterClicked = (event, changedFilterValue) => {
    const { checked } = event.target;
    if (checked) {
      if (!isArray(filterValue)) {
        updateFilters({ ...filterValue, [changedFilterValue]: true });
      } else {
        updateFilters([...filterValue, changedFilterValue]);
      }
    } else {
      if (!isArray(filterValue)) {
        updateFilters({ ...filterValue, [changedFilterValue]: false });
      } else {
        updateFilters(filterValue.filter((e) => e !== changedFilterValue));
      }
      // setSelectedFilter(null);
    }
  };

  const getCheckboxStatus = (filter) => {
    if (isNil(filter)) {
      return false;
    }
    if (isArray(filterValue)) {
      return filterValue?.includes(filter.label);
    }
    return filterValue[filter.value] || false;
  };

  const { t } = useTranslation();

  const getFilterRows = () => {
    const filterRows = filters;
    return filterRows.map((filter, index) => {
      return (
        <Tooltip key={index} title={filter.tooltip ?? t(filter.label)} placement="top" arrow>
          <FormControlLabel
            className={classes.formControl}
            componentsProps={{ typography: { variant: 'body2', className: classes.cardContentText } }}
            control={<Checkbox sx={{ padding: '0.188rem', color: '#52637A' }} />}
            label={t(filter.label)}
            id={title}
            checked={getCheckboxStatus(filter)}
            onChange={() => handleFilterClicked(event, filter.value)}
            disabled={wrapperLoading}
          />
        </Tooltip>
      );
    });
  };

  return (
    <Card variant="outlined" className={classes.card}>
      <CardContent className={classes.cardContent}>
        <Typography className={classes.cardTitle}>{title || t('filterCard.filterTitle')}</Typography>
        <Stack direction="column">{getFilterRows()}</Stack>
      </CardContent>
    </Card>
  );
}

export default FilterCard;
