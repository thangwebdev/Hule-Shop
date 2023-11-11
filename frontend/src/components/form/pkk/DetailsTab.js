import React from 'react';
import { Stack } from '@mui/material';
import TableDisplay from '~/components/table/TableDisplay';
import ButtonBase from '~/components/button/ButtonBase';
import { BsPlusCircle } from 'react-icons/bs';
import { useState } from 'react';
import FormAddDetail from './FormAddDetail';
import useSnackbarContext from '~/hooks/hookContext/useSnackbarContext';
import { cloneDeep } from 'lodash';
import { numeralCustom } from '~/utils/helpers';

const columns = [
  {
    name: 'Mã hàng',
    selector: (row) => row.ma_vt,
    maxWidth: '120px',
  },
  {
    name: 'Tên hàng',
    selector: (row) => row.ten_vt,
    wrap: true,
    left: true,
  },
  {
    name: 'Đơn vị tính',
    selector: (row) => row.ten_dvt,
    minWidth: '100px',
    center: true,
  },
  {
    name: 'Số sổ sách',
    selector: (row) => row.sl_so_sach,
    format: (row) => numeralCustom(row.sl_so_sach).format(),
    center: true,
  },
  {
    name: 'Số thực tế',
    selector: (row) => row.sl_thuc_te,
    format: (row) => numeralCustom(row.sl_thuc_te).format(),
    center: true,
  },
  {
    name: 'Chênh lệch',
    selector: (row) => row.chenh_lech,
    format: (row) => numeralCustom(row.chenh_lech).format(),
    center: true,
  },
];

function DetailsTab({ details, setDetails, isEditMaster }) {
  const [openForm, setOpenForm] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const alertSnackbar = useSnackbarContext();

  // add a detail
  const addDetail = (detail, isEdit = false) => {
    const { vat_tu, don_vi_tinh, ...detailValue } = detail;
    if (!isEdit) {
      const existed = details.find((item) => item.ma_vt === vat_tu.ma_vt);
      if (existed) {
        alertSnackbar(
          'error',
          `Hàng hóa '${vat_tu.ma_vt}' đã tồn tại trong chi tiết`
        );
        return;
      }
    }
    const detailData = {
      ...detailValue,
      ma_vt: vat_tu.ma_vt,
      ten_vt: vat_tu.ten_vt,
      ma_dvt: don_vi_tinh.ma_dvt,
      ten_dvt: don_vi_tinh.ten_dvt,
    };
    if (isEdit) {
      const index = details.findIndex((item) => item.ma_vt === vat_tu.ma_vt);
      if (index >= 0) {
        const detailsCopy = cloneDeep(details);
        detailsCopy.splice(index, 1, detailData);
        setDetails(detailsCopy);
      }
    } else {
      setDetails([...details, detailData]);
    }
  };
  // delete detail
  const handleDeleteDetail = (row) => {
    let detailsCopy = cloneDeep(details);
    detailsCopy = detailsCopy.filter((item) => item.ma_vt !== row.ma_vt);
    setDetails(detailsCopy);
  };

  // click on row
  const handleRowClicked = (row) => {
    setDefaultValues(row);
    setOpenForm(true);
    setIsEdit(true);
  };
  // handle close form
  const handleCloseForm = () => {
    setIsEdit(false);
    setDefaultValues(null);
    setOpenForm(false);
  };

  return (
    <>
      {openForm && (
        <FormAddDetail
          open={openForm}
          handleClose={handleCloseForm}
          addDetail={addDetail}
          defaultValues={defaultValues}
          isEdit={isEdit}
          isEditMaster={isEditMaster}
        />
      )}
      <Stack sx={{ width: '100%' }} spacing="10px">
        {!isEditMaster && (
          <Stack
            direction="row"
            spacing="5px"
            alignItems="center"
            justifyContent="flex-end"
          >
            <ButtonBase
              variant="outlined"
              startIcon={<BsPlusCircle style={{ fontSize: '14px' }} />}
              onClick={() => setOpenForm(true)}
            >
              Thêm dòng
            </ButtonBase>
          </Stack>
        )}
        <TableDisplay
          data={details}
          columns={columns}
          onRowClicked={handleRowClicked}
          handleDelete={isEditMaster ? null : handleDeleteDetail}
          uniqueKey="ma_vt"
        />
      </Stack>
    </>
  );
}

export default DetailsTab;
