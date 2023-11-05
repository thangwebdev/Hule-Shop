import { Grid } from '@mui/material';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FiSave } from 'react-icons/fi';
import { v4 } from 'uuid';
import ButtonBase from '~/components/button/ButtonBase';
import SelectApiInput from '~/components/input/SelectApiInput';
import TextInput from '~/components/input/TextInput';
import ModalBase from '~/components/modal/ModalBase';
import { dsDanhMuc } from '~/utils/data';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { numeralCustom } from '~/utils/helpers';
import AreaInput from '~/components/input/AreaInput';

const baseSchema = {
  vat_tu: yup
    .object()
    .typeError('Vui lòng chọn hàng hóa')
    .required('Vui lòng chọn hàng hóa'),
  don_vi_tinh: yup
    .object()
    .typeError('Hàng hóa chưa có đơn vị tính')
    .required('Hàng hóa chưa có đơn vị tính'),
};

function FormAddDetail({
  open,
  handleClose,
  isEdit,
  isEditMaster,
  addDetail,
  defaultValues,
}) {
  const [schema, setSchema] = useState(yup.object(baseSchema));
  const {
    handleSubmit,
    control,
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          vat_tu: defaultValues.ma_vt
            ? {
                ma_vt: defaultValues.ma_vt,
                ten_vt: defaultValues.ten_vt,
                ma_dvt: defaultValues.ma_dvt,
                ten_dvt: defaultValues.ten_dvt,
                gia_ban_le: defaultValues.gia_ban_le,
              }
            : null,
        }
      : {
          sl_xuat: 1,
        },
  });

  const vatTu = watch('vat_tu');
  const giaBanLe = watch('gia_ban_le');
  const soLuongXuat = watch('sl_xuat');
  const tienHang = watch('tien_hang');
  const tyLeCk = watch('ty_le_ck');
  const tienCk = watch('tien_ck');

  const handleSave = (values) => {
    return new Promise((resovle) => {
      setTimeout(() => {
        addDetail(values, isEdit);
        handleClose();
        resovle();
      }, 200);
    });
  };

  useEffect(() => {
    setValue('gia_ban_le', vatTu?.gia_ban_le || 0);
    if (vatTu) {
      setValue('don_vi_tinh', {
        ma_dvt: vatTu?.ma_dvt || '',
        ten_dvt: vatTu?.ten_dvt || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vatTu]);

  useEffect(() => {
    const tienHang = (giaBanLe || 0) * (soLuongXuat || 0);
    setValue('tien_hang', tienHang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [giaBanLe, soLuongXuat]);

  useEffect(() => {
    if (tyLeCk) {
      const tienCkNew = ((tienHang || 0) * (tyLeCk || 0)) / 100;
      setValue('tien_ck', Math.floor(tienCkNew));
    }
    const tongTienNew = (tienHang || 0) - (tienCk || 0);
    setValue('t_tien', tongTienNew);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tienHang, tienCk]);

  useEffect(() => {
    if (vatTu?.theo_doi_lo) {
      setSchema(
        yup.object({
          ...baseSchema,
          lo: yup
            .object()
            .typeError('Vui lòng chọ lô')
            .required('Vui lòng chọn lô'),
        })
      );
    }
  }, [vatTu]);

  return (
    <ModalBase
      open={open}
      handleClose={handleClose}
      width="600px"
      title={`${isEdit ? 'Chỉnh sửa' : 'Thêm'} Chi tiết`}
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
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="vat_tu"
            render={({ field: { value, onChange } }) => (
              <SelectApiInput
                disabled={isEdit}
                label="Hàng hóa"
                required
                apiCode="dmvt"
                placeholder="Hàng xuất kho"
                searchFileds={['ma_vt', 'ten_vt']}
                getOptionLabel={(option) => option.ten_vt}
                selectedValue={value}
                value={value || { ma_vt: '', ten_vt: '' }}
                onSelect={onChange}
                FormAdd={dsDanhMuc.dmvt.Form}
                errorMessage={errors?.vat_tu?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="don_vi_tinh"
            render={({ field: { value, onChange } }) => (
              <SelectApiInput
                label="Đơn vị tính"
                required
                apiCode="dmdvt"
                placeholder="Đơn vị tính"
                searchFileds={['ma_dvt', 'ten_dvt']}
                condition={{
                  ma_dvt: {
                    $in: [
                      vatTu?.ma_dvt || '',
                      ...(vatTu?.ds_dvt || []).map((dvt) => dvt.ma_dvt),
                    ],
                  },
                }}
                getOptionLabel={(option) => option.ten_dvt}
                selectedValue={value}
                value={value || { ma_dvt: '', ten_dvt: '' }}
                onSelect={(newValue) => {
                  let valueToSave = newValue;
                  if (newValue.ma_dvt !== vatTu.ma_dvt) {
                    const donViTinhObj = vatTu.ds_dvt.find(
                      (item) => item.ma_dvt === newValue.ma_dvt
                    );
                    if (donViTinhObj) {
                      valueToSave = donViTinhObj;
                      setValue('gia_ban_le', donViTinhObj.gia_ban_qd);
                    } else {
                      valueToSave = {
                        ma_dvt: vatTu.ma_dvt,
                        ten_dvt: vatTu.ten_dvt,
                      };
                      setValue('gia_ban_le', vatTu.gia_ban_le);
                    }
                  } else {
                    setValue('gia_ban_le', vatTu.gia_ban_le);
                  }
                  onChange(valueToSave);
                }}
                FormAdd={dsDanhMuc.dmdvt.Form}
                errorMessage={errors?.don_vi_tinh?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="gia_ban_le"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextInput
                required
                label="Giá bán lẻ"
                placeholder="Giá bán lẻ"
                value={numeralCustom(value || 0).format()}
                onChange={(e) => {
                  onChange(numeralCustom(e.target.value).value());
                }}
                errorMessage={errors?.gia_ban_le?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="sl_xuat"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextInput
                required
                label="Số lượng"
                value={numeralCustom(value || 0).format()}
                onChange={(e) => {
                  onChange(numeralCustom(e.target.value).value());
                }}
                errorMessage={errors?.sl_xuat?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="ty_le_ck"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextInput
                label="Tỷ lệ chiết khấu (%)"
                value={numeralCustom(value || 0).format()}
                onChange={(e) => {
                  // luu gia tri
                  const value = numeralCustom(e.target.value).value();
                  onChange(value);
                  // tinh lai tien ck
                  const tienCkNew = (tienHang * value) / 100;
                  setValue('tien_ck', Math.floor(tienCkNew));
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="tien_ck"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextInput
                label="Tiền chiết khấu"
                value={numeralCustom(value || 0).format()}
                onChange={(e) => {
                  // luu gia tri
                  const value = numeralCustom(e.target.value).value();
                  onChange(value);
                  // tinh lai ty le
                  const tyLeCkNew = (value * 100) / tienHang;
                  setValue('ty_le_ck', tyLeCkNew);
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="tien_hang"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextInput
                disabled
                required
                label="Tiền hàng"
                value={numeralCustom(value || 0).format()}
                onChange={(e) => {
                  // luu gia tri
                  onChange(numeralCustom(e.target.value).value());
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="t_tien"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextInput
                required
                disabled
                label="Thành tiền"
                value={numeralCustom(value || 0).format()}
                onChange={(e) => {
                  onChange(numeralCustom(e.target.value).value());
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <AreaInput
            label="Ghi chú"
            name="dien_giai"
            placeholder="Ghi chú cho mặt hàng này"
            register={register}
          />
        </Grid>
      </Grid>
    </ModalBase>
  );
}

export default FormAddDetail;
