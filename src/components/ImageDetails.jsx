// react global
import { useParams, useLocation } from 'react-router-dom'
import React, { useEffect, useState } from 'react';

// utility
import axios from 'axios';

// components
import Header from './Header.jsx'
import ImageTile from './ImageTile.jsx'
import Tags from './Tags.jsx'
import {Container, Typography, Box, Grid} from '@material-ui/core';

// styling
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    pageWrapper: {
        backgroundColor: "#f2f2f2a1",
    },
    container: {
        paddingTop: theme.spacing(5),
        paddingBottom: theme.spacing(5),
        marginTop: 100,
        backgroundColor: "#f2f2f2a1",
    },
    parentWrapper: {
        height: '100vh',
    },
    gridWrapper: {
        paddingTop: theme.spacing(10),
        paddingBottom: theme.spacing(10),
        backgroundColor: "#fff",
        border: "1px #f2f2f2 dashed",
    },
}));


function ImageDetails (props) {
  const {host, username, password} = props;
  const [imageDetailData, setImageDetailData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // get data from <Link here
  const location = useLocation();
  const myData = location && location.state && location.state.data;

  // get url param from <Route here (i.e. image name)
  const {name} = useParams();
  const classes = useStyles();

  useEffect(() => {
      const {name, version} = myData;

      // const token = btoa("test:test123");
      const token = btoa(username + ':' + password);
      const cfg = {
        headers: {
          'Authorization': `Basic ${token}`,
        }
      };

      axios.get(`${host}/query?query={DetailedRepoInfo(repo:\%22${name}\%22){Manifests%20{Digest%20Tag%20Layers%20{Size%20Digest}}}}`, cfg)
        .then(response => {
          if (response.data && response.data.data) {
              let imageList = response.data.data.DetailedRepoInfo;
              let imageData = {
                name: name,
                tags: imageList.Manifests
              }
              setImageDetailData(imageData);
              setIsLoading(false);
          }
        })
        .catch(() => {
            setImageDetailData({});
        });
  }, [])


  return (
      <div className={classes.pageWrapper}>
        <Header></Header>
        <Container maxWidth="md" className={classes.container}>
          <div className={classes.parentWrapper}>
            <Grid container className={classes.gridWrapper}>
                <Grid item md={1} ></Grid>
                <Grid item md={10}>
                    <Box>
                        <ImageTile className={classes.tile}
                           name={myData.name}
                           version={myData.latestVersion}
                           description={myData.description}
                           tags={myData.tags}
                           vendor={myData.vendor}
                           size={myData.size}
                           licenses={myData.licenses}
                           key={myData}
                           size="lg"
                           shown={true}
                        />
                    </Box>
                    <Tags data={imageDetailData} />
                </Grid>
                <Grid item md={1} ></Grid>
            </Grid>
         </div>
        </Container>
      </div>
  );
}

export default ImageDetails;
