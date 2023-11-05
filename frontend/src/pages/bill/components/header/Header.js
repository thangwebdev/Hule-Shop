import { Box, Paper, Stack } from '@mui/material';
import React, { memo } from 'react';
import ListBill from './ListBill';
import SearchProduct from './SearchProduct';
import useResponsive from '~/hooks/useResponsive';
import MobileProducts from './MobileProducts';

function Header() {
  const mdMatches = useResponsive({ matchKey: 'up', breakpoint: 'md' });

  return (
    <Paper
      direction="row"
      sx={{
        width: '100%',
        height: '50px',
        padding: '0 4px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Stack direction="row" alignItems="center">
        {mdMatches && (
          <Box sx={{ width: '300px' }}>
            <SearchProduct />
          </Box>
        )}
      </Stack>
      <ListBill />
      {mdMatches ? null : <MobileProducts />}
    </Paper>
  );
}

export default memo(Header);
