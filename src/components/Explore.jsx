// react global
import React, { useEffect, useState } from 'react';

// components
import ImageTile from './ImageTile.jsx';
import Loading from "./Loading";
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { Container, Grid } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

// utility
import api from '../api.js';
import {host} from '../constants';
import {isEmpty} from 'lodash';
//

const useStyles = makeStyles(() => ({
    gridWrapper: {
        backgroundColor: "#fff",
    },
    nodataWrapper: {
      backgroundColor: "#fff",
      height: '100vh',
    },
    exploreText: {
      color: '#C0C0C0',
      display: "flex",
      alignItems: "left",
    }
}));

function Explore ({ keywords, data, updateData }) {
    const [isLoading, setIsLoading] = useState(true);
    const [filteredData, setFilteredData] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        api.get(`${host}/query?query={ImageListWithLatestTag(){Name%20Latest%20Description%20Vendor%20Licenses%20Labels%20Size%20LastUpdated}}`)
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
                        vendor: image.Vendor
                    };
                });
                updateData(imagesData);
                setIsLoading(false);
            }
          })
          .catch(() => {

          })
    }, [])

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

    const renderImages = () => {
        return filteredData && filteredData.map((item, index) => {
            return (
                <ImageTile
                    name={item.name}
                    version={item.latestVersion}
                    description={item.description}
                    tags={item.tags}
                    vendor={item.vendor}
                    size={item.size}
                    licenses={item.licenses}
                    key={index}
                    data={item}
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
                          <div style={{marginTop: 20}}>
                            <div>
                              <Typography className={classes.exploreText}>{`Displaying ${filteredData.length} of ${filteredData.length} packages served from ${host}...`}</Typography>
                              <div style={{marginTop: 20}}>{renderImages()}</div>
                            </div>
                          </div>
                      </Grid>
                    )
                  }
        </Container>
    );
}

export default Explore;
