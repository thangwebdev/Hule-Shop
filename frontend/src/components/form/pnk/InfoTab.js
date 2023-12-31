import { Grid } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';
import SelectApiInput from '~/components/input/SelectApiInput';
import TextInput from '~/components/input/TextInput';
import { numeralCustom } from '~/utils/helpers';

function InfoTab({ register, control, isEdit, errors }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextInput
          disabled={isEdit}
          label="Mã phiếu"
          placeholder="Nhập hoặc tạo tự động"
          name="ma_phieu"
          register={register}
          errorMessage={errors?.ma_phieu?.message}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextInput
          type="date"
          label="Ngày chứng từ"
          placeholder="Ngày hiệu lực sổ sách"
          name="ngay_ct"
          register={register}
          errorMessage={errors?.ngay_ct?.message}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextInput
          type="date"
          label="Ngày nhập hàng"
          placeholder="Ngày hàng vào kho"
          name="ngay_nhap_hang"
          register={register}
          errorMessage={errors?.ngay_nhap_hang?.message}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="tong_tien_nhap"
          render={({ field: { value, onChange } }) => (
            <TextInput
              value={numeralCustom(value).format()}
              onChange={(e) => {
                const val = numeralCustom(e.target.value).value();
                onChange(val);
              }}
              label="Tổng tiền nhập"
              placeholder="Tiền nhập hàng"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="trang_thai"
          render={({ field: { onChange, value } }) => (
            <SelectApiInput
              label="Trạng thái"
              required
              apiCode="trangthai"
              placeholder="Trạng thái"
              searchFileds={['ma_trang_thai', 'ten_trang_thai']}
              condition={{ ma_ct: 'pnk' }}
              getOptionLabel={(option) => option.ten_trang_thai}
              selectedValue={value || null}
              value={value || null}
              onSelect={onChange}
              errorMessage={errors?.trang_thai?.message}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}

export default InfoTab;
