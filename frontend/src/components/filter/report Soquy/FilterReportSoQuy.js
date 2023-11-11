import React, { useState, useEffect } from 'react';
import FilterRadios from '../FilterRadios';
import { numeralCustom } from '~/utils/helpers';
import { cloneDeep } from 'lodash';
import moment from 'moment';

const concerns = [
  {
    label: 'Thời gian',
    value: 'time',
  },
];
const timeConcerns = {
  days: {
    title: 'theo khoảng thời gian',
    api: 'soquy',
    columns: [
      {
        name: 'Thời gian',
        sortable: true,
        selector: (row) => row.time,
        width: '200px',
      },
      {
        name: 'Tồn đầu kỳ',
        sortable: true,
        selector: (row) => row.ton_dau_ky,
        format: (row) => numeralCustom(row.ton_dau_ky).format(),
        center: true,
      },
      {
        name: 'Thu trong kỳ',
        sortable: true,
        selector: (row) => row.thu_trong_ky,
        format: (row) => numeralCustom(row.thu_trong_ky).format(),
        center: true,
      },
      {
        name: 'Chi trong kỳ',
        sortable: true,
        selector: (row) => row.chi_trong_ky,
        format: (row) => numeralCustom(row.chi_trong_ky).format(),
        center: true,
      },
      {
        name: 'Tồn cuối kỳ',
        sortable: true,
        selector: (row) => row.ton_cuoi_ky,
        format: (row) => numeralCustom(row.ton_cuoi_ky).format(),
        right: true,
      },
    ],
    convertData(data, time) {
      let thuTrongKy = 0,
        chiTrongKy = 0;
      data.data.forEach((item) => {
        if (item.ma_loai_thu_chi === 1) {
          thuTrongKy += item.gia_tri;
        } else if (item.ma_loai_thu_chi === 2) {
          chiTrongKy += item.gia_tri;
        }
      });
      const result = [
        {
          time: `${moment(time.tu_ngay).format('DD/MM/YYYY')} đến ${moment(
            time.den_ngay
          ).format('DD/MM/YYYY')}`,
          ton_dau_ky: data.ton_dau_ky,
          thu_trong_ky: thuTrongKy,
          chi_trong_ky: chiTrongKy,
          ton_cuoi_ky: data.ton_dau_ky + (thuTrongKy - chiTrongKy),
        },
      ];
      return result;
    },
  },
  today: {
    title: 'hôm nay',
    api: 'soquy',
    columns: [
      {
        name: 'Thời gian',
        sortable: true,
        selector: (row) => row.time,
        width: '200px',
      },
      {
        name: 'Tồn đầu kỳ',
        sortable: true,
        selector: (row) => row.ton_dau_ky,
        format: (row) => numeralCustom(row.ton_dau_ky).format(),
        center: true,
      },
      {
        name: 'Thu trong kỳ',
        sortable: true,
        selector: (row) => row.thu_trong_ky,
        format: (row) => numeralCustom(row.thu_trong_ky).format(),
        center: true,
      },
      {
        name: 'Chi trong kỳ',
        sortable: true,
        selector: (row) => row.chi_trong_ky,
        format: (row) => numeralCustom(row.chi_trong_ky).format(),
        center: true,
      },
      {
        name: 'Tồn cuối kỳ',
        sortable: true,
        selector: (row) => row.ton_cuoi_ky,
        format: (row) => numeralCustom(row.ton_cuoi_ky).format(),
        right: true,
      },
    ],
    convertData(data, time) {
      let thuTrongKy = 0,
        chiTrongKy = 0;
      data.data.forEach((item) => {
        if (item.ma_loai_thu_chi === 1) {
          thuTrongKy += item.gia_tri;
        } else if (item.ma_loai_thu_chi === 2) {
          chiTrongKy += item.gia_tri;
        }
      });
      const result = [
        {
          time: `${moment(time.tu_ngay).format('DD/MM/YYYY')}`,
          ton_dau_ky: data.ton_dau_ky,
          thu_trong_ky: thuTrongKy,
          chi_trong_ky: chiTrongKy,
          ton_cuoi_ky: data.ton_dau_ky + (thuTrongKy - chiTrongKy),
        },
      ];
      return result;
    },
  },
  thisweek: {
    title: 'tuần này',
    api: 'soquy',
    columns: [
      {
        name: 'Thời gian',
        sortable: true,
        selector: (row) => row.time,
        width: '200px',
      },
      {
        name: 'Tồn đầu kỳ',
        sortable: true,
        selector: (row) => row.ton_dau_ky,
        format: (row) => numeralCustom(row.ton_dau_ky).format(),
        center: true,
      },
      {
        name: 'Thu trong kỳ',
        sortable: true,
        selector: (row) => row.thu_trong_ky,
        format: (row) => numeralCustom(row.thu_trong_ky).format(),
        center: true,
      },
      {
        name: 'Chi trong kỳ',
        sortable: true,
        selector: (row) => row.chi_trong_ky,
        format: (row) => numeralCustom(row.chi_trong_ky).format(),
        center: true,
      },
      {
        name: 'Tồn cuối kỳ',
        sortable: true,
        selector: (row) => row.ton_cuoi_ky,
        format: (row) => numeralCustom(row.ton_cuoi_ky).format(),
        right: true,
      },
    ],
    convertData(data, time) {
      let thuTrongKy = 0,
        chiTrongKy = 0;
      data.data.forEach((item) => {
        if (item.ma_loai_thu_chi === 1) {
          thuTrongKy += item.gia_tri;
        } else if (item.ma_loai_thu_chi === 2) {
          chiTrongKy += item.gia_tri;
        }
      });
      const result = [
        {
          time: `${moment(time.tu_ngay).format('DD/MM/YYYY')} đến ${moment(
            time.den_ngay
          ).format('DD/MM/YYYY')}`,
          ton_dau_ky: data.ton_dau_ky,
          thu_trong_ky: thuTrongKy,
          chi_trong_ky: chiTrongKy,
          ton_cuoi_ky: data.ton_dau_ky + (thuTrongKy - chiTrongKy),
        },
      ];
      return result;
    },
  },
  thismonth: {
    title: 'tháng này',
    api: 'soquy',
    columns: [
      {
        name: 'Thời gian',
        sortable: true,
        selector: (row) => row.time,
        width: '200px',
      },
      {
        name: 'Tồn đầu kỳ',
        sortable: true,
        selector: (row) => row.ton_dau_ky,
        format: (row) => numeralCustom(row.ton_dau_ky).format(),
        center: true,
      },
      {
        name: 'Thu trong kỳ',
        sortable: true,
        selector: (row) => row.thu_trong_ky,
        format: (row) => numeralCustom(row.thu_trong_ky).format(),
        center: true,
      },
      {
        name: 'Chi trong kỳ',
        sortable: true,
        selector: (row) => row.chi_trong_ky,
        format: (row) => numeralCustom(row.chi_trong_ky).format(),
        center: true,
      },
      {
        name: 'Tồn cuối kỳ',
        sortable: true,
        selector: (row) => row.ton_cuoi_ky,
        format: (row) => numeralCustom(row.ton_cuoi_ky).format(),
        right: true,
      },
    ],
    convertData(data, time) {
      let thuTrongKy = 0,
        chiTrongKy = 0;
      data.data.forEach((item) => {
        if (item.ma_loai_thu_chi === 1) {
          thuTrongKy += item.gia_tri;
        } else if (item.ma_loai_thu_chi === 2) {
          chiTrongKy += item.gia_tri;
        }
      });
      const result = [
        {
          time: `Tháng ${moment(time.tu_ngay).format('MM/YYYY')}`,
          ton_dau_ky: data.ton_dau_ky,
          thu_trong_ky: thuTrongKy,
          chi_trong_ky: chiTrongKy,
          ton_cuoi_ky: data.ton_dau_ky + (thuTrongKy - chiTrongKy),
        },
      ];
      return result;
    },
  },
  '30daysago': {
    title: '30 ngày qua',
    api: 'soquy',
    columns: [
      {
        name: 'Thời gian',
        sortable: true,
        selector: (row) => row.time,
        width: '200px',
      },
      {
        name: 'Tồn đầu kỳ',
        sortable: true,
        selector: (row) => row.ton_dau_ky,
        format: (row) => numeralCustom(row.ton_dau_ky).format(),
        center: true,
      },
      {
        name: 'Thu trong kỳ',
        sortable: true,
        selector: (row) => row.thu_trong_ky,
        format: (row) => numeralCustom(row.thu_trong_ky).format(),
        center: true,
      },
      {
        name: 'Chi trong kỳ',
        sortable: true,
        selector: (row) => row.chi_trong_ky,
        format: (row) => numeralCustom(row.chi_trong_ky).format(),
        center: true,
      },
      {
        name: 'Tồn cuối kỳ',
        sortable: true,
        selector: (row) => row.ton_cuoi_ky,
        format: (row) => numeralCustom(row.ton_cuoi_ky).format(),
        right: true,
      },
    ],
    convertData(data, time) {
      let thuTrongKy = 0,
        chiTrongKy = 0;
      data.data.forEach((item) => {
        if (item.ma_loai_thu_chi === 1) {
          thuTrongKy += item.gia_tri;
        } else if (item.ma_loai_thu_chi === 2) {
          chiTrongKy += item.gia_tri;
        }
      });
      const result = [
        {
          time: `${moment(time.tu_ngay).format('DD/MM/YYYY')} đến ${moment(
            time.den_ngay
          ).format('DD/MM/YYYY')}`,
          ton_dau_ky: data.ton_dau_ky,
          thu_trong_ky: thuTrongKy,
          chi_trong_ky: chiTrongKy,
          ton_cuoi_ky: data.ton_dau_ky + (thuTrongKy - chiTrongKy),
        },
      ];
      return result;
    },
  },
  thisquarter: {
    title: 'quý này',
    api: 'soquy',
    columns: [
      {
        name: 'Thời gian',
        sortable: true,
        selector: (row) => row.time,
        width: '200px',
      },
      {
        name: 'Tồn đầu kỳ',
        sortable: true,
        selector: (row) => row.ton_dau_ky,
        format: (row) => numeralCustom(row.ton_dau_ky).format(),
        center: true,
      },
      {
        name: 'Thu trong kỳ',
        sortable: true,
        selector: (row) => row.thu_trong_ky,
        format: (row) => numeralCustom(row.thu_trong_ky).format(),
        center: true,
      },
      {
        name: 'Chi trong kỳ',
        sortable: true,
        selector: (row) => row.chi_trong_ky,
        format: (row) => numeralCustom(row.chi_trong_ky).format(),
        center: true,
      },
      {
        name: 'Tồn cuối kỳ',
        sortable: true,
        selector: (row) => row.ton_cuoi_ky,
        format: (row) => numeralCustom(row.ton_cuoi_ky).format(),
        right: true,
      },
    ],
    convertData(data, time) {
      let thuTrongKy = 0,
        chiTrongKy = 0;
      data.data.forEach((item) => {
        if (item.ma_loai_thu_chi === 1) {
          thuTrongKy += item.gia_tri;
        } else if (item.ma_loai_thu_chi === 2) {
          chiTrongKy += item.gia_tri;
        }
      });
      const result = [
        {
          time: `Quý ${moment(time.tu_ngay).quarter()}/${moment(
            time.tu_ngay
          ).year()}`,
          ton_dau_ky: data.ton_dau_ky,
          thu_trong_ky: thuTrongKy,
          chi_trong_ky: chiTrongKy,
          ton_cuoi_ky: data.ton_dau_ky + (thuTrongKy - chiTrongKy),
        },
      ];
      return result;
    },
  },
  thisyear: {
    title: 'năm nay',
    api: 'soquy',
    columns: [
      {
        name: 'Thời gian',
        sortable: true,
        selector: (row) => row.time,
        width: '200px',
      },
      {
        name: 'Tồn đầu kỳ',
        sortable: true,
        selector: (row) => row.ton_dau_ky,
        format: (row) => numeralCustom(row.ton_dau_ky).format(),
        center: true,
      },
      {
        name: 'Thu trong kỳ',
        sortable: true,
        selector: (row) => row.thu_trong_ky,
        format: (row) => numeralCustom(row.thu_trong_ky).format(),
        center: true,
      },
      {
        name: 'Chi trong kỳ',
        sortable: true,
        selector: (row) => row.chi_trong_ky,
        format: (row) => numeralCustom(row.chi_trong_ky).format(),
        center: true,
      },
      {
        name: 'Tồn cuối kỳ',
        sortable: true,
        selector: (row) => row.ton_cuoi_ky,
        format: (row) => numeralCustom(row.ton_cuoi_ky).format(),
        right: true,
      },
    ],
    convertData(data, time) {
      let thuTrongKy = 0,
        chiTrongKy = 0;
      data.data.forEach((item) => {
        if (item.ma_loai_thu_chi === 1) {
          thuTrongKy += item.gia_tri;
        } else if (item.ma_loai_thu_chi === 2) {
          chiTrongKy += item.gia_tri;
        }
      });
      const result = [
        {
          time: `Năm ${moment(time.tu_ngay).year()}`,
          ton_dau_ky: data.ton_dau_ky,
          thu_trong_ky: thuTrongKy,
          chi_trong_ky: chiTrongKy,
          ton_cuoi_ky: data.ton_dau_ky + (thuTrongKy - chiTrongKy),
        },
      ];
      return result;
    },
  },
};
timeConcerns.yesterday = cloneDeep(timeConcerns.today);
timeConcerns.yesterday.title = 'hôm qua';

