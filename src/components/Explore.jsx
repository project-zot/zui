// react global
import React, { useEffect, useState } from 'react';

// components
import RepoCard from './RepoCard.jsx';
import Loading from './Loading';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { Container, Grid, Stack } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

// utility
import { api, endpoints } from '../api';
import { host } from '../host';
import { mapToRepo } from 'utilities/objectModels.js';
import { useSearchParams } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  gridWrapper: {
    paddingTop: '2rem',
    paddingBottom: '2rem'
  },
  nodataWrapper: {
    backgroundColor: '#fff',
    height: '100vh'
  },
  exploreText: {
    color: '#C0C0C0',
    display: 'flex',
    alignItems: 'left'
  },
  resultsRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#00000099'
  },
  results: {
    marginLeft: '1rem'
  },
  sortForm: {
    backgroundColor: '#ffffff',
    borderColor: '#E0E0E0',
    borderRadius: '0.375em'
  }
}));

function Explore({ data, updateData }) {
  const [isLoading, setIsLoading] = useState(true);
  const [exploreData, setExploreData] = useState([]);
  // const [sortFilter, setSortFilter] = useState('');
  const [queryParams] = useSearchParams();
  const classes = useStyles();

  useEffect(() => {
    if (!queryParams.get('search')) {
      api
        .get(`${host()}${endpoints.repoList}`)
        .then((response) => {
          if (response.data && response.data.data) {
            let repoList = response.data.data.RepoListWithNewestImage;
            let repoData = repoList.map((responseRepo) => {
              return mapToRepo(responseRepo);
            });
            updateData(repoData);
            setIsLoading(false);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [updateData, queryParams]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Update component data based on response data, here filtering logic will be added
  useEffect(() => {
    setExploreData(data);
  }, [data]);

  const renderRepoCards = () => {
    return (
      exploreData &&
      exploreData.map((item, index) => {
        return (
          <RepoCard
            name={item.name}
            version={item.latestVersion}
            description={item.description}
            tags={item.tags}
            vendor={item.vendor}
            platforms={item.platforms}
            size={item.size}
            licenses={item.licenses}
            key={index}
            data={item}
            lastUpdated={item.lastUpdated}
            shown={true}
          />
        );
      })
    );
  };

  // const renderFilterCards = () => {
  //   return (
  //     <Stack spacing={2}>
  //       <FilterCard title="Products" filters={['Images', 'Plugins']} />
  //       <FilterCard title="Images" filters={['Verified publisher', 'Official images']} />
  //       <FilterCard title="Operating system" filters={['Windows', 'Linux']} />
  //       <FilterCard
  //         title="Architectures"
  //         filters={['ARM', 'ARM 64', 'IBM POWER', 'IBM Z', 'PowerPC 64 LE', 'x86', 'x86-64']}
  //       />
  //     </Stack>
  //   );
  // };

  // const handleSortChange = (event) => {
  //   setSortFilter(event.target.value);
  // };

  return (
    <Container maxWidth="lg">
      {isLoading && <Loading />}
      {!(exploreData && exploreData.length) ? (
        <Grid container className={classes.nodataWrapper}>
          <div style={{ marginTop: 20 }}>
            <div style={{}}>
              <Alert style={{ marginTop: 10, width: '100%' }} variant="outlined" severity="warning">
                Looks like we don&apos;t have anything matching that search. Try searching something else.
              </Alert>
            </div>
          </div>
        </Grid>
      ) : (
        <Grid container className={classes.gridWrapper}>
          <Grid container item xs={12}>
            <Grid item xs={0}></Grid>
            <Grid item xs={12}>
              <Stack direction="row" className={classes.resultsRow}>
                <Typography variant="body2" className={classes.results}>
                  Results {exploreData.length}
                </Typography>
                {/* <FormControl  sx={{m:'1', minWidth:"4.6875rem"}} className={classes.sortForm} size="small">
                                  <InputLabel>Sort</InputLabel>
                                  <Select label="Sort" value={sortFilter}  onChange={handleSortChange}  MenuProps={{disableScrollLock: true}}>
                                    <MenuItem value='relevance'>Relevance</MenuItem>                            
                                  </Select>
                                </FormControl> */}
              </Stack>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={5} pt={1}>
            {/* <Grid item xs={3}>
                            {renderFilterCards()}
                          </Grid> */}
            <Grid item xs={12}>
              <Stack direction="column" spacing={2}>
                {renderRepoCards()}
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default Explore;
