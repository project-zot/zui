// components
import Header from './Header.jsx'
import ExploreHeader from './ExploreHeader.jsx'
import Leftbar from './Leftbar.jsx'
import Rightbar from './Rightbar.jsx'

// styling
import {makeStyles} from '@material-ui/core';
import {Container, Typography, Grid} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(5),
        paddingBottom: theme.spacing(5),
        height: '100vh',
    },
    gridWrapper: {
        backgroundColor: "#fff",
        border: "1px #f2f2f2 dashed",
    },
    pageWrapper: {
      
    },
    tile: {
      width: '100%',
    }
}));

function HomePage({ host, username, password, data, updateData, keywords, updateKeywords }) {
  const classes = useStyles();

  return (
      <div className={classes.pageWrapper}>
        <Header updateKeywords={updateKeywords}></Header>
        <Container maxWidth="md" className={classes.container}>
            <Grid container className={classes.gridWrapper}>
                <Grid item className={classes.tile}>
                    <Rightbar host={host} username={username} password={password} keywords={keywords} data={data} updateData={updateData}/>
                </Grid>
            </Grid>
        </Container>
      </div>
  );
}

export default HomePage;
