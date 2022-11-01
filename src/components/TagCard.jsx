import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Collapse, Grid, Stack, Tooltip, Typography } from '@mui/material';
import { Markdown } from 'utilities/MarkdowntojsxWrapper';
import transform from 'utilities/transform';
import { DateTime } from 'luxon';
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';

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
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dropdownText: {
    color: '#1479FF',
    paddingTop: '1rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center'
  }
}));

export default function TagCard(props) {
  const { repoName, tag, lastUpdated, vendor, digest, size, platform } = props;

  //const tags = data && data.tags;
  const [open, setOpen] = useState(false);
  const classes = useStyles();

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
        <Stack direction="row" onClick={() => setOpen(!open)}>
          {!open ? (
            <KeyboardArrowRight className={classes.dropdownText} />
          ) : (
            <KeyboardArrowDown className={classes.dropdownText} />
          )}
          <Typography
            sx={{
              color: '#1479FF',
              paddingTop: '1rem',
              fontSize: '0.8125rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            DIGEST
          </Typography>
        </Stack>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box>
            <Grid container item xs={12} direction={'row'}>
              <Grid item xs={4}>
                <Typography variant="body1">DIGEST</Typography>
              </Grid>
              <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="body1">OS/Arch</Typography>
              </Grid>
              <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Typography variant="body1"> Size </Typography>
              </Grid>
            </Grid>
            <Grid container item xs={12} direction={'row'}>
              <Grid item xs={4}>
                <Tooltip title={digest || ''} placement="top">
                  <Typography variant="body1">{digest?.substr(0, 12)}</Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="body1">
                  {platform?.Os}/{platform?.Arch}
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Typography sx={{ textAlign: 'right' }} variant="body1">
                  {transform.formatBytes(size)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
