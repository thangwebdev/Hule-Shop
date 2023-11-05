import React, { useState, memo } from 'react';
import {
  Box,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import TextInput from '~/components/input/TextInput';
import { Controller } from 'react-hook-form';
import SelectApiInput from '~/components/input/SelectApiInput';
import { numeralCustom } from '~/utils/helpers';
import { dsDanhMuc } from '~/utils/data';
import { BsCaretDown, BsCaretUp } from 'react-icons/bs';
import DvtVariant from './DvtVariant';
import CheckboxInput from '~/components/input/CheckboxInput';

function InfoTab({ control, register, errors, isEdit = false, dvts, setDvts }) {
  const [showDvts, setShowDvts] = useState(true);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextInput
          disabled={isEdit}
          label="Mã hàng hóa"
          placeholder="Nhập hoặc tạo tự động"
          name="ma_vt"
          register={register}
          errorMessage={errors?.ma_vt?.message}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextInput
          label="Tên hàng hóa"
          placeholder="Tên nhận dạng"
          name="ten_vt"
          required
          register={register}
          errorMessage={errors?.ten_vt?.message}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="don_vi_tinh"
          render={({ field: { onChange, value } }) => (
            <SelectApiInput
              required
              label="Đơn vị tính"
              apiCode="dmdvt"
              placeholder="Đơn vị tính"
              searchFileds={['ma_dvt', 'ten_dvt']}
              getOptionLabel={(option) => option.ten_dvt}
              selectedValue={value}
              value={value || { ma_dvt: '', ten_dvt: '' }}
              onSelect={onChange}
              FormAdd={dsDanhMuc['dmdvt'].Form}
              errorMessage={errors?.don_vi_tinh?.message}
            />
          )}
        />
      </Grid>
      {isEdit ? (
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="ton_kho"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Tồn kho"
                placeholder="Tồn kho"
                disabled
                value={numeralCustom(value).format()}
                onChange={(e) => {
                  const number = e.target.value;
                  onChange(numeralCustom(number).value());
                }}
              />
            )}
          />
        </Grid>
      ) : (
        <Grid item xs={12} md={6}>
          <Controller
            control={control}
            name="ton_kho_ban_dau"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Tồn kho ban đầu"
                placeholder="Tồn kho ban đầu"
                value={numeralCustom(value).format()}
                onChange={(e) => {
                  const number = e.target.value;
                  onChange(numeralCustom(number).value());
                }}
              />
            )}
          />
        </Grid>
      )}
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="gia_ban_le"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Giá bán lẻ"
              placeholder="Giá bán 1 đơn vị hàng hóa"
              value={numeralCustom(value).format()}
              onChange={(e) => {
                const number = e.target.value;
                onChange(numeralCustom(number).value());
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          control={control}
          name="gia_von"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Giá vốn"
              placeholder="Giá vốn trung bình"
              value={numeralCustom(value).format()}
              onChange={(e) => {
                const number = e.target.value;
                onChange(numeralCustom(number).value());
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          control={control}
          name="la_sp_sx"
          render={({ field: { onChange, value } }) => (
            <CheckboxInput
              label="Là sản phẩm sản xuất"
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ width: '100%' }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ padding: '5px' }}
          >
            <Typography sx={{ fontSize: '13px' }}>Đơn vị tính khác</Typography>
            <IconButton onClick={() => setShowDvts(!showDvts)}>
              {showDvts ? (
                <BsCaretUp fontSize="14px" />
              ) : (
                <BsCaretDown fontSize="14px" />
              )}
            </IconButton>
          </Stack>
          <Collapse in={showDvts}>
            <Box sx={{ padding: '5px' }}>
              <DvtVariant dvts={dvts} setDvts={setDvts} />
            </Box>
          </Collapse>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default memo(InfoTab);
