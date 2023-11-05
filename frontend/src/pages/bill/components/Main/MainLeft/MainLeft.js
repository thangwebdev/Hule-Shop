import React from 'react';
import { Paper, Stack } from '@mui/material';
import ProductList from './ProductList';

function MainLeft() {
  return (
    <Stack sx={{ width: '100%', height: '100%' }}>
      <Paper
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <ProductList />
      </Paper>
    </Stack>
  );
}

export default MainLeft;
