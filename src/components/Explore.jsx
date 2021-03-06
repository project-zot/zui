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
import {api, endpoints} from '../api';
import {host} from '../constants';
import {isEmpty} from 'lodash';
import FilterCard from './FilterCard.jsx';
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
      alignItems:"center",
      color:"#00000099"
    }
}));

function Explore ({ keywords, data, updateData }) {
    const [isLoading, setIsLoading] = useState(true);
    const [filteredData, setFilteredData] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        api.get(`${host}${endpoints.imageList}`)
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

    const renderFilterCards = () => {
      return (
        <Stack spacing={2}>
          <FilterCard title="Products" filters={["Images","Plugins"]}/>
          <FilterCard title="Images" filters={["Verified publisher","Official images"]}/>
          <FilterCard title="Operating system" filters={["Windows","Linux"]}/>
          <FilterCard title="Architectures" filters={["ARM", "ARM 64", "IBM POWER", "IBM Z", "PowerPC 64 LE", "x86", "x86-64"]}/>
        </Stack>
      );
    };

    return (
        <Container maxWidth="lg">
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
                        <Grid container item xs={12}>
                          <Grid item xs={3}>
                          </Grid>
                          <Grid item xs={9}>
                            <Stack direction="row" className={classes.resultsRow}>
                                <Typography variant="body2" >Results {filteredData.length}</Typography>
                                <FormControl  sx={{m:'1', minWidth:"75px"}} size="small">
                                  <InputLabel>Sort</InputLabel>
                                  <Select label="Sort">                                
                                  </Select>
                                </FormControl>
                            </Stack>
                          </Grid>
                        </Grid>
                        <Grid container item xs={12} spacing={5} pt={1}>
                          <Grid item xs={3}>
                            {renderFilterCards()}
                          </Grid>
                          <Grid item xs={9}>
                           <Stack  direction="column" spacing={2}>{renderRepoCards()}</Stack>
                          </Grid>
                        </Grid>
                      </Grid>
                    )
                  }
        </Container>
    );
}

export default Explore;
