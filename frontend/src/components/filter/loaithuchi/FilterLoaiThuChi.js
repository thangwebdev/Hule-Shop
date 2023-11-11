import { Stack } from '@mui/material';
import React from 'react';
import FilterSearch from '../FilterSearch';
import { useState } from 'react';
import { useEffect } from 'react';
import FilterTimeFromTo from '../FilterTimeFromTo';
import FilterSelectApi from '../FilterSelectApi';

function FilterLoaiThuChi({ setCondition }) {
  const [filter, setFilter] = useState({
    ma_phieu: '',
    loaiThuChi: null,
    timeFrom: '',
    timeTo: '',
  });

  useEffect(() => {
    const condition = {
      $or: [
        {
          ma_phieu: {
            $regex: filter.ma_phieu.split(' ').join('.*'),
            $options: 'i',
          },
        },
        { $text: { $search: filter.ma_phieu } },
      ],
    };
    if (filter.timeFrom || filter.timeTo) {
      if (filter.timeFrom && filter.timeTo) {
        condition.ngay_ct = {
          $gte: filter.timeFrom,
          $lte: filter.timeTo,
        };
      } else if (filter.timeFrom) {
        condition.ngay_ct = { $gte: filter.timeFrom };
      } else if (filter.timeTo) {
        condition.ngay_ct = { $lte: filter.timeTo };
      }
    }
    if (filter.loaiThuChi) {
      condition.ma_loai_thu_chi = filter.loaiThuChi.ma_loai;
    }
    setCondition(condition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <Stack sx={{ width: '100%' }} spacing="10px">
      <FilterSearch
        title="Mã phiếu"
        onSearch={(value) => setFilter({ ...filter, ma_phieu: value })}
      />
      <FilterSelectApi
        title="Loại thu, chi"
        apiCode="loaithuchi"
        value={
          filter.loaiThuChi
            ? {
                ma_loai: filter.loaiThuChi.ma_loai,
                ten_loai: filter.loaiThuChi.ten_loai,
              }
            : null
        }
        searchFileds={['ma_loai', 'ten_loai']}
        getOptionLabel={(option) => option.ten_loai}
        onSelect={(value) => setFilter({ ...filter, loaiThuChi: value })}
      />
      <FilterTimeFromTo
        title="Ngày chứng từ"
        onSearch={(time) => setFilter({ ...filter, ...time })}
      />
    </Stack>
  );
}

export default FilterLoaiThuChi;
