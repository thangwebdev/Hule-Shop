import React, { useState } from 'react';
import {
  Box,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ChangeNumber from './ChangeNumber';
import Price from './Price';
import InputPrice from '../../InputPrice';
import { numeralCustom } from '~/utils/helpers';
import { BsTrash } from 'react-icons/bs';
import { LuPenSquare } from 'react-icons/lu';
import { useBillContext } from '~/pages/bill/Bill';
import Note from './Note';

function ProductLine({ data, stt = 1 }) {
  const { deleteDetail } = useBillContext();
  const [openNote, setOpenNote] = useState(!!data.dien_giai || false);

  return (
    <Paper
      sx={{
        padding: '5px 8px',
        '&:hover .btn-delete, &:hover .btn-note,': {
          visibility: 'unset',
        },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing="10px">
          <Typography sx={{ fontSize: '13px' }}>{stt}.</Typography>
          <Typography sx={{ fontSize: '13px' }}>
            {data?.ten_vt} - ({data?.ma_vt})
          </Typography>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing="5px"
        >
          <IconButton
            className="btn-delete"
            size="small"
            sx={{ visibility: 'hidden', color: 'error.main' }}
            onClick={() => deleteDetail(data)}
          >
            <BsTrash size="14px" />
          </IconButton>
          {data?.ten_dvt && (
            <Box
              sx={{
                padding: '5px 8px',
                borderRadius: '20px',
                backgroundColor: 'primary.opacity',
                fontSize: '12px',
                color: 'primary.main',
              }}
            >
              {data?.ten_dvt}
            </Box>
          )}
        </Stack>
      </Stack>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <IconButton
              className="btn-note"
              sx={{
                visibility: !!data?.dien_giai
                  ? ''
                  : !openNote
                  ? 'hidden'
                  : 'unset',
                color: !!data?.dien_giai ? 'primary.main' : '',
              }}
              onClick={() => setOpenNote(!openNote)}
            >
              <LuPenSquare size={12} />
            </IconButton>
            <Price detail={data} />
            <Box></Box>
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Stack direction="row" alignItems="center" justifyContent="center">
            <ChangeNumber detail={data} />
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Stack direction="row" alignItems="center" justifyContent="center">
            <Box>
              <InputPrice
                value={numeralCustom(data?.t_tien).format()}
                readOnly
                width="80px"
                textAlign="right"
              />
            </Box>
          </Stack>
        </Grid>
      </Grid>
      <Collapse in={openNote}>
        <Note detail={data} />
      </Collapse>
    </Paper>
  );
}

export default ProductLine;
