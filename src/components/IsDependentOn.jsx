import React, { useEffect, useState } from 'react';

// utility
import { api, endpoints } from '../api';

// components
import { Divider, Typography, Card, CardContent } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Link } from 'react-router-dom';
import { host } from '../host';

const useStyles = makeStyles(() => ({
  card: {
    background: '#FFFFFF',
    boxShadow: '0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)',
    borderRadius: '1.875rem',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%',
    marginTop: '2rem',
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  content: {
    textAlign: 'left',
    color: '#606060',
    padding: '2% 3% 2% 3%',
    width: '100%'
  },
  title: {
    color: '#828282',
    fontSize: '1rem',
    paddingRight: '0.5rem',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem'
  },
  values: {
    color: '#000000',
    fontSize: '1rem',
    fontWeight: '600',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem'
  },
  link: {
    color: '#52637A',
    fontSize: '1rem',
    letterSpacing: '0.009375rem',
    paddingRight: '1rem',
    textDecorationLine: 'underline'
  }
}));

function IsDependentOn(props) {
  const [images, setImages] = useState([]);
  const { name } = props;
  const classes = useStyles();
  //const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    api
      .get(`${host()}${endpoints.isDependentOnForImage(name)}`)
      .then((response) => {
        if (response.data && response.data.data) {
          let images = response.data.data.DerivedImageList;
          setImages(images);
        }
      })
      .catch((e) => {
        console.error(e);
        //setImages([]);
      });
    //setIsLoaded(true);
  }, []);

  return (
    <div>
      <Typography
        variant="h4"
        gutterBottom
        component="div"
        align="left"
        className={classes.title}
        style={{ color: 'rgba(0, 0, 0, 0.87)', fontSize: '1.5rem', fontWeight: '600', paddingTop: '0.5rem' }}
      >
        Is Dependent On
      </Typography>
      <Divider
        variant="fullWidth"
        sx={{ margin: '5% 0% 5% 0%', background: 'rgba(0, 0, 0, 0.38)', height: '0.00625rem', width: '100%' }}
      />
      <Card className={classes.card} raised>
        <CardContent>
          <Typography className={classes.content}>
            {images &&
              images.map((dependence, index) => {
                return (
                  <Link key={index} to={`/image/${encodeURIComponent(dependence.RepoName)}`} className={classes.link}>
                    {dependence.RepoName}
                  </Link>
                );
              })}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default IsDependentOn;
