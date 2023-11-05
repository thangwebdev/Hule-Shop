import React, { memo } from 'react';
import { Stack } from '@mui/material';
import FilterSearch from '../FilterSearch';
import { useState } from 'react';
import { useEffect } from 'react';
import FilterRadios from '../FilterRadios';

const productTypes = [
  {
    value: '',
    label: 'Tất cả',
  },
  {
    value: false,
    label: 'Là nguyên vật liệu',
  },
  {
    value: true,
    label: 'Là sản phẩm sản xuất',
  },
];

function FilterProduct({ setCondition, onFilterChange = (filter) => {} }) {
  const [filter, setFilter] = useState({
    vat_tu: '',
    type: productTypes[0].value,
  });

  useEffect(() => {
    const condition = {};

    if (filter.vat_tu) {
      condition.$or = [
        {
          ma_vt: {
            $regex: filter.vat_tu.split(' ').join('.*'),
            $options: 'i',
          },
        },
        {
          ten_vt: {
            $regex: filter.vat_tu.split(' ').join('.*'),
            $options: 'i',
          },
        },
        { $text: { $search: filter.vat_tu } },
      ];
    }
    if (filter.type !== '') {
      condition.la_sp_sx = filter.type;
    } else {
      delete filter.type;
    }
    setCondition(condition);
    onFilterChange(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <Stack sx={{ width: '100%' }} spacing="10px">
      <FilterSearch
        title="Mã, tên hàng hóa"
        onSearch={(value) => setFilter({ ...filter, vat_tu: value })}
      />
      <FilterRadios
        title="Loại hàng hóa"
        values={productTypes}
        defaultValue={filter.type}
        onChange={(newValue) => {
          setFilter({ ...filter, type: newValue });
        }}
      />
    </Stack>
  );
}

export default memo(FilterProduct);
