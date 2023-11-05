import { Grid } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';
import SelectApiInput from '~/components/input/SelectApiInput';
import TextInput from '~/components/input/TextInput';
import { dsDanhMuc } from '~/utils/data';
import { numeralCustom } from '~/utils/helpers';

function InfoTab({
  register,
  control,
  isEdit,
  errors,
  tienHang = 0,
  tongTienCk = 0,
  tienVanChuyen = 0,
  chiPhiKhac = 0,
  setValue,
}) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextInput
          disabled={isEdit}
          label="Mã phiếu"
          placeholder="Mã nhập hoặc tạo tự động"
          name="ma_phieu"
          register={register}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="kenh_ban"
          render={({ field: { onChange, value } }) => (
            <SelectApiInput
              label="Kênh bán"
              apiCode="dmkb"
              placeholder="Kênh bán hàng"
              searchFileds={['ma_kenh', 'ten_kenh']}
              getOptionLabel={(option) => option.ten_kenh}
              selectedValue={value}
              value={value || { ma_kenh: '', ten_kenh: '' }}
              onSelect={onChange}
              FormAdd={dsDanhMuc['dmkb']?.Form}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextInput
          required
          type="date"
          label="Ngày lập phiếu"
          placeholder="Ngày tạo ra phiếu"
          name="ngay_lap_phieu"
          register={register}
          errorMessage={errors?.ngay_lap_phieu?.message}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextInput
          required
          type="date"
          label="Ngày chứng từ"
          placeholder="Ngày chứng từ"
          name="ngay_ct"
          register={register}
          errorMessage={errors?.ngay_ct?.message}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="t_tien_hang"
          render={({ field: { value, onChange } }) => (
            <TextInput
              disabled
              value={numeralCustom(value).format()}
              onChange={(e) => {
                const val = numeralCustom(e.target.value).value();
                onChange(val);
              }}
              label="Tiền hàng (tự động tính)"
              placeholder="Tiền hàng bán"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="tien_ck_sp"
          render={({ field: { value, onChange } }) => (
            <TextInput
              disabled
              value={numeralCustom(value).format()}
              onChange={(e) => {
                const val = numeralCustom(e.target.value).value();
                onChange(val);
              }}
              label="Tiền chiết khấu sản phẩm (tự động tính)"
              placeholder="Tiền chiết khẩu sản phẩm"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="ty_le_ck_hd"
          render={({ field: { value, onChange } }) => (
            <TextInput
              value={numeralCustom(value).format()}
              onChange={(e) => {
                // luu gia tri
                const val = numeralCustom(e.target.value).value();
                onChange(val);
                // thay doi tien ck
                const tienCkNew = (tienHang * val) / 100;
                setValue('tien_ck_hd', Math.floor(tienCkNew));
              }}
              label="Tỷ lệ chiết khấu hóa đơn (%)"
              placeholder="Tỷ lệ chiết khẩu hóa đơn"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="tien_ck_hd"
          render={({ field: { value, onChange } }) => (
            <TextInput
              value={numeralCustom(value).format()}
              onChange={(e) => {
                // luu gia tri
                const val = numeralCustom(e.target.value).value();
                onChange(val);
                // thay doi ty le ck
                const tyLeCkNew = (val * 100) / tienHang;
                setValue('ty_le_ck_hd', tyLeCkNew);
              }}
              label="Tiền chiết khấu hóa đơn"
              placeholder="Tiền chiết khấu hóa đơn"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="t_tien_ck"
          render={({ field: { value, onChange } }) => (
            <TextInput
              disabled
              value={numeralCustom(value).format()}
              onChange={(e) => {
                const val = numeralCustom(e.target.value).value();
                onChange(Math.floor(val));
              }}
              label="Tổng tiền chiết khấu (tự động tính)"
              placeholder="Tổng tiền chiết khẩu"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="tien_van_chuyen"
          render={({ field: { value, onChange } }) => (
            <TextInput
              value={numeralCustom(value).format()}
              onChange={(e) => {
                const val = numeralCustom(e.target.value).value();
                const tongThanhTien =
                  (tienHang || 0) -
                  (tongTienCk || 0) +
                  (chiPhiKhac || 0) +
                  (val || 0);
                setValue('t_tt', tongThanhTien);
                onChange(val);
              }}
              label="Tiền vận chuyển"
              placeholder="Tiền vận chuyển"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="chi_phi_khac"
          render={({ field: { value, onChange } }) => (
            <TextInput
              value={numeralCustom(value).format()}
              onChange={(e) => {
                const val = numeralCustom(e.target.value).value();
                const tongThanhTien =
                  (tienHang || 0) -
                  (tongTienCk || 0) +
                  (tienVanChuyen || 0) +
                  (val || 0);
                setValue('t_tt', tongThanhTien);
                onChange(val);
              }}
              label="Chi phí khác"
              placeholder="Chi phí khác"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="t_tt"
          render={({ field: { value, onChange } }) => (
            <TextInput
              disabled
              value={numeralCustom(value).format()}
              onChange={(e) => {
                const val = numeralCustom(e.target.value).value();
                onChange(val);
              }}
              label="Thành tiền (tự động tính)"
              placeholder="Thành tiền"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="tien_thu"
          render={({ field: { value, onChange } }) => (
            <TextInput
              value={numeralCustom(value).format()}
              onChange={(e) => {
                const val = numeralCustom(e.target.value).value();
                onChange(val);
              }}
              label="Tiền thu"
              placeholder="Tiền thu"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="tien_thoi"
          render={({ field: { value, onChange } }) => (
            <TextInput
              disabled
              value={numeralCustom(value).format()}
              onChange={(e) => {
                const val = numeralCustom(e.target.value).value();
                onChange(val);
              }}
              label="Tiền thối (tự động tính)"
              placeholder="Tiền thối"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="phi_nen_tang"
          render={({ field: { value, onChange } }) => (
            <TextInput
              value={numeralCustom(value).format()}
              onChange={(e) => {
                const val = numeralCustom(e.target.value).value();
                onChange(val);
              }}
              label="Phí nền tảng"
              placeholder="Phí nền tảng"
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
              placeholder="Trạng thái phiếu"
              searchFileds={['ma_trang_thai', 'ten_trang_thai']}
              condition={{ ma_ct: 'pbl' }}
              getOptionLabel={(option) => option.ten_trang_thai}
              selectedValue={value}
              value={value || { ma_trang_thai: '', ten_trang_thai: '' }}
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
