import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Collapse, Grid, Stack, Tooltip, Typography, Divider } from '@mui/material';
import { Markdown } from 'utilities/MarkdowntojsxWrapper';
import transform from 'utilities/transform';
import { DateTime } from 'luxon';
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';
import DeleteTag from 'components/Shared/DeleteTag';

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    background: '#FFFFFF',
    boxShadow: 'none',
    border: '1px solid #E0E5EB',
    borderRadius: '0.75rem',
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
  dropdownToggle: {
    color: '#1479FF',
    paddingTop: '1rem',
    fontSize: '0.8125rem',
    fontWeight: '600',
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
  },
  tagHeading: {
    color: '#828282',
    fontSize: '1rem',
    marginBottom: '0.5rem'
  },
  tagName: {
    color: '#1479FF',
    fontSize: '1rem',
    marginBottom: '0.5rem',
    textDecorationLine: 'underline',
    cursor: 'pointer'
  },
  cardDivider: {
    marginTop: '1rem',
    marginBottom: '1rem',
    border: '1px solid #E0E5EB'
  },
  manifsetsTable: {
    marginTop: '1rem'
  },
  tableHeaderText: {
    color: theme.palette.secondary.dark,
    fontSize: '1rem'
  }
}));

export default function TagCard(props) {
  const { repoName, tag, lastUpdated, vendor, manifests, repo, onTagDelete, isDeletable } = props;
  const [open, setOpen] = useState(false);

  const classes = useStyles();

  const lastDate = lastUpdated
    ? DateTime.fromISO(lastUpdated).toRelative({ unit: ['weeks', 'days', 'hours', 'minutes'] })
    : `Timestamp N/A`;
  const navigate = useNavigate();

  const goToTags = (digest = null) => {
    if (repoName) {
      navigate(`/image/${encodeURIComponent(repoName)}/tag/${tag}`, { state: { digest } });
    } else {
      navigate(`tag/${tag}`, { state: { digest } });
    }
  };

  return (
    <Card className={classes.card} raised>
      <CardContent className={classes.content}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Typography variant="body1" align="left" className={classes.tagHeading}>
            Tag
          </Typography>
          {isDeletable && <DeleteTag repo={repo} tag={tag} onTagDelete={onTagDelete} />}
        </Stack>
        <Typography variant="body1" align="left" className={classes.tagName} onClick={() => goToTags()}>
          {repoName && `${repoName}:`}
          {tag}
        </Typography>

        <Stack sx={{ display: 'inline' }} direction="row" spacing={0.5}>
          <Typography variant="caption" sx={{ fontWeight: '400', fontSize: '0.8125rem' }}>
            Created
          </Typography>
          <Tooltip title={lastUpdated?.slice(0, 16) || ' '} placement="top">
            <Typography variant="caption" sx={{ fontWeight: '600', fontSize: '0.8125rem' }}>
              {lastDate} by <Markdown options={{ forceInline: true }}>{vendor || 'Vendor not available'}</Markdown>
            </Typography>
          </Tooltip>
        </Stack>
        <Divider variant="fullWidth" className={classes.cardDivider} />
        <Stack direction="row" onClick={() => setOpen(!open)}>
          {!open ? (
            <KeyboardArrowRight className={classes.dropdownText} />
          ) : (
            <KeyboardArrowDown className={classes.dropdownText} />
          )}
          <Typography className={classes.dropdownToggle}>{!open ? `Show more` : `Show less`}</Typography>
        </Stack>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box className={classes.manifsetsTable}>
            <Grid container item xs={12} direction={'row'}>
              <Grid item xs={6} md={6}>
                <Typography variant="body1" className={classes.tableHeaderText}>
                  DIGEST
                </Typography>
              </Grid>
              <Grid item xs={6} md={3} className={classes.tableHeaderText}>
                <Typography variant="body1">OS/Arch</Typography>
              </Grid>
              <Grid
                item
                xs={0}
                md={3}
                className={`${classes.tableHeaderText} hide-on-mobile`}
                sx={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Typography variant="body1"> COMPRESSED SIZE </Typography>
              </Grid>
            </Grid>

            {manifests.map((el) => (
              <Grid container item xs={12} key={el.digest} direction={'row'}>
                <Grid item xs={6} md={6}>
                  <Tooltip title={el.digest || ''} placement="top">
                    <Typography
                      variant="body1"
                      sx={{ color: '#1479FF', textDecorationLine: 'underline', cursor: 'pointer' }}
                      onClick={() => goToTags(el.digest)}
                    >
                      {el.digest?.substr(0, 12)}
                    </Typography>
                  </Tooltip>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body1" color="primary">
                    {el.platform?.Os}/{el.platform?.Arch}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={0}
                  md={3}
                  className="hide-on-mobile"
                  sx={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <Typography sx={{ textAlign: 'right' }} variant="body1" color="primary">
                    {transform.formatBytes(el.size)}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
