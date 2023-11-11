import FilterReportSoQuy from '~/components/filter/report Soquy/FilterReportSoQuy';
import FilterReportDoanhThu from '~/components/filter/reportDoanhThu/FilterReportDoanhThu';
import FilterReportLoiNhuan from '~/components/filter/reportLoiNhuan/FilterReportLoiNhuan';

const reports = {
  doanhthu: {
    title: 'Báo cáo doanh thu',
    label: 'Doanh thu',
    Filter: FilterReportDoanhThu,
  },
  loinhuan: {
    title: 'Báo cáo lợi nhuận',
    label: 'Lợi nhuận',
    Filter: FilterReportLoiNhuan,
  },
  soquy: {
    title: 'Báo cáo sổ quỹ',
    label: 'Sổ quỹ',
    Filter: FilterReportSoQuy,
  },
};
export default reports;
