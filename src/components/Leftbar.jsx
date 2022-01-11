// components
import {Container, Typography} from '@material-ui/core';
import Home from '@mui/icons-material/Home';

// styling
import {makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(10),
  },
}));

function Leftbar() {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
        <div className={classes.item}>
          <Home className={classes.icon} />
          <Typography className={classes.text}>Filter section</Typography>
        </div>
    </Container>
  );
}

export default Leftbar;
