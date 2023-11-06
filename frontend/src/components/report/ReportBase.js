import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import useResponsive from '~/hooks/useResponsive';
import BarChart from '../chart/BarChart';
import TableDisplay from '../table/TableDisplay';
import FilterTimeFromTo from '../filter/FilterTimeFromTo';
import useApisContext from '~/hooks/hookContext/useApisContext';
import { cloneDeep } from 'lodash';

function ReportBase({ reportCode, report }) {
  const mdMatches = useResponsive({ matchKey: 'up', breakpoint: 'md' });
  const theme = useTheme();
  const { asyncReport } = useApisContext();

  const [loading, setLoading] = useState(false);
  const [concern, setConcern] = useState();
  const [data, setData] = useState([]);
  const [timeOption, setTimeOption] = useState();
  const [filter, setFilter] = useState({
    timeFrom: moment().startOf('isoWeeks').format('YYYY-MM-DD'),
    timeTo: moment().format('YYYY-MM-DD'),
  });
  const [isChart, setIsChart] = useState(false);

  // get report
  const getReport = async (condition) => {
    try {
      setLoading(true);
      const resp = await asyncReport({
        endpoint: concern?.api,
        data: condition,
      });
      const dataReport = concern?.convertData(resp, {
        tu_ngay: filter.timeFrom,
        den_ngay: filter.timeTo,
      });
      setData(dataReport);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const chartLabels = useMemo(() => {
    if (concern && data?.length > 0) {
      const dataForChart = cloneDeep(data);
      dataForChart.pop();
      return (dataForChart || []).map((item) => item[concern.labelField]);
    } else {
      return [];
    }
  }, [data, concern]);

  const dataChart = useMemo(() => {
    if (concern && data?.length > 0) {
      const dataForChart = cloneDeep(data);
      dataForChart.pop();
      return (dataForChart || []).map((item) => item[concern.chartField]);
    } else {
      return [];
    }
  }, [data, concern]);

  useEffect(() => {
    const condition = {};
    if (filter.timeFrom) {
      condition.tu_ngay = moment(
        new Date(filter.timeFrom).setHours(0, 0, 0, 0)
      ).format('YYYY-MM-DD');
    }
    if (filter.timeTo) {
      condition.den_ngay = moment(
        new Date(filter.timeTo).setHours(0, 0, 0, 0)
      ).format('YYYY-MM-DD');
    }

    if (concern?.api) {
      getReport(condition);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, report, concern]);

  const renderFilter = () => (
    <Box
      className="custome-scrolly"
      sx={{
        width: '100%',
        height: `calc(100vh - 50px - ${mdMatches ? '42px' : ''} - 20px)`,
        overflow: 'auto',
        padding: '1px',
      }}
    >
      <Stack spacing={1}>
        {report?.Filter && (
          <report.Filter setConcern={setConcern} timeOption={timeOption} />
        )}
        <FilterTimeFromTo
          showOptions
          defaultTimeFrom={filter.timeFrom}
          defaultTimeTo={filter.timeTo}
          title="Thời gian"
          onSearch={(time) => {
            setFilter({ ...filter, ...time });
          }}
          onOptionChange={setTimeOption}
        />
      </Stack>
    </Box>
  );

  return (
    <>
      <Box sx={{ padding: '10px 0' }}>
        <Grid container spacing="10px" alignItems="flex-start">
          {mdMatches && (
            <Grid item md={2.5}>
              {renderFilter()}
            </Grid>
          )}
          <Grid item xs={12} md={9.5}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                sx={{ fontSize: '20px', fontWeight: 500, marginBottom: '10px' }}
              >
                {report?.title} {concern?.title}
              </Typography>
              {concern?.showChart && (
                <Stack direction="row" alignItems="center">
                  <Switch
                    size="small"
                    checked={isChart}
                    onChange={(e) => {
                      setIsChart(e.target.checked);
                    }}
                  />
                  <Typography sx={{ fontSize: '13px' }}>
                    {isChart ? 'Dạng biểu đồ' : 'Dạng bảng'}
                  </Typography>
                </Stack>
              )}
            </Stack>
            <Box
              className="hidden-scroll"
              sx={{
                height: `calc(100vh - 50px - 42px - 20px - 40px ${
                  !mdMatches ? '- 50px' : '- 0px'
                })`,
                overflow: 'auto',
              }}
            >
              <>
                {loading ? (
                  <Stack
                    sx={{ width: '100%' }}
                    direction="row"
                    justifyContent="center"
                  >
                    <CircularProgress />
                  </Stack>
                ) : (
                  <>
                    {isChart && concern?.showChart ? (
                      <BarChart
                        titleChart={`${report?.title} ${concern?.title}`}
                        labels={chartLabels}
                        datasets={[
                          {
                            label: report?.label,
                            backgroundColor: theme.palette.primary.main,
                            data: dataChart,
                          },
                        ]}
                      />
                    ) : (
                      <TableDisplay
                        columns={concern?.columns || []}
                        data={data || []}
                        fixedHeaderScrollHeight={`calc(100vh - 50px - 42px - 20px - 40px ${
                          !mdMatches ? '- 50px' : '- 0px'
                        })`}
                      />
                    )}
                  </>
                )}
              </>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default ReportBase;
