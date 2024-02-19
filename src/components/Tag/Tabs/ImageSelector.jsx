import {
  Avatar,
  FormControl,
  FormHelperText,
  InputBase,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import PhotoIcon from '@mui/icons-material/Photo';
import React, { useEffect, useMemo, useState } from 'react';
import { api, endpoints } from 'api';
import { host } from 'host';
import { mapToImage, mapToRepo } from 'utilities/objectModels';
import { useSearchParams } from 'react-router-dom';
import { debounce, isEmpty } from 'lodash';
import { useCombobox } from 'downshift';
import { HEADER_SEARCH_PAGE_SIZE } from 'utilities/paginationConstants';

const useStyles = makeStyles(() => ({
  searchContainer: {
    display: 'inline-block',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 0.313rem 0.625rem rgba(131, 131, 131, 0.08)',
    borderRadius: '0.625rem',
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
    backgroundColor: '#FFFFFF',
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
  input: {
    marginLeft: 1,
    width: '90%',
    paddingLeft: 10,
    height: '40px',
    fontSize: '1rem',
    backgroundColor: '#FFFFFF',
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

function ImageSelector({ setSearchCurrentValue = () => {}, name, tag }) {
  // digest, selectedPlatform
  const [inputHelpText, setInputHelpText] = useState('Specify a repo:tag');
  const [activePlatformSelection, setActivePlatformSelection] = useState(false);
  const [platformOptions, setPlatformOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [platform, setPlatform] = useState('');
  const [suggestionData, setSuggestionData] = useState([]);
  const [queryParams] = useSearchParams();
  const search = queryParams.get('search') || '';
  const [isLoading, setIsLoading] = useState(false);
  const [isFailedSearch, setIsFailedSearch] = useState(false);
  const [isComponentFocused, setIsComponentFocused] = useState(false);
  const abortController = useMemo(() => new AbortController(), []);

  const classes = useStyles();

  const handleSuggestionSelected = (event) => {
    let name = event.selectedItem?.name;
    if (!name?.includes(':')) {
      name += ':';
      setInputHelpText('Specify a :tag');
    } else {
      setInputHelpText('Image Selected');
      setActivePlatformSelection(true);
      let platforms = getImagePlatforms(event.selectedItem);
      setPlatformOptions(platforms);
    }
  };

  const handleSearchChange = (event) => {
    const value = event?.inputValue;
    setSearchQuery(value);
    // used to lift up the state for pages that need to know the current value of the search input (currently only Explore) not used in other cases
    // one way binding, other components shouldn't set the value of the search input, but using this prop can read it
    setSearchCurrentValue(value);
    setIsFailedSearch(false);
    setIsLoading(true);
    setSuggestionData([]);
    if (value === '') {
      setInputHelpText('Specify a repo:tag');
    }
  };

  const handleSearch = () => {
    console.log(inputValue ? '' : inputValue);
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
          setInputHelpText('Specify a repo:tag');
          if (suggestionParsedData.length === 1 && suggestionParsedData[0].repo === value) {
            setInputHelpText('Specify a :tag');
          } else if (isEmpty(suggestionParsedData)) {
            setIsFailedSearch(true);
            setInputHelpText('Repo not found');
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

  const getImagePlatforms = (image) => {
    return image.manifests.map((it) => ({ os: it.platform.Os, arch: it.platform.Arch }));
  };

  const imageSearch = (value) => {
    let tag = value.split(':')[1];
    api
      .get(
        `${host()}${endpoints.imageSuggestionsWithPlatforms({ searchQuery: value, pageNumber: 1, pageSize: 9 })}`,
        abortController.signal
      )
      .then((suggestionResponse) => {
        if (suggestionResponse.data.data.GlobalSearch.Images) {
          const suggestionParsedData = suggestionResponse.data.data.GlobalSearch.Images.map((el) => mapToImage(el));
          setSuggestionData(suggestionParsedData);
          setActivePlatformSelection(false);
          setActivePlatformSelection(false);
          if (suggestionParsedData.length === 1 && suggestionParsedData[0].tag === tag) {
            setInputHelpText('Image Selected'); // if the current text matches a valid repo-tag
          } else if (isEmpty(suggestionParsedData)) {
            setIsFailedSearch(true);
            setInputHelpText('Tag not found');
          } else {
            setInputHelpText('Specify a :tag');
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
    onInputValueChange: handleSearchChange,
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

  const renderPlatformOptions = () => {
    return platformOptions.map((it, index) => (
      <MenuItem value={it} key={`${it.os}_${index}`}>
        {`${it.os}/${it.arch}`}
      </MenuItem>
    ));
  };

  const renderHelpText = () => {
    return <FormHelperText>{inputHelpText}</FormHelperText>;
  };

  return (
    <FormControl
      className={`${classes.searchContainer}
      ${isComponentFocused && classes.searchContainerFocused}`}
    >
      {renderHelpText()}
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
          placeholder={'Search for an image:tag'}
          value={name !== '' ? name + ':' + tag : ''}
          className={`${classes.input} ${isComponentFocused && classes.inputFocused}`}
          sx={{ input: { '&::placeholder': { opacity: 1 } } }}
          onKeyUp={handleSearch}
          onFocus={() => openMenu()}
          {...getInputProps()}
        />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Platform</InputLabel>
          <Select
            disabled={activePlatformSelection ? false : true}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Age"
            value={platform}
            onChange={(event) => {
              setPlatform(event.target.value);
            }}
          >
            {renderPlatformOptions()}
          </Select>
        </FormControl>
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
                <Typography>Use the &apos;:&apos; character to search for tags</Typography>
              </Stack>
            </ListItem>
          </>
        )}
      </List>
    </FormControl>
  );
}

export default ImageSelector;
