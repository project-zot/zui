import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@mui/styles';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Select,
  MenuItem,
  DialogActions,
  Button
} from '@mui/material';
import { sortByCriteria } from 'utilities/sortCriteria.js';

const useStyles = makeStyles(() => ({}));

function FilterDialog(props) {
  const { open, setOpen, sortValue, setSortValue, renderFilterCards } = props;

  const classes = useStyles();

  const handleSortChange = (event) => {
    setSortValue(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={handleClose} fullScreen>
      <DialogTitle>{t('filterDialog.filter')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('filterDialog.sortResults')}</DialogContentText>
        <FormControl sx={{ m: '1', width: '80%' }} className={`${classes.sortForm}`} size="small">
          <Select
            label={t('main.sort')}
            value={sortValue}
            onChange={handleSortChange}
            MenuProps={{ disableScrollLock: true }}
          >
            {Object.values(sortByCriteria).map((el) => (
              <MenuItem key={el.value} value={el.value}>
                {t(el.label)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {renderFilterCards()}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('filterDialog.confirm')}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default FilterDialog;
