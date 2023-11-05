import { CircularProgress, Stack } from '@mui/material';
import React, { useState, useEffect, useContext, useMemo } from 'react';
import BillLayout from '~/components/layouts/BillLayout';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import MainLayout from './components/Main/MainLayout';
import { createContext } from 'react';
import useSnackbarContext from '~/hooks/hookContext/useSnackbarContext';
import useApisContext from '~/hooks/hookContext/useApisContext';
import useLocalStorage from '~/hooks/useLocalStorage';
import { cloneDeep } from 'lodash';
import ModalBase from '~/components/modal/ModalBase';

const BillContext = createContext();

export const useBillContext = () => {
  const value = useContext(BillContext);
  if (!value) throw new Error('Bill context must be used inside Bill provider');
  return value;
};

function Bill() {
  const alertSnackbar = useSnackbarContext();
  const { asyncGetList, asyncPostData } = useApisContext();
  const [loading, setLoading] = useState(false);
  const [fullScreen, setFullScreen] = useState(() => {
    if (document.fullscreenElement) {
      return true;
    } else {
      return false;
    }
  });
  const [search, setSearch] = useState('');
  const [pbhs, setPbhs] = useState([]);
  const [pbhSelected, setPbhSelected] = useLocalStorage(
    'pbh_active',
    undefined
  );
  const [openPayment, setOpenPayment] = useState(false);

  // them vao detail
  const add = async ({ product, dvt, sl = 1, plus = true }) => {
    const pbhClone = cloneDeep(pbhSelected);
    const productSelected = pbhClone.details.find(
      (item) => item.ma_vt === product.ma_vt && item.ma_dvt === dvt.ma_dvt
    );
    if (productSelected) {
      if (plus) {
        productSelected.sl_xuat += sl;
      } else {
        productSelected.sl_xuat = sl;
      }
      if (productSelected.sl_xuat < 1) {
        productSelected.sl_xuat = 1;
      }
    } else {
      const newDetail = {
        ma_vt: product.ma_vt,
        ten_vt: product.ten_vt,
        ma_dvt: dvt.ma_dvt,
        ten_dvt: dvt.ten_dvt,
        sl_xuat: plus ? 1 : sl,
        don_gia: dvt.gia_ban,
        hinh_anh:
          product.hinh_anh1 || product.hinh_anh2 || product.hinh_anh3 || '',
      };
      if (newDetail.sl_xuat < 1) {
        newDetail.sl_xuat = 1;
      }
      pbhClone.details.push(newDetail);
    }
    return await updatePbh(pbhClone);
  };

  const deleteDetail = async (detail) => {
    const pbhSelectedClone = cloneDeep(pbhSelected);
    pbhSelectedClone.details = pbhSelectedClone.details.filter((item) => {
      if (item.ma_vt !== detail.ma_vt) {
        return true;
      } else {
        if (item.ma_dvt === detail.ma_dvt) {
          return false;
        } else {
          return true;
        }
      }
    });
    await updatePbh(pbhSelectedClone);
  };

  // tao phieu ban hang moi
  const createPbh = async () => {
    try {
      const pbhPost = {
        ma_trang_thai: 1,
        ten_trang_thai: 'Đang có khách',
        ngay_lap_phieu: new Date().setHours(0, 0, 0, 0),
        ngay_ct: new Date().setHours(0, 0, 0, 0),
        details: [],
      };
      const resp = await asyncPostData('pbl', pbhPost);
      setPbhSelected(resp);
      await getPbhs();
      return resp;
    } catch (error) {
      alertSnackbar('error', error?.message || 'Internal server error');
    }
  };
  // cap nhat phieu ban hang
  const updatePbh = async (newPbh) => {
    try {
      const pbhClone = cloneDeep(newPbh);
      const tienHang = pbhClone.details.reduce((acc, item) => {
        return acc + item.gia_ban_le * item.sl_xuat;
      }, 0);
      pbhClone.t_tien_hang = tienHang;
      setLoading(true);
      const resp = await asyncPostData('pbl', pbhClone, 'put');
      await getPbhs();
      return resp;
    } catch (error) {
      alertSnackbar('error', error?.message || 'Internal server error');
    } finally {
      setLoading(false);
    }
  };

  // handle payment
  const handlePayment = async (pbl) => {
    let error = false;
    if (pbl?.tien_thu < pbl?.t_tt) {
      error = true;
      alertSnackbar('error', 'Số tiền nhận chưa đủ');
      return;
    }
    if (!error) {
      const pbhClone = cloneDeep(pbl);
      pbhClone.ngay_ct = new Date().setHours(0, 0, 0, 0);
      pbhClone.ma_trang_thai = 2;
      await updatePbh(pbhClone);
      setOpenPayment(false);
      alertSnackbar('success', 'Thanh toán thành công');
    } else {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  // get pbh
  const getPbhs = async () => {
    try {
      setLoading(true);
      const condition = { ma_trang_thai: 1 };
      const resp = await asyncGetList('pbl', condition);
      if (resp && resp.data?.length === 0) {
        await createPbh();
      } else {
        setPbhs(resp.data);
      }
    } catch (error) {
      alertSnackbar('error', error?.message || 'Internal server error');
    } finally {
      setLoading(false);
    }
  };

  // number product discounted
  const numberProductDiscounted = useMemo(() => {
    if (pbhSelected) {
      return pbhSelected?.details?.reduce((acc, item) => {
        if (item.tien_ck > 0) {
          return acc + 1;
        } else {
          return acc;
        }
      }, 0);
    } else {
      return null;
    }
  }, [pbhSelected]);

  useEffect(() => {
    if (pbhs.length > 0) {
      if (pbhSelected) {
        const pbhExisted = pbhs.find(
          (pbh) => pbh.ma_phieu === pbhSelected?.ma_phieu
        );
        if (!pbhExisted) {
          setPbhSelected(pbhs[0]);
        } else {
          setPbhSelected(pbhExisted);
        }
      } else {
        setPbhSelected(pbhs[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pbhs]);

  useEffect(() => {
    getPbhs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, []);

  const providerState = {
    // value
    fullScreen,
    search,
    pbhs,
    pbhSelected,
    numberProductDiscounted,
    openPayment,
    // function
    setFullScreen,
    setSearch,
    setPbhs,
    setPbhSelected,
    createPbh,
    getPbhs,
    updatePbh,
    add,
    deleteDetail,
    handlePayment,
    setOpenPayment,
  };

  return (
    <BillLayout>
      <BillContext.Provider value={providerState}>
        <Stack
          spacing="5px"
          sx={{ width: '100%', height: 'calc(100vh - 50px)', padding: '5px 0' }}
        >
          <ModalBase
            open={loading}
            ghost
            hideCloseIcon
            slotProps={{
              backdrop: { style: { backgroundColor: 'transparent' } },
            }}
          >
            <Stack alignItems="center" justifyContent="center">
              <CircularProgress />
            </Stack>
          </ModalBase>
          <Header />
          <MainLayout />
          <Footer />
        </Stack>
      </BillContext.Provider>
    </BillLayout>
  );
}

export default Bill;
