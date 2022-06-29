// components
import {Container, Typography} from '@mui/material';
import Home from '@mui/icons-material/Home';
import Explore from './Explore.jsx';

import makeStyles from '@mui/styles/makeStyles';

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
