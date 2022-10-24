import { Avatar, InputBase, List, ListItem, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import PhotoIcon from '@mui/icons-material/Photo';
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useMemo, useState } from 'react';
import { api, endpoints } from 'api';
import { host } from 'host';
import { mapToImage, mapToRepo } from 'utilities/objectModels';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { debounce, isEmpty } from 'lodash';
import { useCombobox } from 'downshift';

const useStyles = makeStyles(() => ({
  searchContainer: {
    display: 'inline-block',
    backgroundColor: '#FFFFFF',
    boxShadow: '0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)',
    borderRadius: '2.5rem',
    minWidth: '60%',
    marginLeft: 16,
    position: 'relative',
    zIndex: 1150
  },
  search: {
    position: 'relative',
    minWidth: '100%',
    flexDirection: 'row',
    boxShadow: '0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)',
    border: '0.125rem solid #E7E7E7',
    borderRadius: '2.5rem',
    zIndex: 1155
  },
  searchFailed: {
    position: 'relative',
    minWidth: '100%',
    flexDirection: 'row',
    boxShadow: '0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)',
    border: '0.125rem solid #ff0303',
    borderRadius: '2.5rem',
    zIndex: 1155
  },
  resultsWrapper: {
    margin: '0',
    marginTop: '-2%',
    paddingTop: '3%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    boxShadow: '0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)',
    borderBottomLeftRadius: '2.5rem',
    borderBottomRightRadius: '2.5rem',
    // border: '0.125rem solid #E7E7E7',
    borderTop: 0,
    width: '100%',
    overflowY: 'auto',
    zIndex: 1
  },
  resultsWrapperHidden: {
    display: 'none'
  },
  searchIcon: {
    color: '#52637A',
    paddingRight: '3%',
    cursor: 'pointer'
  },
  input: {
    color: '#464141',
    marginLeft: 1,
    width: '90%'
  },
  searchItem: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: '#000000',
    height: '2.75rem',
    padding: '0 5%'
  },
  searchItemIconBg: {
    backgroundColor: '#FFFFFF',
    height: '1.5rem',
    width: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  searchItemIcon: {
    color: '#0000008A',
    minHeight: '100%',
    minWidth: '100%',
    objectFit: 'fill'
  }
}));

