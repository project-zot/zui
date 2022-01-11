// react global
import * as React from 'react';
import PropTypes from 'prop-types';

// components
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


// takes raw # of bytes and decimal value to be returned;
// returns bytes with nearest human-readable unit
function formatBytes(bytes) {
    if (isNaN(bytes) || bytes === 0) {
        return 0;
    }

    const DATA_UNITS = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const k = 1000;

    const unitIdx = Math.floor(Math.log10(bytes) / 3); // log10(1000) = 3
    let value = bytes / Math.pow(k, unitIdx);

    // minimum 2 significant digits
    value = value < 10 ? value.toPrecision(2) : Math.round(value);

    return value + ' ' + DATA_UNITS[unitIdx];
}

function Row(props) {
  const {data, row} = props;
  const tags = data && data.tags;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell component="th" scope="row" style={{color: "#696969"}}>
          <IconButton
            aria-label="expand row"
            size="medium"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          {row.Tag}
        </TableCell>
        <TableCell />
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h7" gutterBottom component="div">
                {
                  // Layers
                }
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell style={{color: "#696969"}}>Size</TableCell>
                    <TableCell style={{color: "#696969"}}>Digest</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.Layers.map((layer) => (
                    <TableRow key={layer.Digest}>
                      <TableCell component="th" scope="row" style={{color: "#696969"}}>
                        {formatBytes(layer.Size)}
                      </TableCell>
                      <TableCell style={{color: "#696969"}}>{layer.Digest}</TableCell>
                      <TableCell style={{color: "#696969"}}>
                          <ContentCopyIcon sx={{height: 16, width: 16}} onClick={() => {navigator.clipboard.writeText(layer.Digest)}} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    Layers: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        Digest: PropTypes.string.isRequired,
        Size: PropTypes.string.isRequired,
      }),
    ).isRequired,
    Tag: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};


const renderTags = (tags) => {
  const cmp = tags && tags.map((tag, index) => {
      return (
          <Row key={tag.Tag} row={tag} />
      );
  });
  return cmp;
}


export default function CollapsibleTable(props) {
  const {data} = props;
  const {tags} = data;

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>  <Typography variant="h7" gutterBottom component="div" style={{color: "#696969"}}>Tags</Typography></TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {renderTags(tags)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
