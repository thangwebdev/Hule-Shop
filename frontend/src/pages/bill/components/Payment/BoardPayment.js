import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import TotalLine from '../Main/MainRight/TotalLine';
import { useBillContext } from '../../Bill';
import { TbFileInvoice } from 'react-icons/tb';
import { numeralCustom } from '~/utils/helpers';
import ModeChietKhau from '../Main/MainRight/ModeChietKhau';
import InputPrice from '../InputPrice';
import { cloneDeep } from 'lodash';
import { BiDollarCircle } from 'react-icons/bi';
import useResponsive from '~/hooks/useResponsive';
import SelectApiInput from '~/components/input/SelectApiInput';
import { dsDanhMuc } from '~/utils/data';

const currencies = [
  1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000,
];

function BoardPayment() {
  const smMatches = useResponsive({ matchKey: 'up', breakpoint: 'sm' });
  const { pbhSelected, numberProductDiscounted, handlePayment } =
    useBillContext();

  const [currentPbl, setCurrentPbl] = useState(pbhSelected);
  const [kenhBan, setKenhBan] = useState(() => {
    if (currentPbl.ma_kenh) {
      return { ma_kenh: currentPbl.ma_kenh, ten_kenh: currentPbl.ten_kenh };
    }
  });
  const [isPercent, setIsPercent] = useState(false);
  const [tienThu, setTienThu] = useState(currentPbl?.tien_thu || 0);
  const [giaTriChietKhau, setGiaTriChietKhau] = useState({
    ty_le_ck_hd: currentPbl?.ty_le_ck_hd || 0,
    tien_ck_hd: currentPbl?.tien_ck_hd || 0,
  });

  // handle gia tri chiet khau change
  const handleGiaTriChietKhauChange = (e) => {
    let value = numeralCustom(e.target.value).value();
    const tienHang = currentPbl?.t_tien_hang;
    if (isPercent) {
      if (value > 100) {
        value = 100;
      }
      const tienCk = (tienHang * value) / 100;
      setGiaTriChietKhau({
        ty_le_ck_hd: value,
        tien_ck_hd: Math.floor(tienCk),
      });
    } else {
      if (value > tienHang) {
        value = tienHang;
      }
      const tyLeCk = (value * 100) / tienHang;
      setGiaTriChietKhau({ ty_le_ck_hd: tyLeCk, tien_ck_hd: value });
    }
  };

  // compute tong thanh toan
  const computeTongThanhToan = (pbl) => {
    const {
      t_tien_hang,
      tien_ck_sp,
      tien_ck_hd,
      chi_phi_khac,
      tien_van_chuyen,
    } = pbl;
    const result =
      (t_tien_hang || 0) -
      (tien_ck_sp || 0) -
      (tien_ck_hd || 0) +
      (chi_phi_khac || 0) +
      (tien_van_chuyen || 0);
    return result;
  };

  // handleUpdateChietKhau
  const handleUpdateChietKhau = async () => {
    if (currentPbl?.ty_le_ck_hd !== giaTriChietKhau.ty_le_ck_hd) {
      const pbhClone = cloneDeep(currentPbl);
      pbhClone.ty_le_ck_hd = giaTriChietKhau.ty_le_ck_hd;
      pbhClone.tien_ck_hd = giaTriChietKhau.tien_ck_hd;

      pbhClone.t_tt = computeTongThanhToan(pbhClone);
      setCurrentPbl(pbhClone);
    }
  };
  // handle update tien thu
  const handleUpdateTienThu = async (tienThuMoi) => {
    const pbhClone = cloneDeep(currentPbl);
    if (tienThuMoi !== pbhClone.tien_thu) {
      pbhClone.tien_thu = tienThuMoi;
      pbhClone.tien_thoi = (pbhClone.tien_thu || 0) - (pbhClone.t_tt || 0);
      setCurrentPbl(pbhClone);
    }
  };

  return (
    <Stack
      justifyContent="space-between"
      sx={{ height: '100%', padding: '10px 0' }}
    >
      <Box
        className="hidden-scroll"
        sx={{
          width: '100%',
          height: 'calc(100% - 45px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          overflow: 'auto',
          paddingBottom: '10px',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <SelectApiInput
              label="Kênh bán"
              apiCode="dmkb"
              placeholder="Kênh bán hàng"
              searchFileds={['ma_kenh', 'ten_kenh']}
              getOptionLabel={(option) =>
                `${option.ten_kenh} (${option.ma_kenh})`
              }
              selectedValue={kenhBan ? kenhBan : null}
              value={kenhBan ? kenhBan : null}
              onSelect={(value) => {
                setKenhBan(value);
                const pbhClone = cloneDeep(currentPbl);
                pbhClone.ma_kenh = value?.ma_kenh || '';
                pbhClone.ten_kenh = value?.ten_kenh || '';
                setCurrentPbl(pbhClone);
              }}
              FormAdd={dsDanhMuc['dmkb'].Form}
            />
          </Grid>
        </Grid>
        <Stack spacing="5px">
          <Stack
            direction="row"
            alignItems="center"
            spacing="5px"
            sx={{ color: 'primary.main', marginBottom: '5px' }}
          >
            <TbFileInvoice size="16px" style={{ color: 'currentcolor' }} />
            <Typography
              sx={{ fontSize: '14px', fontWeight: 500, color: 'primary.main' }}
            >
              Tiền thanh toán
            </Typography>
          </Stack>
          <Stack spacing="8px">
            <TotalLine
              text="Tổng tiền hàng"
              length={currentPbl?.details?.length}
              total={numeralCustom(currentPbl?.t_tien_hang).format()}
            />
            <TotalLine
              text="Chiết khấu sản phẩm"
              length={numberProductDiscounted}
              total={numeralCustom(currentPbl?.tien_ck_sp).format()}
            />
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography sx={{ fontSize: '13px' }}>
                Chiết khấu hóa đơn:
              </Typography>
              <ModeChietKhau
                onChange={({ isPercent }) => {
                  setIsPercent(isPercent);
                }}
              />
              <InputPrice
                width="80px"
                style={{ fontSize: '13px' }}
                value={numeralCustom(
                  isPercent
                    ? giaTriChietKhau.ty_le_ck_hd
                    : giaTriChietKhau.tien_ck_hd
                ).format()}
                onChange={handleGiaTriChietKhauChange}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    handleUpdateChietKhau();
                  }
                }}
                onBlur={handleUpdateChietKhau}
                textAlign="right"
              />
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography sx={{ fontSize: '13px' }}>
                Tiên vận chuyển:
              </Typography>
              <InputPrice
                width="80px"
                style={{ fontSize: '13px' }}
                value={numeralCustom(currentPbl.tien_van_chuyen || 0).format()}
                onChange={(e) => {
                  const value = numeralCustom(e.target.value).value();
                  const pbhClone = cloneDeep(currentPbl);
                  pbhClone.tien_van_chuyen = value;
                  setCurrentPbl(pbhClone);
                }}
                onBlur={() => {
                  const pbhClone = cloneDeep(currentPbl);
                  pbhClone.t_tt = computeTongThanhToan(pbhClone);
                  setCurrentPbl(pbhClone);
                }}
                textAlign="right"
              />
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography sx={{ fontSize: '13px' }}>Chi phí khác:</Typography>
              <InputPrice
                width="80px"
                style={{ fontSize: '13px' }}
                value={numeralCustom(currentPbl.chi_phi_khac || 0).format()}
                onChange={(e) => {
                  const value = numeralCustom(e.target.value).value();
                  const pbhClone = cloneDeep(currentPbl);
                  pbhClone.chi_phi_khac = value;
                  setCurrentPbl(pbhClone);
                }}
                onBlur={() => {
                  const pbhClone = cloneDeep(currentPbl);
                  pbhClone.t_tt = computeTongThanhToan(pbhClone);
                  setCurrentPbl(pbhClone);
                }}
                textAlign="right"
              />
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography sx={{ fontSize: '13px' }}>Phí nền tảng:</Typography>
              <InputPrice
                width="80px"
                style={{ fontSize: '13px' }}
                value={numeralCustom(currentPbl.phi_nen_tang || 0).format()}
                onChange={(e) => {
                  const value = numeralCustom(e.target.value).value();
                  const pbhClone = cloneDeep(currentPbl);
                  pbhClone.phi_nen_tang = value;
                  setCurrentPbl(pbhClone);
                }}
                textAlign="right"
              />
            </Stack>
            <TotalLine
              text="Khách cần trả"
              total={numeralCustom(currentPbl?.t_tt).format()}
            />
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography sx={{ fontSize: '13px' }}>Tiền thu:</Typography>
              <InputPrice
                width="80px"
                style={{ fontSize: '13px' }}
                value={numeralCustom(tienThu).format()}
                onChange={(e) => {
                  setTienThu(numeralCustom(e.target.value).value());
                }}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    handleUpdateTienThu(tienThu);
                  }
                }}
                onBlur={() => handleUpdateTienThu(tienThu)}
                textAlign="right"
              />
            </Stack>
            {!!currentPbl?.tien_thu && (
              <TotalLine
                text="Phải trả lại"
                total={numeralCustom(currentPbl?.tien_thoi).format()}
              />
            )}
          </Stack>
        </Stack>
        <Stack spacing="5px">
          <Stack
            direction="row"
            alignItems="center"
            spacing="5px"
            sx={{ color: 'primary.main', marginBottom: '5px' }}
          >
            <BiDollarCircle size="16px" style={{ color: 'currentcolor' }} />
            <Typography
              sx={{ fontSize: '14px', fontWeight: 500, color: 'primary.main' }}
            >
              Mệnh giá
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" flexWrap="wrap" gap="8px">
            {currencies.map((currency) => (
              <Paper
                key={currency}
                component={IconButton}
                onClick={() => {
                  const tienThuMoi = tienThu + Number(currency);
                  setTienThu(tienThuMoi);
                  handleUpdateTienThu(tienThuMoi);
                }}
                sx={{
                  padding: '4px 8px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {numeralCustom(currency).format()}
              </Paper>
            ))}
            {!!currentPbl?.t_tt && (
              <Paper
                component={IconButton}
                onClick={() => {
                  const tienThuMoi = tienThu + Number(currentPbl?.t_tt);
                  setTienThu(tienThuMoi);
                  handleUpdateTienThu(tienThuMoi);
                }}
                sx={{
                  padding: '4px 8px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {numeralCustom(currentPbl?.t_tt).format()}
              </Paper>
            )}
          </Stack>
        </Stack>
      </Box>
      <Stack
        direction="row"
        alignItems="flex-end"
        justifyContent="flex-end"
        spacing="10px"
        sx={{
          height: '45px',
          borderTop: '1px dashed',
          borderColor: '#ccc',
        }}
      >
        <Button
          onClick={() => handlePayment(currentPbl)}
          sx={{
            width: smMatches ? '160px' : '50%',
            backgroundColor: 'primary.main',
            color: 'whitish.pureWhite',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'whitish.pureWhite',
            },
          }}
        >
          Thanh toán {smMatches ? '(F9)' : ''}
        </Button>
      </Stack>
    </Stack>
  );
}

export default BoardPayment;
