import React, { useState, useRef, useEffect } from 'react';
import { useBillContext } from '../../Bill';
import TextInput from '~/components/input/TextInput';
import { Box, IconButton } from '@mui/material';
import { MdClose } from 'react-icons/md';

function SearchProduct() {
  const { setSearch } = useBillContext();
  const [searchText, setSearchText] = useState('');
  const timerRef = useRef();

  const handleClearSearchText = () => {
    setSearchText('');
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setSearch(searchText);
    }, 500);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);
  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <TextInput
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Tìm mã hoặc tên hàng"
        textFieldSx={{
          '& .MuiInputBase-root': {
            height: '38px',
            '& input': {
              height: '100%',
            },
          },
        }}
      />
      {!!searchText && (
        <IconButton
          size="small"
          sx={{
            position: 'absolute',
            top: '50%',
            right: '5px',
            transform: 'translateY(-50%)',
          }}
          onClick={handleClearSearchText}
        >
          <MdClose size={14} />
        </IconButton>
      )}
    </Box>
  );
}

export default SearchProduct;
