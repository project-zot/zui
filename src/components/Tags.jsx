// react global
import * as React from 'react';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

// components
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import transform from 'utilities/transform';
import { Card, CardContent, Divider, Stack } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  tagCard: {
    marginBottom: 2,
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    background:"#FFFFFF",
    boxShadow:"none!important",
    borderRadius:"1.875rem",
    flex:"none",
    alignSelf:"stretch",
    flexGrow:0,
    order:0,
    width:"100%"
  },
  card: {
    marginBottom: 2,
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    background:"#FFFFFF",
    boxShadow:"0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)",
    borderRadius:"1.875rem",
    flex:"none",
    alignSelf:"stretch",
    flexGrow:0,
    order:0,
    width:"100%"
  },
  content: {
    textAlign: "left",
    color: "#606060",
    padding: "2% 3% 2% 3%",
    width:"100%"
  }
}));




function TagCard(props) {
  const {row, lastUpdated, vendors} = props;

  //const tags = data && data.tags;
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const tagRow = row;
  const lastDate = (lastUpdated ? DateTime.fromISO(lastUpdated) : DateTime.now().minus({ days: 1 })).toRelative({ unit: 'days' })
  const navigate = useNavigate();

  const goToTags = (tag) => {
    navigate(`tag/${tag}`);
  };

  return (
    <Card className={classes.card} raised>
      <CardContent className={classes.content}>
        <Typography variant="body1" align="left" sx={{color:"#828282", fontSize: "1rem", paddingBottom:"0.5rem"}}>Tag</Typography>
        <Typography variant="body1" align="left" sx={{color:"#1479FF", fontSize: "1rem", textDecorationLine: "underline",  cursor:'pointer'}} onClick={() => goToTags(tagRow.Tag)}>{tagRow.Tag}</Typography>

        <Stack sx={{display: "inline"}} direction="row" spacing={0.5}>
          <Typography variant="caption" sx={{fontWeight:"400", fontSize: "0.8125rem"}} >
             Last pushed
          </Typography>
          <Typography variant="caption" sx={{fontWeight:"600", fontSize: "0.8125rem"}} >
            {lastDate || '----'} by {vendors[0] || 'N/A'}
          </Typography>
        </Stack>

        <Typography sx={{color:"#1479FF", paddingTop: "1rem", fontSize: "0.8125rem", fontWeight: "600", cursor:'pointer'}} onClick={() => setOpen(!open)}>{!open? 'See digests' : 'Hide digests'}</Typography>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box>
            <Table size="small" padding="none" sx={{[`& .${tableCellClasses.root}`]: {borderBottom: "none"}}}>
              <TableHead>
                <TableRow>
                  <TableCell style={{color: "#696969"}}><Typography variant="body1">Digest</Typography></TableCell>
                  <TableCell style={{color: "#696969"}}><Typography variant="body1">OS/ARCH</Typography></TableCell>
                  <TableCell style={{color: "#696969"}}><Typography variant="body1">Size</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {row.Layers.map((layer) => (
                  <TableRow key={layer.Digest} onClick={() => {navigator.clipboard.writeText(layer.Digest)}}>
                    <TableCell style={{color: "#696969"}}><Typography variant="body1">{layer.Digest?.substr(0,12)}</Typography></TableCell>
                    <TableCell style={{color: "#696969"}}><Typography variant="body1">-----------</Typography></TableCell>
                    <TableCell component="th" scope="row" style={{color: "#696969"}}>
                      <Typography variant="body1">{transform.formatBytes(layer.Size)}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}

// TagCard.propTypes = {
//   row: PropTypes.shape({
//     Layers: PropTypes.arrayOf(
//       PropTypes.shape({
//         Digest: PropTypes.string.isRequired,
//         Size: PropTypes.string.isRequired,
//       }),
//     ).isRequired,
//     Tag: PropTypes.string.isRequired,
//   }).isRequired,
// };


const renderTags = (tags, lastUpdated, vendors) => {
  const cmp = tags && tags.map((tag, index) => {
      return (
          <TagCard key={tag.Tag} row={tag} lastUpdated={lastUpdated} vendors={vendors} />
      );
  });
  return cmp;
}


export default function Tags(props) {
  const classes = useStyles();
  const {data} = props;
  const {images, lastUpdated, vendors } = data;


  return (
    <Card className={classes.tagCard} data-testid='tags-container'>
      <CardContent className={classes.content}>
        <Typography variant="h4" gutterBottom component="div" align="left" style={{color: "rgba(0, 0, 0, 0.87)", fontSize: "1.5rem", fontWeight: "600"}}>Tags History</Typography>
        <Divider variant="fullWidth" sx={{margin:"5% 0% 5% 0%", background:"rgba(0, 0, 0, 0.38)", height:"0.00625rem", width:"100%"}}/>
        {renderTags(images, lastUpdated, vendors)}
      </CardContent>
    </Card>
  );
}