timeConcerns.lastweek = cloneDeep(timeConcerns.thisweek);
timeConcerns.lastweek.title = 'tuần trước';

timeConcerns['7daysago'] = cloneDeep(timeConcerns.thisweek);
timeConcerns['7daysago'].title = '7 ngày qua';

timeConcerns.lastmonth = cloneDeep(timeConcerns.thismonth);
timeConcerns.lastmonth.title = 'tháng trước';

timeConcerns.lastquarter = cloneDeep(timeConcerns.thisquarter);
timeConcerns.lastquarter.title = 'quý trước';

timeConcerns.lastyear = cloneDeep(timeConcerns.thisyear);
timeConcerns.lastyear.title = 'năm trước';

function FilterReportSoQuy({ setConcern, timeOption }) {
  const [valueConcern, setValueConcern] = useState(concerns[0].value);

  useEffect(() => {
    if (valueConcern === 'time') {
      if (timeOption) {
        setConcern(timeConcerns[timeOption.value]);
      } else {
        setConcern(timeConcerns.days);
      }
    } else {
      const newConcern = concerns.find((c) => c.value === valueConcern);
      setConcern(newConcern);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueConcern, timeOption]);

  return (
    <>
      <FilterRadios
        title="Mối quan tâm"
        values={concerns}
        defaultValue={concerns[0].value}
        onChange={setValueConcern}
      />
    </>
  );
}

export default FilterReportSoQuy;
