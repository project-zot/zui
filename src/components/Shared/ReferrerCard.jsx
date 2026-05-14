import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@mui/styles';
import { Card, CardContent, Stack, Tooltip, Typography, Collapse, Box, Grid } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';
import { useState } from 'react';

const useStyles = makeStyles(() => ({
  refCard: {
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
  cardText: {
    color: '#000000',
    fontSize: '1rem',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem',
    textOverflow: 'ellipsis'
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

export default function ReferrerCard(props) {
  const { artifactType, mediaType, size, digest, annotations } = props;
  const [digestDropdownOpen, setDigestDropdownOpen] = useState(false);
  const [annotationDropdownOpen, setAnnotationDropdownOpen] = useState(false);
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Card className={classes.card} raised>
      <CardContent className={classes.content}>
        <Typography variant="body1" align="left" className={classes.cardText}>
          {t('referrerCard.type')} {artifactType && `${artifactType}`}
        </Typography>
        <Typography variant="body1" align="left" className={classes.cardText}>
          {t('referrerCard.mediaType')} {mediaType && `${mediaType}`}
        </Typography>
        <Typography variant="body1" align="left" className={classes.cardText}>
          {t('referrerCard.size')} {size && `${size}`}
        </Typography>
        <Stack direction="row" onClick={() => setDigestDropdownOpen(!digestDropdownOpen)}>
          {!digestDropdownOpen ? (
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
            {t('main.digest')}
          </Typography>
        </Stack>
        <Collapse in={digestDropdownOpen} timeout="auto" unmountOnExit>
          <Box>
            <Grid container item xs={12} direction={'row'}>
              <Tooltip title={digest || ''} placement="top">
                <Typography variant="body1">{digest}</Typography>
              </Tooltip>
            </Grid>
          </Box>
        </Collapse>

        <Stack direction="row" onClick={() => setAnnotationDropdownOpen(!annotationDropdownOpen)}>
          {!annotationDropdownOpen ? (
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
            {t('referrerCard.annotations')}
          </Typography>
        </Stack>
        <Collapse in={annotationDropdownOpen} timeout="auto" unmountOnExit>
          <Box>
            <Grid container item xs={12} direction={'row'}>
              <ul>
                {annotations?.map((annotation) => (
                  <li key={annotation.key}>
                    <Typography variant="body1">{`${annotation?.key}: ${annotation?.value}`}</Typography>
                  </li>
                ))}
              </ul>
            </Grid>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
