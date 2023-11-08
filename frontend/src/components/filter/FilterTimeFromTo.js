import React, { useState, useEffect } from 'react';
import FilterBox from './FilterBox';
import TextInput from '../input/TextInput';
import { Stack } from '@mui/material';
import ButtonBase from '../button/ButtonBase';
import TimeOptions from '../input/TimeOptions';
import moment from 'moment';

const grids = [
  {
    title: 'Theo ngày',
    options: [
      {
        title: 'Hôm nay',
        value: 'today',
      },
      {
        title: 'Hôm qua',
        value: 'yesterday',
      },
    ],
  },
  {
    title: 'Theo tuần',
    options: [
      {
        title: 'Tuần này',
        value: 'thisweek',
      },
      {
        title: 'Tuần trước',
        value: 'lastweek',
      },
      {
        title: '7 ngày qua',
        value: '7daysago',
      },
    ],
  },
  {
    title: 'Theo tháng',
    options: [
      {
        title: 'Tháng này',
        value: 'thismonth',
      },
      {
        title: 'Tháng trước',
        value: 'lastmonth',
      },
      {
        title: '30 ngày qua',
        value: '30daysago',
      },
    ],
  },
  {
    title: 'Theo quý',
    options: [
      {
        title: 'Quý này',
        value: 'thisquarter',
      },
      {
        title: 'Quý trước',
        value: 'lastquarter',
      },
    ],
  },
  {
    title: 'Theo năm',
    options: [
      {
        title: 'Năm nay',
        value: 'thisyear',
      },
      {
        title: 'Năm trước',
        value: 'lastyear',
      },
    ],
  },
];

function FilterTimeFromTo({
  title,
  defaultTimeFrom,
  defaultTimeTo,
  showOptions = false,
  onSearch = () => {},
  onOptionChange = () => {},
}) {
  const [dot, setDot] = useState(false);
  const [option, setOption] = useState('');
  const [time, setTime] = useState({
    timeFrom: defaultTimeFrom || '',
    timeTo: defaultTimeTo || '',
  });

  const handleTimeChange = ({ target: { name, value } }) => {
    if (option) {
      setOption(undefined);
    }
    setTime({ ...time, [name]: value });
  };
  const handleFilterTime = (time, currentOption) => {
    onSearch(time);
    onOptionChange(currentOption);
    setDot(!!time.timeFrom || !!time.timeTo);
  };

  useEffect(() => {
    if (option) {
      moment.locale('vi');
      moment.updateLocale('vi', {
        week: {
          dow: 1,
        },
      });
      let timeFrom, timeTo;
      switch (option.value) {
        case 'today':
          timeFrom = timeTo = moment().format('YYYY-MM-DD');
          break;
        case 'yesterday':
          timeFrom = timeTo = moment().subtract(1, 'days').format('YYYY-MM-DD');
          break;
        case 'thisweek':
          timeFrom = moment().startOf('weeks').format('YYYY-MM-DD');
          timeTo = moment().endOf('weeks').format('YYYY-MM-DD');
          break;
        case 'lastweek':
          timeFrom = moment()
            .subtract(1, 'weeks')
            .startOf('weeks')
            .format('YYYY-MM-DD');
          timeTo = moment()
            .subtract(1, 'weeks')
            .endOf('weeks')
            .format('YYYY-MM-DD');
          break;
        case '7daysago':
          timeFrom = moment().subtract(7, 'days').format('YYYY-MM-DD');
          timeTo = moment().subtract(1, 'days').format('YYYY-MM-DD');
          break;
        case 'thismonth':
          timeFrom = moment().startOf('months').format('YYYY-MM-DD');
          timeTo = moment().format('YYYY-MM-DD');
          break;
        case 'lastmonth':
          timeFrom = moment()
            .subtract(1, 'months')
            .startOf('months')
            .format('YYYY-MM-DD');
          timeTo = moment()
            .subtract(1, 'months')
            .endOf('months')
            .format('YYYY-MM-DD');
          break;
        case '30daysago':
          timeFrom = moment().subtract(30, 'days').format('YYYY-MM-DD');
          timeTo = moment().subtract(1, 'days').format('YYYY-MM-DD');
          break;
        case 'thisquarter':
          timeFrom = moment().startOf('quarters').format('YYYY-MM-DD');
          timeTo = moment().endOf('quarters').format('YYYY-MM-DD');
          break;
        case 'lastquarter':
          timeFrom = moment()
            .subtract(1, 'quarters')
            .startOf('quarters')
            .format('YYYY-MM-DD');
          timeTo = moment()
            .subtract(1, 'quarters')
            .endOf('quarters')
            .format('YYYY-MM-DD');
          break;
        case 'thisyear':
          timeFrom = moment().startOf('years').format('YYYY-MM-DD');
          timeTo = moment().endOf('years').format('YYYY-MM-DD');
          break;
        case 'lastyear':
          timeFrom = moment()
            .subtract(1, 'years')
            .startOf('years')
            .format('YYYY-MM-DD');
          timeTo = moment()
            .subtract(1, 'years')
            .endOf('years')
            .format('YYYY-MM-DD');
          break;
        default:
          timeFrom = moment().startOf('months').format('YYYY-MM-DD');
          timeTo = moment().format('YYYY-MM-DD');
          break;
      }
      setTime({ timeFrom, timeTo });
      handleFilterTime({ timeFrom, timeTo }, option);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [option]);

  useEffect(() => {
    if (time.timeFrom || time.timeTo) {
      setDot(true);
    }
    onSearch(time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FilterBox title={title} dot={dot}>
      <Stack spacing="10px" sx={{ padding: '10px 0' }}>
        {showOptions && (
          <TimeOptions grids={grids} option={option} setOption={setOption} />
        )}
        <TextInput
          label="Từ ngày"
          type="date"
          name="timeFrom"
          value={time.timeFrom}
          onChange={handleTimeChange}
        />
        <TextInput
          label="Đến ngày"
          type="date"
          name="timeTo"
          value={time.timeTo}
          onChange={handleTimeChange}
        />
        <ButtonBase onClick={() => handleFilterTime(time)}>Lọc</ButtonBase>
      </Stack>
    </FilterBox>
  );
}

export default FilterTimeFromTo;