function SearchSuggestion() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestionData, setSuggestionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFailedSearch, setIsFailedSearch] = useState(false);
  const navigate = useNavigate();
  const abortController = useMemo(() => new AbortController(), []);
  const classes = useStyles();

  const handleSuggestionSelected = (event) => {
    const name = event.selectedItem?.name;
    if (name?.includes(':')) {
      const splitName = name.split(':');
      navigate(`/image/${encodeURIComponent(splitName[0])}/tag/${splitName[1]}`);
    } else {
      navigate(`/image/${encodeURIComponent(name)}`);
    }
  };

  const handleSearch = (event) => {
    const { key, type } = event;
    if (key === 'Enter' || type === 'click') {
      navigate({ pathname: `/explore`, search: createSearchParams({ search: searchQuery }).toString() });
    }
  };

  const repoSearch = (value) => {
    api
      .get(
        `${host()}${endpoints.globalSearch({ searchQuery: value, pageNumber: 1, pageSize: 9 })}`,
        abortController.signal
      )
      .then((suggestionResponse) => {
        if (suggestionResponse.data.data.GlobalSearch.Repos) {
          const suggestionParsedData = suggestionResponse.data.data.GlobalSearch.Repos.map((el) => mapToRepo(el));
          setSuggestionData(suggestionParsedData);
          if (isEmpty(suggestionParsedData)) {
            setIsFailedSearch(true);
          }
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
        setIsFailedSearch(true);
      });
  };

  const imageSearch = (value) => {
    api
      .get(
        `${host()}${endpoints.imageSuggestions({ searchQuery: value, pageNumber: 1, pageSize: 9 })}`,
        abortController.signal
      )
      .then((suggestionResponse) => {
        if (suggestionResponse.data.data.GlobalSearch.Images) {
          const suggestionParsedData = suggestionResponse.data.data.GlobalSearch.Images.map((el) => mapToImage(el));
          setSuggestionData(suggestionParsedData);
          if (isEmpty(suggestionParsedData)) {
            setIsFailedSearch(true);
          }
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
        setIsFailedSearch(true);
      });
  };

  const handleSeachChange = (event) => {
    const value = event.inputValue;
    setSearchQuery(value);
    setIsFailedSearch(false);
    setSuggestionData([]);
    if (value !== '') {
      setIsLoading(true);
      // if search term inclused the ':' character, search for images, if not, search repos
      if (value?.includes(':')) {
        imageSearch(value);
      } else {
        repoSearch(value);
      }
    }
  };

  const debounceSuggestions = useMemo(() => {
    return debounce(handleSeachChange, 300);
  }, []);

  useEffect(() => {
    return () => {
      debounceSuggestions.cancel();
      abortController.abort();
    };
  });

  const {
    // selectedItem,
    getInputProps,
    getMenuProps,
    getItemProps,
    highlightedIndex,
    getComboboxProps,
    isOpen,
    openMenu
    // closeMenu
  } = useCombobox({
    items: suggestionData,
    onInputValueChange: debounceSuggestions,
    onSelectedItemChange: handleSuggestionSelected,
    itemToString: (item) => item.name ?? ''
  });

  const renderSuggestions = () => {
    return suggestionData.map((suggestion, index) => (
      <ListItem
        key={`${suggestion.name}_${index}`}
        className={classes.searchItem}
        style={highlightedIndex === index ? { backgroundColor: '#F6F7F9' } : {}}
        {...getItemProps({ item: suggestion, index })}
        spacing={2}
      >
        <Stack direction="row" spacing={2}>
          <Avatar
            variant="square"
            classes={{
              root: classes.searchItemIconBg,
              img: classes.searchItemIcon
            }}
            src={`data:image/png;base64, ${suggestion.logo}`}
          >
            <PhotoIcon className={classes.searchItemIcon} />
          </Avatar>
          <Typography>{suggestion.name}</Typography>
        </Stack>
      </ListItem>
    ));
  };

  return (
    <div className={classes.searchContainer}>
      <Stack
        className={isFailedSearch && !isLoading ? classes.searchFailed : classes.search}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        {...getComboboxProps()}
      >
        <InputBase
          style={{ paddingLeft: 10, height: 46, color: 'rgba(0, 0, 0, 0.6)' }}
          placeholder="Search for content..."
          className={classes.input}
          onKeyUp={handleSearch}
          onFocus={() => openMenu()}
          {...getInputProps()}
        />
        <div onClick={handleSearch} className={classes.searchIcon}>
          <SearchIcon />
        </div>
      </Stack>
      <List
        {...getMenuProps()}
        className={isOpen && !isLoading ? classes.resultsWrapper : classes.resultsWrapperHidden}
      >
        {isOpen && suggestionData?.length > 0 && renderSuggestions()}
        {isOpen && isEmpty(searchQuery) && (
          <>
            <ListItem
              className={classes.searchItem}
              style={{ color: '#52637A', fontSize: '1rem', textOverflow: 'ellipsis' }}
              {...getItemProps({ item: '', index: 0 })}
              spacing={2}
              onClick={() => {}}
            >
              <Stack direction="row" spacing={2}>
                <Typography>Press Enter for advanced search</Typography>
              </Stack>
            </ListItem>
            <ListItem
              className={classes.searchItem}
              style={{ color: '#52637A', fontSize: '1rem', textOverflow: 'ellipsis' }}
              {...getItemProps({ item: '', index: 0 })}
              spacing={2}
              onClick={() => {}}
            >
              <Stack direction="row" spacing={2}>
                <Typography>Use the &apos;:&apos; character to search for tags</Typography>
              </Stack>
            </ListItem>
          </>
        )}
      </List>
    </div>
  );
}

export default SearchSuggestion;
