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
        <Controller
          control={control}
          name="loai_thu_chi"
          render={({ field: { onChange, value } }) => (
            <SelectApiInput
              label="Loại phiếu"
              required
              apiCode="loaithuchi"
              placeholder="Loại phiếu thu, chi"
              searchFileds={['ma_loai', 'ten_loai']}
              getOptionLabel={(option) => option.ten_loai}
              selectedValue={value || null}
              value={value || null}
              onSelect={onChange}
              errorMessage={errors?.loai_thu_chi?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextInput
          required
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
          required
          type="date"
          label="Ngày lập phiếu"
          placeholder="Ngày lập phiếu"
          name="ngay_lap_phieu"
          register={register}
          errorMessage={errors?.ngay_lap_phieu?.message}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="gia_tri"
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextInput
              label="Giá trị"
              value={numeralCustom(value || 0).format()}
              onChange={(e) => {
                onChange(numeralCustom(e.target.value).value());
              }}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}

export default InfoTab;
