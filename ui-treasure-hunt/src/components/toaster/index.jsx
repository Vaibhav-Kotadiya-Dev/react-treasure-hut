import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const SuccessToast = ({ open, message, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000} // Toast disappears after 3 seconds
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SuccessToast;
