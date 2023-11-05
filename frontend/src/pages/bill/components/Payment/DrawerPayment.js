import { Box } from '@mui/material';
import React from 'react';
import DrawerBase from '~/components/drawer/DrawerBase';
import BoardPayment from './BoardPayment';

function DrawerPayment({ open, onClose = () => {} }) {
  return (
    <DrawerBase title="Thanh toán" open={open} onClose={onClose} zIndex={1}>
      <Box sx={{ width: '90vw', maxWidth: '500px', height: '100%' }}>
        <BoardPayment />
      </Box>
    </DrawerBase>
  );
}

export default DrawerPayment;
