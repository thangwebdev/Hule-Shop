import { Stack } from '@mui/material';
import React from 'react';
import FilterSearch from '../FilterSearch';
import { useState } from 'react';
import { useEffect } from 'react';
import FilterTimeFromTo from '../FilterTimeFromTo';
import FilterSelectApi from '../FilterSelectApi';
import moment from 'moment';

function FilterPXK({ setCondition }) {
  const [filter, setFilter] = useState({
    pxk: '',
    vatTu: null,
    trangThai: null,
    timeFrom: '',
    timeTo: '',
  });

  useEffect(() => {
    const condition = {
      $or: [
        {
          ma_phieu: { $regex: filter.pxk.split(' ').join('.*'), $options: 'i' },
        },
        { $text: { $search: filter.pxk } },
      ],
    };
    if (filter.timeFrom || filter.timeTo) {
      if (filter.timeFrom && filter.timeTo) {
        condition.ngay_ct = {
          $gte: moment(filter.timeFrom),
          $lte: moment(filter.timeTo),
        };
      } else if (filter.timeFrom) {
        condition.ngay_ct = { $gte: moment(filter.timeFrom) };
      } else if (filter.timeTo) {
        condition.ngay_ct = { $lte: moment(filter.timeTo) };
      }
    }
    if (filter.vatTu) {
      condition.details = {
        $elemMatch: {
          ma_vt: filter.vatTu.ma_vt,
        },
      };
    }
    if (filter.trangThai) {
      condition.ma_trang_thai = filter.trangThai.ma_trang_thai;
    }
    setCondition(condition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <Stack sx={{ width: '100%' }} spacing="10px">
      <FilterSearch
        title="Mã phiếu"
        onSearch={(value) => setFilter({ ...filter, pxk: value })}
      />
      <FilterSelectApi
        title="Hàng hóa"
        apiCode="dmvt"
        value={
          filter.vatTu
            ? { ma_vt: filter.vatTu.ma_vt, ten_vt: filter.vatTu.ten_vt }
            : null
        }
        searchFileds={['ma_vt', 'ten_vt']}
        getOptionLabel={(option) => option.ten_vt}
        onSelect={(value) => setFilter({ ...filter, vatTu: value })}
      />
      <FilterSelectApi
        title="Trạng thái"
        apiCode="trangthai"
        value={
          filter.trangThai
            ? {
                ma_trang_thai: filter.trangThai.ma_trang_thai,
                ten_trang_thai: filter.trangThai.ten_trang_thai,
              }
            : null
        }
        searchFileds={['ma_trang_thai', 'ten_trang_thai']}
        condition={{ ma_ct: 'pxk' }}
        getOptionLabel={(option) => option.ten_trang_thai}
        onSelect={(value) => setFilter({ ...filter, trangThai: value })}
      />
      <FilterTimeFromTo
        title="Ngày chứng từ"
        onSearch={(time) => setFilter({ ...filter, ...time })}
      />
    </Stack>
  );
}

export default FilterPXK;
