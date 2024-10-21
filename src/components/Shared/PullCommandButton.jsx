import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import makeStyles from '@mui/styles/makeStyles';
import { Grid, Button, FormControl, Menu, MenuItem, Box, Tab, InputBase, IconButton, ButtonBase } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { dockerPull, podmanPull, skopeoPull } from 'utilities/pullStrings';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const useStyles = makeStyles((theme) => ({
  copyStringSelect: {
    '& fieldset': {
      border: ' 0.0625rem solid #52637A'
    },
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '0.5rem',
    color: '#F6F7F9',
    fontFamily: 'Roboto',
    fontSize: '1rem',
    fontWeight: 600,
    textAlign: 'left',
    textTransform: 'none'
  },
  copyStringSelectOpened: {
    color: '#00000099',
    backgroundColor: '#FFFFFF'
  },
  pullStringBox: {
    width: '19.365rem',
    border: '0.0625rem solid rgba(0, 0, 0, 0.23)',
    borderRadius: '0.5rem',
    padding: '0rem 0rem',
    fontSize: '1rem'
  },
  pullStringBoxCopied: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#2EAE4E',
    padding: '0rem 1rem 0rem 1rem',
    fontFamily: 'Roboto',
    fontSize: '1rem',
    color: '#FFFFFF',
    border: '0.0625rem solid rgba(0, 0, 0, 0.23)',
    borderRadius: '0.5rem',
    height: '3.5rem',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#2EAE4E'
    }
  },
  selectedPullTab: {
    background: '#D83C0E',
    borderRadius: '1.5rem'
  },
  tabContent: {
    height: '100%'
  },
  tabBox: {
    padding: '0.5rem'
  },
  tabPanel: {
    height: '100%',
    paddingLeft: '0rem!important',
    [theme.breakpoints.down('md')]: {
      padding: '1.5rem 0'
    }
  },
  pullText: {
    width: '14.5rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  textEllipsis: {
    padding: '0rem 1rem'
  },
  selectIcon: {
    fill: '#F6F7F9'
  },
  selectIconOpened: {
    fill: '#00000099'
  },
  popper: {
    width: '100%',
    overflow: 'hidden',
    padding: '0rem',
    '&:hover': { backgroundColor: '#FFFFFF' },
    '&:focus': { backgroundColor: '#FFFFFF' },
    '&.Mui-focusVisible': {
      backgroundColor: '#FFFFFF!important'
    }
  },
  copyButtonContainer: {
    borderLeft: '0.0625rem solid rgba(0, 0, 0, 0.23)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  }
}));

function PullCommandButton(props) {
  const classes = useStyles();

  const { imageName } = props;

  const [anchor, setAnchor] = useState();
  const open = Boolean(anchor);
  const [pullString, setPullString] = useState(dockerPull(imageName));
  const [isCopied, setIsCopied] = useState(false);
  const [selectedPullTab, setSelectedPullTab] = useState(dockerPull(imageName));

  const mounted = useRef(false);

  const handleClick = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(pullString);
    setIsCopied(true);
    setAnchor(null);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const getButtonIcon = () => {
    if (open) {
      return <ExpandLessIcon className={classes.selectIconOpened} />;
    }
    return <ExpandMoreIcon className={classes.selectIcon} />;
  };

  const handlePullTabChange = (event, newValue) => {
    setSelectedPullTab(newValue);
    setPullString(newValue);
  };

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  });

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        if (mounted.current) {
          setIsCopied(false);
        }
      }, 2000);
    }
  }, [isCopied]);

  const { t } = useTranslation();

  return isCopied ? (
    <Button className={classes.pullStringBoxCopied} data-testid="successPulled-buton">
      {t('pullCommandButton.copiedPullCommand')}
      <CheckCircleIcon />
    </Button>
  ) : (
    <FormControl variant="outlined" sx={{ width: '100%', height: '3.5rem' }}>
      <ButtonBase
        onClick={handleClick}
        className={`${classes.copyStringSelect} ${open && classes.copyStringSelectOpened}`}
        disableRipple
      >
        {t('pullCommandButton.pull')} {imageName}
        {getButtonIcon()}
      </ButtonBase>
      <Menu
        anchorEl={anchor}
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { width: anchor?.offsetWidth || '24%' } }}
        disableScrollLock
        data-testid="pull-dropdown"
      >
        <MenuItem disableRipple className={classes.popper} data-testid="pull-menuItem">
          <TabContext value={selectedPullTab}>
            <Box>
              <TabList
                onChange={handlePullTabChange}
                TabIndicatorProps={{ className: classes.selectedPullTab }}
                sx={{ '& button.Mui-selected': { color: '#14191F', fontWeight: '600' } }}
              >
                <Tab value={dockerPull(imageName)} label="Docker" className={classes.tabContent} />
                <Tab value={podmanPull(imageName)} label="Podman" className={classes.tabContent} />
                <Tab value={skopeoPull(imageName)} label="Skopeo" className={classes.tabContent} />
              </TabList>
              <Grid container>
                <Grid item xs={12}>
                  <TabPanel value={dockerPull(imageName)} className={classes.tabPanel}>
                    <Box className={classes.tabBox}>
                      <Grid container item xs={12} className={classes.pullStringBox}>
                        <Grid item xs={10}>
                          <InputBase
                            classes={{ input: classes.pullText }}
                            onKeyDownCapture={(e) => e.preventDefault()}
                            className={classes.textEllipsis}
                            defaultValue={dockerPull(imageName)}
                          />
                        </Grid>
                        <Grid item xs={2} onClick={handleCopyClick} className={classes.copyButtonContainer}>
                          <IconButton aria-label="copy" data-testid="pullcopy-btn">
                            <ContentCopyIcon sx={{ fontSize: '1rem' }} />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  </TabPanel>
                  <TabPanel value={podmanPull(imageName)} className={classes.tabPanel}>
                    <Box className={classes.tabBox}>
                      <Grid container item xs={12} className={classes.pullStringBox}>
                        <Grid item xs={10}>
                          <InputBase
                            classes={{ input: classes.pullText }}
                            onKeyDownCapture={(e) => e.preventDefault()}
                            className={classes.textEllipsis}
                            defaultValue={podmanPull(imageName)}
                            data-testid="podman-input"
                          />
                        </Grid>
                        <Grid item xs={2} onClick={handleCopyClick} className={classes.copyButtonContainer}>
                          <IconButton aria-label="copy" data-testid="podmanPullcopy-btn">
                            <ContentCopyIcon sx={{ fontSize: '1rem' }} />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  </TabPanel>
                  <TabPanel value={skopeoPull(imageName)} className={classes.tabPanel}>
                    <Box className={classes.tabBox}>
                      <Grid container item xs={12} className={classes.pullStringBox}>
                        <Grid item xs={10}>
                          <InputBase
                            classes={{ input: classes.pullText }}
                            onKeyDownCapture={(e) => e.preventDefault()}
                            className={classes.textEllipsis}
                            defaultValue={skopeoPull(imageName)}
                          />
                        </Grid>
                        <Grid item xs={2} onClick={handleCopyClick} className={classes.copyButtonContainer}>
                          <IconButton aria-label="copy" data-testid="skopeoPullcopy-btn">
                            <ContentCopyIcon sx={{ fontSize: '1rem' }} />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  </TabPanel>
                </Grid>
              </Grid>
            </Box>
          </TabContext>
        </MenuItem>
      </Menu>
    </FormControl>
  );
}

export default PullCommandButton;
