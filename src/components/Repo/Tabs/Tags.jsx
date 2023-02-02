// react global
import React, { useState } from 'react';

// components
import Typography from '@mui/material/Typography';
import { Card, CardContent, Divider, Stack, InputBase, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { makeStyles } from '@mui/styles';
import TagCard from '../../Shared/TagCard';
import { tagsSortByCriteria } from 'utilities/sortCriteria';

const useStyles = makeStyles(() => ({
  tagCard: {
    marginBottom: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    background: '#FFFFFF',
    boxShadow: 'none!important',
    borderRadius: '1.875rem',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%'
  },
  card: {
    marginBottom: '2rem',
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
    width: '100%'
  },
  content: {
    textAlign: 'left',
    color: '#606060',
    padding: '2% 3% 2% 3%',
    width: '100%'
  },
  clickCursor: {
    cursor: 'pointer'
  },
  search: {
    position: 'relative',
    minWidth: '100%',
    flexDirection: 'row',
    marginBottom: '1.7rem',
    boxShadow: '0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)',
    border: '0.125rem solid #E7E7E7',
    borderRadius: '1rem',
    zIndex: 1155
  },
  searchIcon: {
    color: '#52637A',
    paddingRight: '3%'
  },
  input: {
    color: '#464141',
    marginLeft: 1,
    width: '90%'
  }
}));

export default function Tags(props) {
  const classes = useStyles();
  const { tags } = props;
  const [tagsFilter, setTagsFilter] = useState('');
  const [sortFilter, setSortFilter] = useState(tagsSortByCriteria.updateTimeDesc.value);
  const renderTags = (tags) => {
    const selectedSort = Object.values(tagsSortByCriteria).find((sc) => sc.value === sortFilter);
    const filteredTags = tags.filter((t) => t.Tag?.includes(tagsFilter));
    if (selectedSort) {
      filteredTags.sort(selectedSort.func);
    }
    return (
      tags &&
      filteredTags.map((tag) => {
        return (
          <TagCard
            key={tag.Tag}
            tag={tag.Tag}
            lastUpdated={tag.LastUpdated}
            digest={tag.Digest}
            vendor={tag.Vendor}
            size={tag.Size}
            platform={tag.Platform}
          />
        );
      })
    );
  };

  const handleTagsFilterChange = (e) => {
    const { value } = e.target;
    setTagsFilter(value);
  };

  const handleTagsSortChange = (e) => {
    const { value } = e.target;
    setSortFilter(value);
  };

  return (
    <Card className={classes.tagCard} data-testid="tags-container">
      <CardContent className={classes.content}>
        <Stack direction="row" justifyContent="space-between">
          <Typography
            variant="h4"
            gutterBottom
            component="div"
            align="left"
            style={{ color: 'rgba(0, 0, 0, 0.87)', fontSize: '1.5rem', fontWeight: '600' }}
          >
            Tags History
          </Typography>
          <div>
            <FormControl sx={{ m: '1', minWidth: '4.6875rem' }} className={classes.sortForm} size="small">
              <InputLabel>Sort</InputLabel>
              <Select
                label="Sort"
                value={sortFilter}
                onChange={handleTagsSortChange}
                MenuProps={{ disableScrollLock: true }}
              >
                {Object.values(tagsSortByCriteria).map((el) => (
                  <MenuItem key={el.value} value={el.value}>
                    {el.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </Stack>
        <Divider
          variant="fullWidth"
          sx={{
            margin: '5% 0% 5% 0%',
            background: 'rgba(0, 0, 0, 0.38)',
            height: '0.00625rem',
            width: '100%'
          }}
        />
        <Stack
          className={classes.search}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <InputBase
            style={{ paddingLeft: 10, height: 46, color: 'rgba(0, 0, 0, 0.6)' }}
            placeholder={'Search for Tags...'}
            className={classes.input}
            value={tagsFilter}
            onChange={handleTagsFilterChange}
          />
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
        </Stack>
        {renderTags(tags)}
      </CardContent>
    </Card>
  );
}
