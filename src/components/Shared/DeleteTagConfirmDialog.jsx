import React from 'react';
import { useTranslation } from 'react-i18next';

// components
import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material';

export default function DeleteTagConfirmDialog(props) {
  const { onClose, open, title, onConfirm } = props;
  const { t } = useTranslation();

  return (
    <Dialog data-testid="delete-dialog" onClose={onClose} open={open} color="primary">
      <DialogTitle> {title} </DialogTitle>
      <DialogActions style={{ justifyContent: 'center' }}>
        <Button data-testid="cancel-delete" variant="contained" onClick={onClose} color="primary">
          {t('main.cancel')}
        </Button>
        <Button
          data-testid="confirm-delete"
          color="error"
          variant="contained"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {t('deleteTagConfirmDialog.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
