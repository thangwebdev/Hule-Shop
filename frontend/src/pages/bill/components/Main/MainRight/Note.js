import React, { useState } from 'react';
import { Box, TextField } from '@mui/material';
import { useBillContext } from '~/pages/bill/Bill';
import { cloneDeep } from 'lodash';

function Note({ detail }) {
  const { pbhSelected, updatePbh } = useBillContext();
  const [note, setNote] = useState(detail.dien_giai || '');

  const handleUpdateNote = async () => {
    if (note === detail.dien_giai) {
      return;
    }
    const pbhClone = cloneDeep(pbhSelected);
    const index = pbhClone.details.findIndex(
      (item) => item.ma_vt === detail.ma_vt && item.ma_dvt === detail.ma_dvt
    );
    if (index >= 0) {
      pbhClone.details[index].dien_giai = note;
    }
    await updatePbh(pbhClone);
  };

  return (
    <Box>
      <TextField
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onBlur={handleUpdateNote}
        variant="filled"
        fullWidth
        InputProps={{ autoComplete: 'off' }}
        placeholder="Ghi chú..."
        sx={{
          backgroundColor: '#fff',
          '& .MuiInputBase-root': {
            height: '30px',
            '& input': {
              height: '100%',
            },
          },
          '& .MuiInputBase-input': { padding: '0 5px', fontSize: '12px' },
        }}
      />
    </Box>
  );
}

export default Note;
