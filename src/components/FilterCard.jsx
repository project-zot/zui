import { Card, CardContent, Checkbox, FormControlLabel, Stack, Tooltip, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';

const useStyles = makeStyles(() => ({
  card: {
    display: 'flex',
    minWidth: '15%',
    alignItems: 'flex-start',
    background: '#FFFFFF',
    boxShadow: '0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)',
    borderColor: '#FFFFFF',
    borderRadius: '1.5rem',
    color: '#14191F'
  }
}));

function FilterCard(props) {
  const classes = useStyles();
  const { title, filters, updateFilters, filterValue } = props;
  // const [selectedFilter, setSelectedFilter] = useState(null);

  const handleFilterClicked = (event, changedFilterLabel, changedFilterValue) => {
    const { checked } = event.target;

    if (checked) {
      if (filters[0]?.type === 'boolean') {
        updateFilters(checked);
      } else {
        updateFilters([...filterValue, changedFilterValue]);
      }
      // setSelectedFilter(changedFilterLabel);
    } else {
      if (filters[0]?.type === 'boolean') {
        updateFilters(checked);
      } else {
        updateFilters(filterValue.filter((e) => e !== changedFilterValue));
      }
      // setSelectedFilter(null);
    }
  };

  const getFilterRows = () => {
    const filterRows = filters;
    return filterRows.map((filter, index) => {
      return (
        <Tooltip key={index} title={filter.tooltip ?? filter.label} placement="right">
          <FormControlLabel
            componentsProps={{ typography: { variant: 'body2' } }}
            control={<Checkbox />}
            label={filter.label}
            id={title}
            // checked={filter.label === selectedFilter}
            onChange={() => handleFilterClicked(event, filter.label, filter.value)}
          />
        </Tooltip>
      );
    });
  };

  return (
    <Card variant="outlined" className={classes.card}>
      <CardContent>
        <Typography variant="h6">{title || 'Filter Title'}</Typography>
        <Stack direction="column">{getFilterRows()}</Stack>
      </CardContent>
    </Card>
  );
}

export default FilterCard;
