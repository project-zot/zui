import React, { useState } from 'react';

import { isNil, isNumber } from 'lodash';
import { DateTime } from 'luxon';
import { api, endpoints } from 'api';
import { host } from 'host';

import {
  Dialog,
  DialogContent,
  TextField,
  DialogTitle,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  gridWrapper: {
    paddingTop: '2rem',
    paddingBottom: '2rem'
  },
  apiKeyLabel: {
    paddingBottom: '1rem'
  },
  expirationDateContainer: {
    width: '100%'
  },
  expirationDateInput: {
    width: '100%'
  },
  expirationDateDisplay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

function ApiKeyDialog(props) {
  const { open, setOpen, onConfirm } = props;

  const [apiKeyLabel, setApiKeyLabel] = useState();
  const [expirationDateOffset, setExpirationDateOffset] = useState(30);
  const [selectedExpirationDate, setSelectedExpirationDate] = useState();

  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    api
      .post(`${host()}${endpoints.apiKeys}`, {
        label: apiKeyLabel,
        expirationDate: getExpirationDatetime().toISO()
      })
      .then((response) => {
        if (response.data) {
          onConfirm(response.data);
          setOpen(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleLabelChange = (e) => {
    const { value } = e.target;
    setApiKeyLabel(value);
  };

  const handleExpirationDateChange = (e) => {
    const { value } = e.target;
    setExpirationDateOffset(value);
  };

  const handleDatePickerChange = (newValue) => {
    setSelectedExpirationDate(newValue);
  };

  const getExpirationDatetime = () => {
    if (isNumber(expirationDateOffset)) {
      return DateTime.now().plus({ days: expirationDateOffset }).endOf('day');
    } else if (expirationDateOffset === 'custom') {
      return DateTime.fromISO(selectedExpirationDate);
    }
    return null;
  };

  const getExpirationDisplay = () => {
    const expDateTime = getExpirationDatetime();
    return `Expires on ${expDateTime.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}`;
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create Api Key</DialogTitle>
      <DialogContent className={classes.apiKeyForm}>
        <Grid container className={classes.gridWrapper}>
          <Grid item container className={classes.apiKeyLabel} xs={12}>
            <TextField
              autoFocus
              required
              id="apikeylabel"
              label="Label"
              fullWidth
              variant="outlined"
              onChange={handleLabelChange}
            />
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={5}>
              <FormControl className={classes.expirationDateContainer} size="small" required>
                <InputLabel disableAnimation>Expiration date</InputLabel>
                <Select
                  labelId="expirationDate"
                  id="expirationDate"
                  label="Expiration time"
                  onChange={handleExpirationDateChange}
                  value={expirationDateOffset}
                  className={classes.expirationDateInput}
                >
                  <MenuItem value={7}>7 days</MenuItem>
                  <MenuItem value={30}>30 days</MenuItem>
                  <MenuItem value={60}>60 days</MenuItem>
                  <MenuItem value={90}>90 days</MenuItem>
                  <MenuItem value="custom">custom</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item className={classes.expirationDateDisplay} xs={7}>
              {expirationDateOffset === 'custom' ? (
                <DatePicker
                  valueType="date"
                  slotProps={{ textField: { size: 'small' } }}
                  onChange={handleDatePickerChange}
                />
              ) : (
                <Typography>{getExpirationDisplay()}</Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={expirationDateOffset === 'custom' && isNil(selectedExpirationDate)}
        >
          Create
        </Button>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ApiKeyDialog;
