// react global
import React, { useEffect, useState } from 'react';

// components
import RepoCard from './RepoCard.jsx';
import Loading from "./Loading";
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { Container, FormControl, Grid, InputLabel, Select, Stack } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

// utility
import api from '../api.js';
import {URL} from '../constants';
import {host} from '../constants';
import {isEmpty} from 'lodash';
//

const useStyles = makeStyles(() => ({
    gridWrapper: {
        // backgroundColor: "#fff",
    },
    nodataWrapper: {
      backgroundColor: "#fff",
      height: '100vh',
    },
    exploreText: {
      color: '#C0C0C0',
      display: "flex",
      alignItems: "left",
    },
    resultsRow: {
      justifyContent:"space-between",
      alignItems:"center"
    }
}));

function Explore ({ keywords, data, updateData }) {
    const [isLoading, setIsLoading] = useState(true);
    const [filteredData, setFilteredData] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        api.get(`${host}${URL.imageList}`)
          .then(response => {
            if (response.data && response.data.data) {
                let imageList = response.data.data.ImageListWithLatestTag;
                let imagesData = imageList.map((image) => {
                    return {
                        name: image.Name,
                        latestVersion: image.Latest,
                        tags: image.Labels,
                        description: image.Description,
                        licenses: image.Licenses,
                        size: image.Size,
                        vendor: image.Vendor,
                        lastUpdated: image.LastUpdated
                    };
                });
                updateData(imagesData);
                setIsLoading(false);
            }
          })
          .catch((e) => {
            console.error(e);
          })
    },[])

    useEffect(() => {
      setIsLoading(false);
    }, []);

    useEffect(() => {
        const filtered = data && data.filter((item) => {
            return (
                isEmpty(keywords) ||
                (item.name && item.name.toLocaleLowerCase().indexOf(filterStr) >= 0 ) ||
                (item.appID && item.appID.toLocaleLowerCase().indexOf(filterStr) >= 0) ||
                (item.appId && item.appId.toLocaleLowerCase().indexOf(filterStr) >= 0)
            )
        });

        setFilteredData(filtered);
    }, [keywords, data]);

    const filterStr = keywords && keywords.toLocaleLowerCase();

    const renderRepoCards = () => {
        return filteredData && filteredData.map((item, index) => {
            return (
                <RepoCard
                    name={item.name}
                    version={item.latestVersion}
                    description={item.description}
                    tags={item.tags}
                    vendor={item.vendor}
                    size={item.size}
                    licenses={item.licenses}
                    key={index}
                    data={item}
                    lastUpdated={item.lastUpdated}
                    shown={true}
                />
            );
        });
    }

    return (
        <Container maxWidth="md">
            { isLoading && <Loading /> }
                { !(filteredData && filteredData.length) ? (
                      <Grid container className={classes.nodataWrapper}>
                          <div style={{marginTop: 20}}>
                            <div style={{}}>
                                 <Alert style={{marginTop: 10, width: '100%'}} variant="outlined" severity="warning">Looks like we don't have anything matching that search. Try searching something else.</Alert>
                            </div>
                          </div>
                      </Grid>
                    ) : (
                      <Grid container className={classes.gridWrapper}>
                        <Grid item xs={12}>
                          <Stack direction="row" className={classes.resultsRow}>
                            <Typography variant="body2">Results {filteredData.length}</Typography>
                            <FormControl  sx={{m:'1', minWidth:"75px"}}>
                              <InputLabel>Sort</InputLabel>
                              <Select label="Sort">                                
                              </Select>
                            </FormControl>
                          </Stack>
                          <div style={{marginTop: 20}}>
                              <Stack direction="column" spacing={2}>{renderRepoCards()}</Stack>
                          </div>
                        </Grid>
                      </Grid>
                    )
                  }
        </Container>
    );
}

export default Explore;
