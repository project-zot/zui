import { Avatar, InputBase, List, ListItem, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import PhotoIcon from '@mui/icons-material/Photo';
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useMemo, useState } from 'react';
import { api, endpoints } from 'api';
import { host } from 'host';
import { mapToImage, mapToRepo } from 'utilities/objectModels';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { debounce, isEmpty } from 'lodash';
import { useCombobox } from 'downshift';
import { HEADER_SEARCH_PAGE_SIZE } from 'utilities/paginationConstants';

const useStyles = makeStyles(() => ({
  searchContainer: {
    display: 'inline-block',
    backgroundColor: '#2B3A4E',
    boxShadow: '0 0.313rem 0.625rem rgba(131, 131, 131, 0.08)',
    borderRadius: '0.625rem',
    minWidth: '100%',
    position: 'relative',
    zIndex: 1150
  },
  searchContainerFocused: {
    backgroundColor: '#FFFFFF'
  },
  search: {
    position: 'relative',
    flexDirection: 'row',
    boxShadow: '0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)',
    border: '0.063rem solid #8A96A8',
    borderRadius: '0.625rem',
    zIndex: 1155
  },
  searchFocused: {
    border: '0.125rem solid #E0E5EB',
    backgroundColor: '#FFFFF'
  },
  searchFailed: {
    border: '0.125rem solid #ff0303'
  },
  resultsWrapper: {
    margin: '0',
    marginTop: '-5%',
    paddingTop: '5%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2B3A4E',
    boxShadow: '0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)',
    borderBottomLeftRadius: '0.625rem',
    borderBottomRightRadius: '0.625rem',
    // border: '0.125rem solid #E7E7E7',
    borderTop: 0,
    width: '100%',
    overflowY: 'auto',
    zIndex: 1
  },
  resultsWrapperFocused: {
    backgroundColor: '#FFFFFF'
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
    marginLeft: 1,
    width: '90%',
    paddingLeft: 10,
    height: '40px',
    fontSize: '1rem',
    backgroundColor: '#2B3A4E',
    borderRadius: '0.625rem',
    color: '#8A96A8'
  },
  inputFocused: {
    backgroundColor: '#FFFFFF',
    borderRadius: '0.625rem',
    color: 'rgba(0, 0, 0, 0.6);'
  },
  searchItem: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: '#000000',
    height: '2.75rem',
    padding: '0 5%',
    cursor: 'pointer'
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

function SearchSuggestion({ setSearchCurrentValue = () => {} }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestionData, setSuggestionData] = useState([]);
  const [queryParams] = useSearchParams();
  const search = queryParams.get('search') || '';
  const [isLoading, setIsLoading] = useState(false);
  const [isFailedSearch, setIsFailedSearch] = useState(false);
  const [isComponentFocused, setIsComponentFocused] = useState(false);
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
    const name = event.target.value;
    if (key === 'Enter' || type === 'click') {
      if (name?.includes(':')) {
        const splitName = name.split(':');
        navigate(`/image/${encodeURIComponent(splitName[0])}/tag/${splitName[1]}`);
      } else {
        navigate({ pathname: `/explore`, search: createSearchParams({ search: inputValue || '' }).toString() });
      }
    }
  };

  const repoSearch = (value) => {
    api
      .get(
        `${host()}${endpoints.globalSearch({ searchQuery: value, pageNumber: 1, pageSize: HEADER_SEARCH_PAGE_SIZE })}`,
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
    const value = event?.inputValue;
    setSearchQuery(value);
    // used to lift up the state for pages that need to know the current value of the search input (currently only Explore) not used in other cases
    // one way binding, other components shouldn't set the value of the search input, but using this prop can read it
    setSearchCurrentValue(value);
    setIsFailedSearch(false);
    setIsLoading(true);
    setSuggestionData([]);
  };

  const searchCall = (value) => {
    if (value !== '') {
      // if search term inclused the ':' character, search for images, if not, search repos
      if (value?.includes(':')) {
        imageSearch(value);
      } else {
        repoSearch(value);
      }
    }
  };

  const debounceSuggestions = useMemo(() => {
    return debounce(searchCall, 300);
  }, []);

  useEffect(() => {
    debounceSuggestions(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    return () => {
      debounceSuggestions.cancel();
      abortController.abort();
    };
  }, []);

  const {
    // selectedItem,
    inputValue,
    getInputProps,
    getMenuProps,
    getItemProps,
    highlightedIndex,
    getComboboxProps,
    isOpen,
    openMenu
  } = useCombobox({
    items: suggestionData,
    onInputValueChange: handleSeachChange,
    onSelectedItemChange: handleSuggestionSelected,
    initialInputValue: !isEmpty(searchQuery) ? searchQuery : search,
    itemToString: (item) => item?.name || item
  });

  useEffect(() => {
    setIsComponentFocused(isOpen);
  }, [isOpen]);

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
            src={suggestion.logo ? `data:image/png;base64, ${suggestion.logo}` : ''}
          >
            <PhotoIcon className={classes.searchItemIcon} />
          </Avatar>
          <Typography>{suggestion.name}</Typography>
        </Stack>
      </ListItem>
    ));
  };

  return (
    <div className={`${classes.searchContainer} ${isComponentFocused && classes.searchContainerFocused}`}>
      <Stack
        className={`${classes.search} ${isComponentFocused && classes.searchFocused} ${
          isFailedSearch && !isLoading && classes.searchFailed
        }`}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        {...getComboboxProps()}
      >
        <InputBase
          placeholder={'Search for content...'}
          className={`${classes.input} ${isComponentFocused && classes.inputFocused}`}
          sx={{ input: { '&::placeholder': { opacity: 1 } } }}
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
        className={
          isOpen && !isFailedSearch
            ? `${classes.resultsWrapper} ${isComponentFocused && classes.resultsWrapperFocused}`
            : classes.resultsWrapperHidden
        }
      >
        {isOpen && suggestionData?.length > 0 && renderSuggestions()}
        {isOpen && isLoading && !isEmpty(searchQuery) && isEmpty(suggestionData) && (
          <>
            <ListItem
              className={classes.searchItem}
              style={{ color: '#52637A', fontSize: '1rem', textOverflow: 'ellipsis' }}
              {...getItemProps({ item: '', index: 0 })}
              spacing={2}
            >
              <Stack direction="row" spacing={2}>
                <Typography>Loading...</Typography>
              </Stack>
            </ListItem>
          </>
        )}
        {isOpen && isEmpty(searchQuery) && isEmpty(suggestionData) && (
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
