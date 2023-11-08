import FormProduct from '~/components/form/product/FormProduct';
import { formatDateDisplay, numeralCustom } from './helpers';
import FormDVT from '~/components/form/dvt/FormDVT';
import FilterProduct from '~/components/filter/product/FilterProduct';
import FilterDVT from '~/components/filter/donViTinh/FilterDVT';
import FormPNK from '~/components/form/pnk/FormPNK';
import FilterPNK from '~/components/filter/pnk/FilterPNK';
import FormLPC from '~/components/form/lpc/FormLPC';
import FormLPT from '~/components/form/lpt/FormLPT';
import FilterLPC from '~/components/filter/lpc/FilterLPC';
import FilterLPT from '~/components/filter/lpt/FilterLPT';
import FormKB from '~/components/form/kb/FormKB';
import FilterKB from '~/components/filter/kenhBan/FilterKB';
import FormPT from '~/components/form/phieuthu/FormPT';
import FilterPT from '~/components/filter/phieuThu/FilterPT';
import FormPBL from '~/components/form/pbl/FormPBL';
import FormPC from '~/components/form/phieuchi/FormPC';
import FilterPC from '~/components/filter/phieuChi/FilterPC';
import { Chip } from '@mui/material';
import FormPXK from '~/components/form/pxk/FormPXK';
import FilterPBL from '~/components/filter/pbl/FilterPBL';

