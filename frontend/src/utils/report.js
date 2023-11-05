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
};
export default reports;
