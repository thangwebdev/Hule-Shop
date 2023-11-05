import React from 'react';
import AdminLayout from '~/components/layouts/AdminLayout';
import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ResultSellToday from './components/ResultSellToday';
import DoanhSoToday from './components/DoanhSoToday';
import useResponsive from '~/hooks/useResponsive';

function HomePage() {
  const matches = useResponsive({ matchKey: 'up', breakpoint: 'md' });

  return (
    <AdminLayout>
      <Grid
        container
        spacing="10px"
        sx={{
          padding: '10px 0',
          alignItems: 'stretch',
          height: matches ? 'calc(100vh - 50px - 42px)' : 'calc(100vh - 50px)',
        }}
      >
        <Grid
          className="hidden-scroll"
          item
          xs={12}
          md={9}
          sx={{ height: '100%', overflow: 'auto', paddingRight: '5px' }}
        >
          <LeftColumn>
            <ResultSellToday />
            <DoanhSoToday />
          </LeftColumn>
        </Grid>
        {!!matches && (
          <Grid item xs={0} md={3} sx={{ height: '100%' }}>
            <RightColumn>
              <Stack
                direction="row"
                sx={{
                  paddingBottom: '10px',
                  borderBottom: '1px solid #ededed',
                }}
              >
                <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                  Các hoạt động gần đây
                </Typography>
              </Stack>
              <Stack
                spacing={'10px'}
                className="custome-scrolly"
                sx={{
                  maxHeight: 'calc(100vh - 50px - 42px - 10px - 20px - 32px)',
                  overflow: 'auto',
                  padding: '5px 5px 5px 0',
                }}
              >
                <Typography
                  sx={{
                    textAlign: 'center',
                    fontSize: '13px',
                    fontStyle: 'italic',
                  }}
                >
                  Chưa có hoạt động
                </Typography>
              </Stack>
            </RightColumn>
          </Grid>
        )}
      </Grid>
    </AdminLayout>
  );
}

export default HomePage;

const LeftColumn = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  height: 'auto',
  paddingBottom: '2px',
}));

const RightColumn = styled(Paper)(() => ({
  width: '100%',
  padding: '10px 5px 10px 10px',
}));
