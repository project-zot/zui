// components
import {Container, Typography} from '@material-ui/core';
import Home from '@mui/icons-material/Home';
import Explore from './Explore.jsx';

// styling
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
      padding: theme.spacing(5),
  }
}));

function Rightbar({ host, username, password, data, keywords, updateData }) {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
        <Explore host={host} username={username} password={password} keywords={keywords} data={data} updateData={updateData}/>
    </Container>
  );
}

export default Rightbar;
