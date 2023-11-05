import React, { useState } from 'react';
import ButtonBase from '../button/ButtonBase';
import { MdOutlineTimer } from 'react-icons/md';
import { HiSelector } from 'react-icons/hi';
import MenuBase from '../menu/MenuBase';
import { Box, Grid, MenuItem, Stack, Typography } from '@mui/material';

function TimeOptions({ grids, option, setOption }) {
  const [anchorMenu, setAnchorMenu] = useState();

  const handleCloseMenu = () => {
    setAnchorMenu(null);
  };

  return (
    <>
      <MenuBase
        anchorEl={anchorMenu}
        open={!!anchorMenu}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        handleClose={handleCloseMenu}
      >
        <Box sx={{ width: '90vw', maxWidth: '600px', padding: '10px' }}>
          <Grid container spacing="5px">
            {grids.map((grid) => (
              <Grid key={grid.title} item xs={2.4}>
                <Stack sx={{ width: '100%' }} spacing="5px" alignItems="center">
                  <Typography sx={{ fontSize: '13px', fontWeight: '550' }}>
                    {grid.title}
                  </Typography>
                  {grid.options.map((option) => (
                    <MenuItem
                      key={option.title}
                      sx={{
                        fontSize: '13px',
                        color: 'primary.main',
                        padding: '2px 4px',
                      }}
                      onClick={() => {
                        setOption(option);
                        handleCloseMenu();
                      }}
                    >
                      {option.title}
                    </MenuItem>
                  ))}
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Box>
      </MenuBase>
      <ButtonBase
        variant="outlined"
        startIcon={<MdOutlineTimer />}
        endIcon={<HiSelector />}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
        onClick={(e) => setAnchorMenu(e.currentTarget)}
      >
        {!!option ? option.title : 'Tùy chọn'}
      </ButtonBase>
    </>
  );
}

export default TimeOptions;
