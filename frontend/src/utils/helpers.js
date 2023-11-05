import numeral from 'numeral';
import moment from 'moment';

numeral.register('locale', 'vi', {
  delimiters: {
    thousands: '.',
    decimal: ',',
  },
  abbreviations: {
    thousand: 'Nghìn',
    million: 'Triệu',
    billion: 'Tỷ',
    trillion: 'Nghìn Tỷ',
  },
  currency: {
    symbol: '₫',
  },
});
numeral.locale('vi');
function formatDateDisplay(date) {
  if (!date) return;
  return moment(date).format('DD/MM/YYYY');
}

// group by
const groupBy = ({ data = [], callbackMatch }) => {
  if (!callbackMatch) return data;
  let result = {};
  data.forEach((item) => {
    if (result[callbackMatch(item)]) {
      result[callbackMatch(item)].push(item);
    } else {
      result[callbackMatch(item)] = [item];
    }
  });
  return Object.values(result);
};
export { numeral as numeralCustom, formatDateDisplay, groupBy };
