import React from 'react';
import { Stack } from '@mui/material';
import TableDisplay from '~/components/table/TableDisplay';
import { numeralCustom } from '~/utils/helpers';
import ButtonBase from '~/components/button/ButtonBase';
import { BsPlusCircle } from 'react-icons/bs';
import { useState } from 'react';
import FormAddDetail from './FormAddDetail';
import useSnackbarContext from '~/hooks/hookContext/useSnackbarContext';
import { cloneDeep } from 'lodash';
import { v4 } from 'uuid';

const columns = [
  {
    name: 'Mã hàng',
    selector: (row) => row.ma_vt,
    width: '120px',
  },
  {
    name: 'Tên hàng',
    selector: (row) => row.ten_vt,
    width: '170px',
    wrap: true,
  },
  {
    name: 'Số lượng',
    selector: (row) => row.sl_xuat,
    width: '100px',
    center: true,
  },
  {
    name: 'Đơn vị tính',
    selector: (row) => row.ten_dvt,
    minWidth: '100px',
    center: true,
  },
  {
    name: 'Đơn giá',
    selector: (row) => row.don_gia,
    width: '150px',
    center: true,
    format: (row) => numeralCustom(row.don_gia).format(),
  },
  {
    name: 'Tiền hàng',
    selector: (row) => row.tien_hang,
    width: '150px',
    center: true,
    format: (row) => numeralCustom(row.tien_hang).format(),
  },
  {
    name: 'Tiền chiết khấu',
    selector: (row) => row.tien_ck,
    minWidth: '150px',
    center: true,
    format: (row) => numeralCustom(row.tien_ck).format(),
  },
  {
    name: 'Tổng tiền',
    selector: (row) => row.t_tien,
    minWidth: '150px',
    center: true,
    format: (row) => numeralCustom(row.t_tien).format(),
  },
];

function DetailsTab({ details, setDetails, isEditMaster, tienCkHoaDon = 0 }) {
  const [openForm, setOpenForm] = useState(false);
  const [defaultValues, setDefaultValues] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const alertSnackbar = useSnackbarContext();

  // add a detail
  const addDetail = (detail, isEdit = false) => {
    const { vat_tu, don_vi_tinh, ...detailFields } = detail;
    const data = {
      ...detailFields,
      _id: detailFields._id || v4(),
      ma_vt: vat_tu?.ma_vt,
      ten_vt: vat_tu?.ten_vt,
      ma_dvt: don_vi_tinh?.ma_dvt,
      ten_dvt: don_vi_tinh?.ten_dvt,
      gia_von: vat_tu.gia_von,
      chi_phi: (vat_tu.gia_von || 0) * (detailFields.sl_xuat || 0),
    };
    if (isEdit) {
      const index = details.findIndex(
        (item) =>
          item.ma_vt === vat_tu.ma_vt && item.ma_dvt === don_vi_tinh.ma_dvt
      );
      if (index >= 0) {
        const detailsClone = cloneDeep(details);
        detailsClone.splice(index, 1, data);
        setDetails(detailsClone);
      } else {
        alertSnackbar('error', 'Hàng hóa không tồn tại');
        return;
      }
    } else {
      const existed = details.find(
        (item) =>
          item.ma_vt === vat_tu.ma_vt && item.ma_dvt === don_vi_tinh.ma_dvt
      );
      if (existed) {
        alertSnackbar(
          'error',
          `Hàng hóa '${don_vi_tinh.ten_dvt} ${vat_tu.ten_vt}' đã tồn tại trong chi tiết`
        );
        return;
      } else {
        setDetails([...details, data]);
      }
    }
  };
  // delete detail
  const handleDeleteDetail = (row) => {
    let detailsCopy = cloneDeep(details);
    detailsCopy = detailsCopy.filter((item) => item._id !== row._id);
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
          handleDelete={handleDeleteDetail}
          uniqueKey="_id"
        />
      </Stack>
    </>
  );
}

export default DetailsTab;
