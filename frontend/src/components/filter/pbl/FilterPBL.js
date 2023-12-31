import { Stack } from '@mui/material';
import React from 'react';
import FilterSearch from '../FilterSearch';
import { useState } from 'react';
import { useEffect } from 'react';
import FilterTimeFromTo from '../FilterTimeFromTo';
import FilterSelectApi from '../FilterSelectApi';
import moment from 'moment';

function FilterPBL({ setCondition }) {
  const [filter, setFilter] = useState({
    pbl: '',
    vatTu: null,
    kenhBan: null,
    trangThai: null,
    timeFrom: '',
    timeTo: '',
  });

  useEffect(() => {
    const condition = {
      $or: [
        {
          ma_phieu: { $regex: filter.pbl.split(' ').join('.*'), $options: 'i' },
        },
        { $text: { $search: filter.pbl } },
      ],
    };
    if (filter.timeFrom || filter.timeTo) {
      let startDate, endDate;
      if (filter.timeFrom && filter.timeTo) {
        startDate = moment(
          new Date(filter.timeFrom).setHours(0, 0, 0, 0)
        ).format('YYYY-MM-DD');
        endDate = moment(new Date(filter.timeTo).setHours(0, 0, 0, 0)).format(
          'YYYY-MM-DD'
        );
        condition.ngay_ct = {
          $gte: startDate,
          $lte: endDate,
        };
      } else if (filter.timeFrom) {
        startDate = moment(
          new Date(filter.timeFrom).setHours(0, 0, 0, 0)
        ).format('YYYY-MM-DD');
        condition.ngay_ct = { $gte: startDate };
      } else if (filter.timeTo) {
        endDate = moment(new Date(filter.timeTo).setHours(0, 0, 0, 0)).format(
          'YYYY-MM-DD'
        );
        condition.ngay_ct = { $lte: endDate };
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
    if (filter.kenhBan) {
      condition.ma_kenh = filter.kenhBan.ma_kenh;
    }
    setCondition(condition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <Stack sx={{ width: '100%' }} spacing="10px">
      <FilterSearch
        title="Mã phiếu"
        onSearch={(value) => setFilter({ ...filter, pbl: value })}
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
        title="Kênh bán"
        apiCode="dmkb"
        value={
          filter.kenhBan
            ? {
                ma_kenh: filter.kenhBan.ma_kenh,
                ten_kenh: filter.kenhBan.ten_kenh,
              }
            : null
        }
        searchFileds={['ma_kenh', 'ten_kenh']}
        getOptionLabel={(option) => option.ten_kenh}
        onSelect={(value) => setFilter({ ...filter, kenhBan: value })}
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
        condition={{ ma_ct: 'pbl' }}
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

export default FilterPBL;
