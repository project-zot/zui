import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// utility
import { api, endpoints } from '../../api';

// components
import DeleteTagConfirmDialog from 'components/Shared/DeleteTagConfirmDialog';
import { host } from '../../host';

export default function DeleteTag(props) {
  const { repo, tag, onTagDelete } = props;
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteTag = (repo, tag) => {
    api
      .delete(`${host()}${endpoints.deleteImage(repo, tag)}`)
      .then((response) => {
        if (response && response.status == 202) {
          onTagDelete(tag);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onConfirm = () => {
    deleteTag(repo, tag);
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleClickOpen}>
        <DeleteIcon />
      </IconButton>
      <DeleteTagConfirmDialog
        onClose={handleClose}
        open={open}
        title={`Permanently delete image ${repo}:${tag}?`}
        onConfirm={onConfirm}
      />
    </React.Fragment>
  );
}
