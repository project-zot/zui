import React, { useState } from 'react';

import transform from 'utilities/transform';

import { Card, CardContent, Typography, Grid, Divider, Stack, Collapse } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  card: {
    marginBottom: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E0E5EB',
    borderRadius: '0.75rem',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%'
  },
  content: {
    textAlign: 'left',
    color: '#52637A',
    width: '100%',
    boxSizing: 'border-box',
    padding: '1rem',
    backgroundColor: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#FFFFFF'
    },
    '&:last-child': {
      paddingBottom: '1rem'
    }
  },
  layer: {
    fontSize: '1rem',
    fontWeight: '400',
    paddingRight: '0.5rem',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem',
    textAlign: 'left',
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    cursor: 'pointer'
  },
  values: {
    fontSize: '1rem',
    fontWeight: '400',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem',
    textAlign: 'right'
  },
  dropdownText: {
    color: '#1479FF',
    paddingTop: '1rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center'
  },
  dropdownButton: {
    color: '#1479FF',
    paddingTop: '1rem',
    fontSize: '0.8125rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  dropdownContentText: {
    color: '#52637A',
    textAlign: 'center'
  },
  dropdownContentBox: {
    boxSizing: 'border-box',
    color: '#52637A',
    fontSize: '1rem',
    fontWeight: '400',
    padding: '0.75rem',
    backgroundColor: '#F7F7F7',
    borderRadius: '0.9rem',
    overflowWrap: 'break-word'
  },
  layerCardDivider: {
    margin: '1rem 0'
  }
}));

function LayerCard(props) {
  const classes = useStyles();
  const { layer, historyDescription } = props;
  const [open, setOpen] = useState(false);

  const getLayerSize = () => {
    if (historyDescription.EmptyLayer) return 0;
    else return layer.Size;
  };

  return (
    <Card variant="outlined" className={classes.card}>
      <CardContent className={classes.content}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={10}>
            <Typography variant="body1" className={classes.layer}>
              {historyDescription.CreatedBy}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1" className={classes.values}>
              {transform.formatBytes(getLayerSize())}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider className={classes.layerCardDivider} />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" onClick={() => setOpen((prevOpenState) => !prevOpenState)}>
              {!open ? (
                <KeyboardArrowRight className={classes.dropdownText} />
              ) : (
                <KeyboardArrowDown className={classes.dropdownText} />
              )}
              <Typography className={classes.dropdownButton}>DETAILS</Typography>
            </Stack>
            <Collapse in={open} timeout="auto" unmountOnExit sx={{ marginTop: '1rem' }}>
              <Stack direction="column" spacing="1.2rem">
                <Typography variant="body1">Command</Typography>
                <Typography variant="body1" align="left" className={classes.dropdownContentBox}>
                  {historyDescription.CreatedBy}
                </Typography>
                {!historyDescription.EmptyLayer && (
                  <>
                    <Typography variant="body1">DIGEST</Typography>
                    <Typography variant="body1" align="left" className={classes.dropdownContentBox}>
                      {layer.Digest}
                    </Typography>
                  </>
                )}
              </Stack>
            </Collapse>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default LayerCard;
