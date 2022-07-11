// react global
import * as React from 'react';
import PropTypes from 'prop-types';

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
import { Card, CardContent, Divider } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  card: {
    marginBottom: 2,
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    background:"#FFFFFF",
    boxShadow:"0px 5px 10px rgba(131, 131, 131, 0.08)",
    borderRadius:"30px",
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
  const {data, row} = props;
  const tags = data && data.tags;
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  return (
    <Card className={classes.card} raised>
      <CardContent className={classes.content}>
        <Typography variant="body1" align="left" sx={{color:"#828282"}}>{row.Tag}</Typography>
        <Typography variant="caption">Last pushed {row.lastUpdated || '----'} by {row.vendor || '----'}</Typography>
        <Typography sx={{color:"#7C4DFF", cursor:'pointer'}} onClick={() => setOpen(!open)}>{!open? 'See layers' : 'Hide layers'}</Typography>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box>
            <Typography variant="h6" gutterBottom component="div">
              {
                // Layers
              }
            </Typography>
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

TagCard.propTypes = {
  row: PropTypes.shape({
    Layers: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        Digest: PropTypes.string.isRequired,
        Size: PropTypes.string.isRequired,
      }),
    ).isRequired,
    Tag: PropTypes.string.isRequired,
  }).isRequired,
};


const renderTags = (tags) => {
  const cmp = tags && tags.map((tag, index) => {
      return (
          <TagCard key={tag.Tag} row={tag} />
      );
  });
  return cmp;
}


export default function CollapsibleTable(props) {
  const classes = useStyles();
  const {data} = props;
  const {tags} = data;

  return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
        <Typography variant="h4" gutterBottom component="div" align="left" style={{color: "rgba(0, 0, 0, 0.87)"}}>Tags</Typography>
        <Divider variant="fullWidth" sx={{margin:"5% 0% 5% 0%", background:"rgba(0, 0, 0, 0.38)", height:"1px", width:"100%"}}/>
        {renderTags(tags)}
      </CardContent>
    </Card>
  );
}
