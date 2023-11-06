import React, { useState, useEffect, useMemo } from 'react';
import { Avatar, Grid, Paper, Stack, Typography } from '@mui/material';
import BankIcon from '~/assets/img/iconbank.png';
import BillIcon from '~/assets/img/iconBill.png';
import BenefitIcon from '~/assets/img/benefits.png';
import { BsArrowDownShort, BsArrowUpShort } from 'react-icons/bs';
import useApisContext from '~/hooks/hookContext/useApisContext';
import moment from 'moment';
import { numeralCustom } from '~/utils/helpers';

function ResultSellToday() {
  const { asyncReport, asyncGetList } = useApisContext();

  const [pbls, setPbls] = useState({
    today: [],
    yesterday: [],
    servering: [],
  });

  const getDataReport = async () => {
    const today = moment(new Date().setHours(0, 0, 0, 0));
    const yesterday = today.clone().subtract(1, 'days');

    const req1 = asyncReport({
      endpoint: 'pbl',
      data: {
        tu_ngay: today.format('YYYY-MM-DD'),
        den_ngay: today.format('YYYY-MM-DD'),
      },
    });
    const req2 = asyncReport({
      endpoint: 'pbl',
      data: {
        tu_ngay: yesterday.format('YYYY-MM-DD'),
        den_ngay: yesterday.format('YYYY-MM-DD'),
      },
    });
    const reqServering = asyncGetList('pbl', { ma_trang_thai: 1 });
    Promise.all([req1, req2, reqServering]).then(
      ([resp1, resp2, respServering]) => {
        setPbls({
          today: resp1 || [],
          yesterday: resp2 || [],
          servering: respServering?.data || [],
        });
      }
    );
  };

  const revenues = useMemo(() => {
    const today = (pbls?.today || []).reduce((acc, item) => {
      return acc + item.doanh_thu;
    }, 0);
    const yesterday = (pbls?.yesterday || []).reduce((acc, item) => {
      return acc + item.doanh_thu;
    }, 0);
    const servering = (pbls?.servering || []).reduce((acc, item) => {
      return acc + item.doanh_thu;
    }, 0);
    const tySuat = Math.round((Math.abs(today - yesterday) / yesterday) * 100);
    return {
      today,
      yesterday,
      isIncrease: today >= yesterday ? true : false,
      tySuat,
      servering,
    };
  }, [pbls]);

  const benefits = useMemo(() => {
    const today = (pbls?.today || []).reduce((acc, item) => {
      return acc + item.loi_nhuan;
    }, 0);
    const yesterday = (pbls?.yesterday || []).reduce((acc, item) => {
      return acc + item.loi_nhuan;
    }, 0);
    const tySuat = Math.round((Math.abs(today - yesterday) / yesterday) * 100);
    return {
      today,
      yesterday,
      isIncrease: today >= yesterday ? true : false,
      tySuat,
    };
  }, [pbls]);

  useEffect(() => {
    getDataReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: '13px', fontWeight: 550, mb: '10px' }}>
        KẾT QUẢ BÁN HÀNG HÔM NAY
      </Typography>
      <Grid container spacing={2}>
        {/* Đơn bán */}
        <Grid item xs={12} sm={6} md={4}>
          <Stack
            sx={{
              width: '100%',
              backgroundColor: 'primary.fif',
              padding: '5px',
              borderRadius: '8px',
              height: '100%',
            }}
            direction="row"
            gap={2}
            alignItems="center"
          >
            <Avatar
              src={BankIcon}
              sx={{ width: 50, height: 50, borderRadius: 0 }}
            />
            <Stack>
              <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>
                {pbls?.today?.length || 0} đơn đã xong
              </Typography>
              <Stack direction="row" gap={1} alignItems="center">
                <Typography
                  sx={{
                    fontSize: '18px',
                    fontWeight: 550,
                    color: 'secondary.main',
                  }}
                >
                  {numeralCustom(revenues.today || 0).format()}
                </Typography>
                {revenues?.today > 0 && revenues?.yesterday > 0 && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap="2px"
                    sx={{
                      color: true ? 'primary.main' : 'thirdly.main',
                    }}
                  >
                    {revenues?.isIncrease ? (
                      <BsArrowUpShort
                        size={14}
                        style={{ color: 'currentcolor' }}
                      />
                    ) : (
                      <BsArrowDownShort
                        size={14}
                        style={{ color: 'currentcolor' }}
                      />
                    )}

                    <Typography sx={{ fontSize: '10px' }}>
                      {revenues?.tySuat || 0} %
                    </Typography>
                  </Stack>
                )}
              </Stack>
              <Typography sx={{ fontSize: '12px', color: 'gray' }}>
                Hôm qua {numeralCustom(revenues.yesterday || 0).format()}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        {/* Đơn đang phục vụ */}
        <Grid item xs={12} sm={6} md={4}>
          <Stack
            sx={{
              width: '100%',
              backgroundColor: 'secondary.fif',
              padding: '5px',
              borderRadius: '8px',
              height: '100%',
            }}
            direction="row"
            gap={2}
            alignItems="center"
          >
            <Avatar
              src={BillIcon}
              sx={{ width: 50, height: 50, borderRadius: 0 }}
            />
            <Stack>
              <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>
                {pbls?.servering?.length || 0} đơn đang phục vụ
              </Typography>
              <Stack direction="row" gap={1} alignItems="center">
                <Typography
                  sx={{
                    fontSize: '18px',
                    fontWeight: 550,
                    color: 'secondary.main',
                  }}
                >
                  {numeralCustom(revenues?.servering || 0).format()}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
        {/* Lợi nhuận */}
        <Grid item xs={12} sm={6} md={4}>
          <Stack
            sx={{
              width: '100%',
              backgroundColor: 'thirdly.fif',
              padding: '5px',
              borderRadius: '8px',
              height: '100%',
            }}
            direction="row"
            gap={2}
            alignItems="center"
          >
            <Avatar
              src={BenefitIcon}
              sx={{ width: 50, height: 50, borderRadius: 0 }}
            />
            <Stack>
              <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>
                Lợi nhuận
              </Typography>
              <Stack direction="row" gap={1} alignItems="center">
                <Typography
                  sx={{
                    fontSize: '18px',
                    fontWeight: 550,
                    color: 'secondary.main',
                  }}
                >
                  {numeralCustom(benefits?.today || 0).format()}
                </Typography>
                {benefits?.today > 0 && benefits?.yesterday > 0 && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap="2px"
                    sx={{ color: 'primary.main' }}
                  >
                    {benefits?.isIncrease ? (
                      <BsArrowUpShort
                        size={14}
                        style={{ color: 'currentcolor' }}
                      />
                    ) : (
                      <BsArrowDownShort
                        size={14}
                        style={{ color: 'currentcolor' }}
                      />
                    )}
                    <Typography sx={{ fontSize: '10px' }}>
                      {benefits?.tySuat || 0}%
                    </Typography>
                  </Stack>
                )}
              </Stack>
              <Typography sx={{ fontSize: '12px', color: 'gray' }}>
                Hôm qua {numeralCustom(benefits?.yesterday || 0).format()}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ResultSellToday;
