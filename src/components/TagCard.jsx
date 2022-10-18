import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Collapse,
  Stack,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { Markdown } from 'utilities/MarkdowntojsxWrapper';
import transform from 'utilities/transform';
import { DateTime } from 'luxon';

const useStyles = makeStyles(() => ({
  tagCard: {
    marginBottom: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    background: '#FFFFFF',
    boxShadow: 'none!important',
    borderRadius: '1.875rem',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%'
  },
  card: {
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    background: '#FFFFFF',
    boxShadow: '0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)',
    borderRadius: '1.875rem',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%'
  },
  content: {
    textAlign: 'left',
    color: '#606060',
    padding: '2% 3% 2% 3%',
    width: '100%'
  },
  clickCursor: {
    cursor: 'pointer'
  }
}));

export default function TagCard(props) {
  const { repoName, tag, lastUpdated, vendor, digest, size, platform } = props;

  //const tags = data && data.tags;
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  // @ts-ignore
  const lastDate = (lastUpdated ? DateTime.fromISO(lastUpdated) : DateTime.now().minus({ days: 1 })).toRelative({
    unit: ['weeks', 'days', 'hours', 'minutes']
  });
  const navigate = useNavigate();

  const goToTags = () => {
    if (repoName) {
      navigate(`/image/${encodeURIComponent(repoName)}/tag/${tag}`);
    } else {
      navigate(`tag/${tag}`);
    }
  };

  return (
    <Card className={classes.card} raised>
      <CardContent className={classes.content}>
        <Typography variant="body1" align="left" sx={{ color: '#828282', fontSize: '1rem', paddingBottom: '0.5rem' }}>
          Tag
        </Typography>
        <Typography
          variant="body1"
          align="left"
          sx={{ color: '#1479FF', fontSize: '1rem', textDecorationLine: 'underline', cursor: 'pointer' }}
          onClick={() => goToTags()}
        >
          {repoName && `${repoName}:`}
          {tag}
        </Typography>

        <Stack sx={{ display: 'inline' }} direction="row" spacing={0.5}>
          <Typography variant="caption" sx={{ fontWeight: '400', fontSize: '0.8125rem' }}>
            Pushed
          </Typography>
          <Tooltip title={lastUpdated?.slice(0, 16) || ' '} placement="top">
            <Typography variant="caption" sx={{ fontWeight: '600', fontSize: '0.8125rem' }}>
              {lastDate || 'Date not available'} by{' '}
              <Markdown options={{ forceInline: true }}>{vendor || 'Vendor not available'}</Markdown>
            </Typography>
          </Tooltip>
        </Stack>

        <Typography
          sx={{
            color: '#1479FF',
            paddingTop: '1rem',
            fontSize: '0.8125rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
          onClick={() => setOpen(!open)}
        >
          {!open ? 'See digest' : 'Hide digest'}
        </Typography>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box>
            <Table size="small" padding="none" sx={{ [`& .${tableCellClasses.root}`]: { borderBottom: 'none' } }}>
              <TableHead>
                <TableRow>
                  <TableCell style={{ color: '#696969' }}>
                    <Typography variant="body1">Digest</Typography>
                  </TableCell>
                  <TableCell style={{ color: '#696969' }}>
                    <Typography variant="body1">OS/ARCH</Typography>
                  </TableCell>
                  <TableCell style={{ color: '#696969' }}>
                    <Typography variant="body1">Size</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  key={digest}
                  onClick={() => {
                    navigator.clipboard.writeText(digest);
                  }}
                  className={classes.clickCursor}
                >
                  <TableCell style={{ color: '#696969' }}>
                    <Tooltip title={digest || ''} placement="right">
                      <Typography variant="body1">{digest?.substr(0, 12)}</Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell style={{ color: '#696969' }}>
                    <Typography variant="body1">
                      {platform?.Os}/{platform?.Arch}
                    </Typography>
                  </TableCell>
                  <TableCell component="th" scope="row" style={{ color: '#696969' }}>
                    <Typography variant="body1">{transform.formatBytes(size)}</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