const dsDanhMuc = {
  dmvt: {
    title: 'hàng hóa',
    uniqueKey: 'ma_vt',
    Form: FormProduct,
    Filter: FilterProduct,
    columns: [
      {
        name: 'Mã',
        selector: (row) => row.ma_vt,
        width: '150px',
        sortable: true,
        wrap: true,
      },
      {
        name: 'Tên',
        selector: (row) => row.ten_vt,
        minWidth: '200px',
        sortable: true,
        wrap: true,
      },
      {
        name: 'Giá vốn',
        selector: (row) => row.gia_von,
        sortable: true,
        format: (row) => numeralCustom(row.gia_von).format(),
        center: true,
      },
      {
        name: 'Giá bán lẻ',
        selector: (row) => row.gia_ban_le,
        sortable: true,
        format: (row) => numeralCustom(row.gia_ban_le).format(),
        center: true,
      },
      {
        name: 'Tồn kho',
        selector: (row) => row.ton_kho,
        format: (row) => numeralCustom(row.ton_kho).format(),
        sortable: true,
        center: true,
      },
      {
        name: 'Đơn vị tính',
        selector: (row) => row.ten_dvt,
        right: true,
        sortable: true,
      },
    ],
  },
  dmdvt: {
    title: 'đơn vị tính',
    uniqueKey: 'ma_dvt',
    Filter: FilterDVT,
    Form: FormDVT,
    columns: [
      {
        name: 'Mã',
        selector: (row) => row.ma_dvt,
        sortable: true,
      },
      {
        name: 'Tên',
        selector: (row) => row.ten_dvt,
        sortable: true,
      },
      {
        name: 'Người tạo',
        selector: (row) => row.createdBy,
        sortable: true,
      },
    ],
  },
  pnk: {
    title: 'phiếu nhập kho',
    uniqueKey: 'ma_phieu',
    Form: FormPNK,
    Filter: FilterPNK,
    columns: [
      {
        name: 'Mã phiếu',
        selector: (row) => row.ma_phieu,
        sortable: true,
        width: '120px',
        left: true,
        wrap: true,
      },
      {
        name: 'Trạng thái',
        width: '120px',
        center: true,
        selector: (row) => (
          <Chip
            size="small"
            label={row.ten_trang_thai}
            sx={{ backgroundColor: row.color, color: '#fff' }}
          />
        ),
      },
      {
        name: 'Ngày chứng từ',
        selector: (row) => row.ngay_ct,
        sortable: true,
        center: true,
        format: (row) => formatDateDisplay(row.ngay_ct),
        minWidth: '150px',
      },
      {
        name: 'Ngày nhập hàng',
        selector: (row) => row.ngay_nhap_hang,
        sortable: true,
        minWidth: '150px',
        center: true,
        format: (row) => formatDateDisplay(row.ngay_nhap_hang),
      },
      {
        name: 'Chi tiết',
        selector: (row) =>
          row.details
            ?.map(
              (detail) => `${detail.sl_nhap} ${detail.ten_dvt} ${detail.ten_vt}`
            )
            .join(', '),
        sortable: true,
        minWidth: '150px',
        wrap: true,
        grow: 2,
      },
      {
        name: 'Tổng tiền nhập',
        selector: (row) => row.tong_tien_nhap,
        sortable: true,
        right: true,
        minWidth: '140px',
        format: (row) => numeralCustom(row.tong_tien_nhap).format(),
      },
    ],
  },
  pxk: {
    title: 'phiếu xuất kho',
    uniqueKey: 'ma_phieu',
    Form: FormPXK,
    Filter: FilterPNK,
    columns: [
      {
        name: 'Mã phiếu',
        selector: (row) => row.ma_phieu,
        sortable: true,
        width: '120px',
        left: true,
        wrap: true,
      },
      {
        name: 'Trạng thái',
        width: '120px',
        center: true,
        selector: (row) => (
          <Chip
            size="small"
            label={row.ten_trang_thai}
            sx={{ backgroundColor: row.color, color: '#fff' }}
          />
        ),
      },
      {
        name: 'Ngày chứng từ',
        selector: (row) => row.ngay_ct,
        sortable: true,
        center: true,
        format: (row) => formatDateDisplay(row.ngay_ct),
        width: '140px',
      },
      {
        name: 'Ngày xuất hàng',
        selector: (row) => row.ngay_xuat_hang,
        sortable: true,
        width: '140px',
        center: true,
        format: (row) => formatDateDisplay(row.ngay_xuat_hang),
      },
      {
        name: 'Chi tiết',
        selector: (row) =>
          row.details
            ?.map(
              (detail) => `${detail.sl_xuat} ${detail.ten_dvt} ${detail.ten_vt}`
            )
            .join(', '),
        sortable: true,
        minWidth: '150px',
        wrap: true,
        grow: 2,
        style: { padding: '5px' },
      },
      {
        name: 'Diễn giải',
        selector: (row) => row.dien_giai,
        sortable: true,
        left: true,
        grow: 2,
        wrap: true,
        style: { padding: '5px' },
      },
    ],
  },
  pbl: {
    title: 'phiếu bán lẻ',
    uniqueKey: 'ma_phieu',
    Form: FormPBL,
    Filter: FilterPBL,
    columns: [
      {
        name: 'Mã phiếu',
        selector: (row) => row.ma_phieu,
        sortable: true,
        width: '130px',
      },
      {
        name: 'Trạng thái',
        width: '140px',
        center: true,
        selector: (row) => (
          <Chip
            size="small"
            label={row.ten_trang_thai}
            sx={{ backgroundColor: row.color, color: '#fff' }}
          />
        ),
      },
      {
        name: 'Ngày chứng từ',
        selector: (row) => row.ngay_ct,
        format: (row) => formatDateDisplay(row.ngay_ct),
        sortable: true,
        center: true,
      },
      {
        name: 'Ngày lập phiếu',
        selector: (row) => row.ngay_lap_phieu,
        format: (row) => formatDateDisplay(row.ngay_lap_phieu),
        sortable: true,
        center: true,
      },
      {
        name: 'Tổng thành tiền',
        selector: (row) => row.t_tt,
        format: (row) => numeralCustom(row.t_tt).format(),
        sortable: true,
        center: true,
      },
      {
        name: 'Kênh bán',
        selector: (row) => row.ten_kenh,
        sortable: true,
        right: true,
        wrap: true,
      },
    ],
  },
  dmlpt: {
    title: 'loại phiếu thu',
    uniqueKey: 'ma_loai',
    Form: FormLPT,
    Filter: FilterLPT,
    columns: [
      {
        name: 'Mã loại',
        selector: (row) => row.ma_loai,
        sortable: true,
        minWidth: '100px',
      },
      {
        name: 'Tên Loại',
        selector: (row) => row.ten_loai,
        sortable: true,
        minWidth: '100px',
      },
    ],
  },
  dmlpc: {
    title: 'loại phiếu chi',
    uniqueKey: 'ma_loai',
    Form: FormLPC,
    Filter: FilterLPC,
    columns: [
      {
        name: 'Mã loại',
        selector: (row) => row.ma_loai,
        sortable: true,
        minWidth: '100px',
      },
      {
        name: 'Tên Loại',
        selector: (row) => row.ten_loai,
        sortable: true,
        minWidth: '100px',
      },
    ],
  },
  dmkb: {
    title: 'Kênh bán',
    uniqueKey: 'ma_kenh',
    Form: FormKB,
    Filter: FilterKB,
    columns: [
      {
        name: 'Mã Kênh',
        selector: (row) => row.ma_kenh,
        sortable: true,
        minWidth: '100px',
      },
      {
        name: 'Tên Kênh',
        selector: (row) => row.ten_kenh,
        sortable: true,
        minWidth: '100px',
      },
    ],
  },
  dmpt: {
    title: 'Phiếu Thu',
    uniqueKey: 'ma_phieu',
    Form: FormPT,
    Filter: FilterPT,
    columns: [
      {
        name: 'Mã phiếu chi',
        selector: (row) => row.ma_phieu,
        sortable: true,
        left: true,
        minWidth: '120px',
      },
      {
        name: 'Mã chứng từ',
        selector: (row) => row.ma_ct,
        sortable: true,
        minWidth: '120px',
      },
      {
        name: 'Diễn giải',
        selector: (row) => row.dien_giai,
        sortable: true,
        center: true,
        minWidth: '150px',
        wrap: true,
      },
      {
        name: 'Giá trị',
        selector: (row) => row.gia_tri,
        format: (row) => numeralCustom(row.gia_tri).format(),
        sortable: true,
        center: true,
        minWidth: '120px',
      },
      {
        name: 'Loại phiếu',
        selector: (row) => row.ten_loai,
        sortable: true,
        center: true,
        minWidth: '150px',
      },
      {
        name: 'Ngày chứng từ',
        selector: (row) => row.ngay_ct,
        sortable: true,
        minWidth: '150px',
        center: true,
        format: (row) => formatDateDisplay(row.ngay_ct),
      },
      {
        name: 'Ngày lập phiếu',
        selector: (row) => row.ngay_lap_phieu,
        sortable: true,
        minWidth: '150px',
        right: true,
        format: (row) => formatDateDisplay(row.ngay_lap_phieu),
      },
    ],
  },
  dmpc: {
    title: 'Phiếu Chi',
    uniqueKey: 'ma_phieu',
    Form: FormPC,
    Filter: FilterPC,
    columns: [
      {
        name: 'Mã phiếu thu',
        selector: (row) => row.ma_phieu,
        sortable: true,
        left: true,
        minWidth: '120px',
      },
      {
        name: 'Mã chứng từ',
        selector: (row) => row.ma_ct,
        sortable: true,
        minWidth: '120px',
      },
      {
        name: 'Diễn giải',
        selector: (row) => row.dien_giai,
        sortable: true,
        center: true,
        minWidth: '150px',
        wrap: true,
      },
      {
        name: 'Giá trị',
        selector: (row) => row.gia_tri,
        format: (row) => numeralCustom(row.gia_tri).format(),
        sortable: true,
        center: true,
        minWidth: '120px',
      },
      {
        name: 'Loại phiếu',
        selector: (row) => row.ten_loai,
        sortable: true,
        center: true,
        minWidth: '150px',
      },
      {
        name: 'Ngày chứng từ',
        selector: (row) => row.ngay_ct,
        sortable: true,
        minWidth: '150px',
        center: true,
        format: (row) => formatDateDisplay(row.ngay_ct),
      },
      {
        name: 'Ngày lập phiếu',
        selector: (row) => row.ngay_lap_phieu,
        sortable: true,
        minWidth: '150px',
        right: true,
        format: (row) => formatDateDisplay(row.ngay_lap_phieu),
      },
    ],
  },
};

export { dsDanhMuc };
