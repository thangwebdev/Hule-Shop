import React, { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import BarChart from '~/components/chart/BarChart';
import useApisContext from '~/hooks/hookContext/useApisContext';
import { groupBy } from '~/utils/helpers';

function DoanhSoToday() {
  const theme = useTheme();
  const { asyncReport } = useApisContext();
  const [data, setData] = useState();

  const getRevenueThisWeek = async () => {
    let tu_ngay = moment(
      new Date(moment().startOf('isoWeeks').toDate()).setHours(0, 0, 0, 0)
    );
    let den_ngay = moment(
      new Date(moment().endOf('isoWeeks').toDate()).setHours(0, 0, 0, 0)
    );

    const resp = await asyncReport({
      endpoint: 'pbl',
      data: { tu_ngay, den_ngay },
    });
    const dataGrouped = groupBy({
      data: resp || [],
      callbackMatch: (item) => `${item.ngay}/${item.thang}/${item.nam}`,
    });
    const result = [];
    dataGrouped.forEach((group) => {
      const res = group.reduce(
        (acc, item) => {
          return {
            time: `${item.ngay}/${item.thang}/${item.nam}`,
            doanh_thu: acc.doanh_thu + item.doanh_thu,
          };
        },
        {
          time: '',
          doanh_thu: 0,
        }
      );
      result.push(res);
    });
    setData(result);
  };

  const labels = useMemo(() => {
    if (data?.length > 0) {
      return (data || []).map((item) => item.time);
    } else {
      return [];
    }
  }, [data]);
  const dataChart = useMemo(() => {
    if (data?.length > 0) {
      return (data || []).map((item) => item.doanh_thu);
    } else {
      return [];
    }
  }, [data]);

  useEffect(() => {
    getRevenueThisWeek();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: '13px', fontWeight: 550, mb: '10px' }}>
        {data?.title}
      </Typography>
      <Box>
        <BarChart
          titleChart="Doanh thu tuần này"
          labels={labels}
          datasets={[
            {
              label: 'Doanh thu',
              data: dataChart,
              backgroundColor: theme.palette.primary.main,
            },
          ]}
        />
      </Box>
    </Paper>
  );
}

export default DoanhSoToday;
