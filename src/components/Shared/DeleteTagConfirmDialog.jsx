import React from 'react';

// components
import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material';

export default function DeleteTagConfirmDialog(props) {
  const { onClose, open, title, onConfirm } = props;

  return (
    <Dialog data-testid="delete-dialog" onClose={onClose} open={open} color="primary">
      <DialogTitle> {title} </DialogTitle>
      <DialogActions style={{ justifyContent: 'center' }}>
        <Button data-testid="cancel-delete" variant="contained" onClick={onClose} color="primary">
          Cancel
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
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
