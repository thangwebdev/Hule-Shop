import React, { useEffect, useState, useRef } from 'react';
import { v4 } from 'uuid';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FiSave } from 'react-icons/fi';
import useApisContext from '~/hooks/hookContext/useApisContext';
import ModalBase from '~/components/modal/ModalBase';
import ButtonBase from '~/components/button/ButtonBase';
import moment from 'moment';
import TabsBase from '~/components/tabs/TabsBase';
import { TabPanel } from '@mui/lab';
import InfoTab from './InfoTab';
import { useForm } from 'react-hook-form';
import DetailsTab from './DetailsTab';
import DescriptionTab from './DescriptionTab';

export default function FormPBL({
  open,
  handleClose,
  setLoad = () => {},
  defaultValues,
  isEdit = false,
}) {
  const schema = yup.object({
    trang_thai: yup
      .object()
      .typeError('Vui lòng chọn trạng thái phiếu')
      .required('Vui lòng chọn trạng thái phiếu'),
    ngay_lap_phieu: yup
      .date()
      .typeError('Vui lòng ngày lập phiếu')
      .required('Vui lòng ngày lập phiếu'),
    ngay_ct: yup
      .date()
      .typeError('Vui lòng chọn ngày chứng từ')
      .required('Vui lòng chọn ngày chứng từ'),
  });
  const {
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitting },
    register,
  } = useForm({
    mode: 'onBlur',
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          kenh_ban: defaultValues.ma_kenh
            ? {
                ma_kenh: defaultValues?.ma_kenh,
                ten_kenh: defaultValues?.ten_kenh,
              }
            : null,
          trang_thai: defaultValues.ma_trang_thai
            ? {
                ma_trang_thai: defaultValues.ma_trang_thai,
                ten_trang_thai: defaultValues.ten_trang_thai,
              }
            : null,
          ngay_lap_phieu: moment(defaultValues.ngay_lap_phieu).format(
            'YYYY-MM-DD'
          ),
          ngay_ct: moment(defaultValues.ngay_ct).format('YYYY-MM-DD'),
        }
      : {
          ngay_lap_phieu: moment().format('YYYY-MM-DD'),
          ngay_ct: moment().format('YYYY-MM-DD'),
        },
    resolver: yupResolver(schema),
  });
  const { asyncPostData } = useApisContext();
  const [details, setDetails] = useState(defaultValues?.details || []);
  const tabRef = useRef();

  const generateDataPost = (values) => {
    const { kenh_ban, trang_thai, ngay_ct, ngay_lap_phieu, ...data } = values;
    const result = {
      ...data,
      ma_kenh: kenh_ban?.ma_kenh || '',
      ten_kenh: kenh_ban?.ten_kenh || '',
      ma_trang_thai: trang_thai?.ma_trang_thai,
      ten_trang_thai: trang_thai?.ten_trang_thai,
      color: trang_thai.color,
      ngay_ct: moment(new Date(ngay_ct).setHours(0, 0, 0, 0)).format(
        'YYYY-MM-DD'
      ),
      ngay_lap_phieu: moment(
        new Date(ngay_lap_phieu).setHours(0, 0, 0, 0)
      ).format('YYYY-MM-DD'),
      details: !isEdit
        ? details.map((item) => {
            delete item._id;
            return item;
          })
        : details,
    };
    return result;
  };

  const tienHang = watch('t_tien_hang');
  const tienVanChuyen = watch('tien_van_chuyen');
  const chiPhiKhac = watch('chi_phi_khac');
  const tienThu = watch('tien_thu');
  const tongThanhTien = watch('t_tt');
  const tyLeCkHoaDon = watch('ty_le_ck_hd');
  const tienCkHoaDon = watch('tien_ck_hd');
  const tongTienCk = watch('t_tien_ck');
  const tienCkSp = watch('tien_ck_sp');

  const handleSave = async (values) => {
    const method = isEdit ? 'put' : 'post';
    const dataPost = generateDataPost(values);
    await asyncPostData('pbl', dataPost, method).then((resp) => {
      if (!resp.message) {
        handleClose();
        reset();
        setLoad((prev) => prev + 1);
      }
    });
  };

  // set tien hang
  useEffect(() => {
    let tongTienHang = 0;
    let tienCkSp = 0;

    details.forEach((item) => {
      tongTienHang += item.tien_hang;
      tienCkSp += item.tien_ck || 0;
    });

    setValue('t_tien_hang', tongTienHang);
    setValue('tien_ck_sp', Math.floor(tienCkSp));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details]);

  useEffect(() => {
    setValue('t_tien_ck', (tienCkSp || 0) + (tienCkHoaDon || 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tienCkSp, tienCkHoaDon]);

  useEffect(() => {
    const tongThanhTien =
      (tienHang || 0) -
      (tongTienCk || 0) +
      (tienVanChuyen || 0) +
      (chiPhiKhac || 0);
    setValue('t_tt', tongThanhTien);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tienHang, tongTienCk]);

  // set tien ck hd
  useEffect(() => {
    if (tyLeCkHoaDon) {
      const tienCkHdNew = ((tienHang || 0) * tyLeCkHoaDon) / 100;
      setValue('tien_ck_hd', Math.floor(tienCkHdNew));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tienHang]);

  useEffect(() => {
    const tienThoi = (tienThu || 0) - (tongThanhTien || 0);
    setValue('tien_thoi', tienThoi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tongThanhTien, tienThu]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      tabRef.current?.handleChange(null, '1');
    }
  }, [errors]);

  return (
    <ModalBase
      open={open}
      handleClose={handleClose}
      width="900px"
      title={`${isEdit ? 'Chỉnh sửa' : 'Tạo'} phiếu bán lẻ`}
      actions={[
        <ButtonBase
          key={v4()}
          onClick={handleSubmit(handleSave)}
          loading={isSubmitting}
          startIcon={<FiSave style={{ fontSize: '16px' }} />}
        >
          Lưu
        </ButtonBase>,
        <ButtonBase key={v4()} variant="outlined" onClick={handleClose}>
          Hủy
        </ButtonBase>,
      ]}
    >
      <TabsBase
        tabLabels={[
          { label: 'Thông tin', value: '1' },
          { label: 'Chi tiết', value: '2' },
          { label: 'Diễn giải', value: '3' },
        ]}
        ref={tabRef}
      >
        <TabPanel value="1" sx={{ padding: '10px 0 0 0' }}>
          <InfoTab
            register={register}
            control={control}
            isEdit={isEdit}
            errors={errors}
            tienHang={tienHang}
            tongTienCk={tongTienCk}
            tienVanChuyen={tienVanChuyen}
            chiPhiKhac={chiPhiKhac}
            setValue={setValue}
          />
        </TabPanel>
        <TabPanel value="2" sx={{ padding: '10px 0 0 0' }}>
          <DetailsTab
            details={details}
            setDetails={setDetails}
            isEditMaster={isEdit}
            tienCkHoaDon={tienCkHoaDon}
          />
        </TabPanel>
        <TabPanel value="3" sx={{ padding: '10px 0 0 0' }}>
          <DescriptionTab register={register} />
        </TabPanel>
      </TabsBase>
    </ModalBase>
  );
}
