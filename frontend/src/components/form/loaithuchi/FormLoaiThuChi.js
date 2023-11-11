import React, { useRef, useEffect } from 'react';
import { v4 } from 'uuid';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FiSave } from 'react-icons/fi';
import useApisContext from '~/hooks/hookContext/useApisContext';
import ModalBase from '~/components/modal/ModalBase';
import ButtonBase from '~/components/button/ButtonBase';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import TabsBase from '~/components/tabs/TabsBase';
import { TabPanel } from '@mui/lab';
import InfoTab from './InfoTab';
import DescriptionTab from './DescriptionTab';

export default function FormLoaiThuChi({
  open,
  handleClose,
  setLoad = () => {},
  defaultValues,
  isEdit = false,
}) {
  const schema = yup.object({
    loai_thu_chi: yup
      .object()
      .typeError('Vui lòng chọn loại thu chi')
      .required('Vui lòng chọn loại thu chi'),
    ngay_lap_phieu: yup
      .date()
      .typeError('Vui lòng chọn ngày lập phiếu')
      .required('Vui lòng chọn ngày lập phiếu'),
    ngay_ct: yup
      .date()
      .typeError('Vui lòng chọn ngay chứng từ')
      .required('Vui lòng chọn ngay chứng từ'),
  });
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
    register,
  } = useForm({
    mode: 'onBlur',
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          loai_thu_chi: defaultValues?.ma_loai_thu_chi
            ? {
                ma_loai: defaultValues.ma_loai_thu_chi,
                ten_loai: defaultValues.ten_loai_thu_chi,
              }
            : null,
          ngay_ct: moment(defaultValues.ngay_ct).format('YYYY-MM-DD'),
          ngay_lap_phieu: moment(defaultValues.ngay_lap_phieu).format(
            'YYYY-MM-DD'
          ),
        }
      : {
          ngay_ct: moment().format('YYYY-MM-DD'),
          ngay_lap_phieu: moment().format('YYYY-MM-DD'),
        },
    resolver: yupResolver(schema),
  });
  const { asyncPostData } = useApisContext();

  const generateDataPost = (values) => {
    const { loai_thu_chi, ngay_ct, ngay_lap_phieu, ...data } = values;
    const result = {
      ...data,
      ma_loai_thu_chi: loai_thu_chi?.ma_loai || '',
      ten_loai_thu_chi: loai_thu_chi?.ten_loai || '',
      ngay_ct: moment(new Date(ngay_ct).setHours(0, 0, 0, 0)).format(
        'YYYY-MM-DD'
      ),
      ngay_lap_phieu: moment(
        new Date(ngay_lap_phieu).setHours(0, 0, 0, 0)
      ).format('YYYY-MM-DD'),
    };
    return result;
  };
  const tabRef = useRef();

  const handleSave = async (values) => {
    const method = isEdit ? 'put' : 'post';
    const dataPost = generateDataPost(values);
    await asyncPostData('soquy', dataPost, method).then((resp) => {
      if (!resp.message) {
        handleClose();
        reset();
        setLoad((prev) => prev + 1);
      }
    });
  };

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
      title={`${isEdit ? 'Chỉnh sửa' : 'Tạo'} phiếu thu, chi`}
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
          { label: 'Diễn giải', value: '2' },
        ]}
        ref={tabRef}
      >
        <TabPanel value="1" sx={{ padding: '10px 0 0 0' }}>
          <InfoTab
            register={register}
            control={control}
            isEdit={isEdit}
            errors={errors}
          />
        </TabPanel>
        <TabPanel value="2" sx={{ padding: '10px 0 0 0' }}>
          <DescriptionTab register={register} />
        </TabPanel>
      </TabsBase>
    </ModalBase>
  );
}
