import React, { useState, useEffect } from 'react';
import FilterRadios from '../FilterRadios';
import { groupBy, numeralCustom } from '~/utils/helpers';
import { cloneDeep } from 'lodash';
import moment from 'moment';

const concerns = [
  {
    label: 'Thời gian',
    value: 'time',
  },
  {
    title: 'theo kênh bán',
    chartField: 'loi_nhuan',
    labelField: 'kenh',
    showChart: true,
    api: 'pbl',
    columns: [
      {
        name: 'kênh',
        sortable: true,
        selector: (row) => row.kenh,
        width: '120px',
      },
      {
        name: 'Số đơn',
        sortable: true,
        selector: (row) => row.so_don,
        center: true,
      },
      {
        name: 'Tiền hàng',
        sortable: true,
        selector: (row) => row.t_tien_hang,
        format: (row) => numeralCustom(row.t_tien_hang).format(),
        center: true,
      },
      {
        name: 'Tiền chiết khấu',
        sortable: true,
        selector: (row) => row.t_tien_ck,
        format: (row) => numeralCustom(row.t_tien_ck).format(),
        minWidth: '140px',
        center: true,
      },
      {
        name: 'Phí nền tảng',
        sortable: true,
        selector: (row) => row.phi_nen_tang,
        format: (row) => numeralCustom(row.phi_nen_tang).format(),
        center: true,
      },
      {
        name: 'Giá vốn',
        sortable: true,
        selector: (row) => row.t_chi_phi,
        format: (row) => numeralCustom(row.t_chi_phi).format(),
        center: true,
      },
      {
        name: 'Lợi nhuận',
        sortable: true,
        selector: (row) => row.loi_nhuan,
        format: (row) => numeralCustom(row.loi_nhuan).format(),
        right: true,
      },
    ],
    convertData(data) {
      const result = [];
      const total = {
        kenh: 'Tổng cộng',
        so_don: 0,
        t_tien_hang: 0,
        t_tien_ck: 0,
        phi_nen_tang: 0,
        t_chi_phi: 0,
        loi_nhuan: 0,
      };
      const dataGrouped = groupBy({
        data,
        callbackMatch: (item) => {
          return item.ma_kenh;
        },
      });
      dataGrouped.forEach((group) => {
        const res = group.reduce(
          (acc, item) => {
            return {
              kenh: item.ten_kenh,
              so_don: acc.so_don + 1,
              t_tien_hang: acc.t_tien_hang + item.t_tien_hang,
              t_tien_ck: acc.t_tien_ck + item.t_tien_ck,
              phi_nen_tang: acc.phi_nen_tang + item.phi_nen_tang,
              t_chi_phi: acc.t_chi_phi + item.t_chi_phi,
              loi_nhuan: acc.loi_nhuan + item.loi_nhuan,
            };
          },
          {
            kenh: '',
            so_don: 0,
            t_tien_hang: 0,
            t_tien_ck: 0,
            phi_nen_tang: 0,
            t_chi_phi: 0,
            loi_nhuan: 0,
          }
        );
        total.so_don += res.so_don;
        total.t_tien_hang += res.t_tien_hang;
        total.t_tien_ck += res.t_tien_ck;
        total.phi_nen_tang += res.phi_nen_tang;
        total.t_chi_phi += res.t_chi_phi;
        total.loi_nhuan += res.loi_nhuan;
        result.push(res);
      });
      result.push(total);
      return result;
    },

    label: 'Kênh bán',
    value: 'kenhban',
  },
  {
    title: 'theo hàng hóa',
    chartField: 'loi_nhuan',
    labelField: 'ten_vt',
    showChart: true,
    api: 'ctbanle',
    columns: [
      {
        name: 'Hàng hóa',
        sortable: true,
        selector: (row) => row.ten_vt,
        minWidth: '140px',
      },
      {
        name: 'Số đơn',
        sortable: true,
        selector: (row) => row.so_don,
        center: true,
      },
      {
        name: 'Số lượng',
        sortable: true,
        selector: (row) => row.sl_xuat,
        center: true,
      },
      {
        name: 'Đơn vị tính',
        sortable: true,
        selector: (row) => row.ten_dvt,
        center: true,
      },
      {
        name: 'Tiền hàng',
        sortable: true,
        selector: (row) => row.tien_hang,
        format: (row) => numeralCustom(row.tien_hang).format(),
        center: true,
      },
      {
        name: 'Tiền chiết khấu',
        sortable: true,
        selector: (row) => row.tien_ck,
        format: (row) => numeralCustom(row.tien_ck).format(),
        center: true,
      },
      {
        name: 'Lợi nhuận',
        sortable: true,
        selector: (row) => row.loi_nhuan,
        format: (row) => numeralCustom(row.loi_nhuan).format(),
        right: true,
      },
    ],
    convertData(data) {
      const result = [];
      const total = {
        ten_vt: 'Tổng cộng',
        so_don: 0,
        sl_xuat: 0,
        ten_dvt: '--',
        tien_hang: 0,
        tien_ck: 0,
        loi_nhuan: 0,
      };
      const dataGrouped = groupBy({
        data,
        callbackMatch: (item) => {
          return item.ma_vt;
        },
      });
      dataGrouped.forEach((group) => {
        const res = group.reduce(
          (acc, item) => {
            return {
              ten_vt: item.ten_vt,
              so_don: acc.so_don + 1,
              sl_xuat: acc.sl_xuat + item.sl_xuat,
              ten_dvt: item.ten_dvt,
              tien_hang: acc.tien_hang + item.tien_hang,
              tien_ck: acc.tien_ck + item.tien_ck,
              loi_nhuan: acc.loi_nhuan + item.loi_nhuan,
            };
          },
          {
            ten_vt: '',
            so_don: 0,
            sl_xuat: 0,
            ten_dvt: '',
            tien_hang: 0,
            tien_ck: 0,
            loi_nhuan: 0,
          }
        );
        total.so_don += res.so_don;
        total.sl_xuat += res.sl_xuat;
        total.tien_hang += res.t_tien_hang;
        total.tien_ck += res.t_tien_ck;
        total.loi_nhuan += res.loi_nhuan;
        result.push(res);
      });
      result.push(total);
      return result;
    },

    label: 'Hàng hóa',
    value: 'product',
  },
];
const timeConcerns = {
  days: {
    title: 'theo khoảng thời gian',
    chartField: 'loi_nhuan',
    labelField: 'time',
    showChart: false,
    api: 'pbl',
    columns: [
      {
        name: 'Thời gian',
        sortable: true,
        selector: (row) => row.time,
        width: '200px',
      },
      {
        name: 'Số đơn',
        sortable: true,
        selector: (row) => row.so_don,
        center: true,
      },
      {
        name: 'Tiền hàng',
        sortable: true,
        selector: (row) => row.t_tien_hang,
        format: (row) => numeralCustom(row.t_tien_hang).format(),
        center: true,
      },
      {
        name: 'Tiền chiết khấu',
        sortable: true,
        selector: (row) => row.t_tien_ck,
        format: (row) => numeralCustom(row.t_tien_ck).format(),
        width: '140px',
        center: true,
      },
      {
        name: 'Phí nền tảng',
        sortable: true,
        selector: (row) => row.phi_nen_tang,
        format: (row) => numeralCustom(row.phi_nen_tang).format(),
        center: true,
      },
      {
        name: 'Giá vốn',
        sortable: true,
        selector: (row) => row.t_chi_phi,
        format: (row) => numeralCustom(row.t_chi_phi).format(),
        center: true,
      },
      {
        name: 'Lợi nhuận',
        sortable: true,
        selector: (row) => row.loi_nhuan,
        format: (row) => numeralCustom(row.loi_nhuan).format(),
        right: true,
      },
    ],
    convertData(data, time) {
      const result = [];
      const res = data.reduce(
        (acc, item) => {
          return {
            time: `${moment(time.tu_ngay).format('DD/MM/YYYY')} đến ${moment(
              time.den_ngay
            ).format('DD/MM/YYYY')}`,
            so_don: acc.so_don + 1,
            t_tien_hang: acc.t_tien_hang + item.t_tien_hang,
            t_tien_ck: acc.t_tien_ck + item.t_tien_ck,
            phi_nen_tang: acc.phi_nen_tang + item.phi_nen_tang,
            t_chi_phi: acc.t_chi_phi + item.t_chi_phi,
            loi_nhuan: acc.loi_nhuan + item.loi_nhuan,
          };
        },
        {
          time: '',
          so_don: 0,
          t_tien_hang: 0,
          t_tien_ck: 0,
          phi_nen_tang: 0,
          t_chi_phi: 0,
          loi_nhuan: 0,
        }
      );
      result.push(res);
      return result;
    },
  },
  today: {
    title: 'hôm nay',
    chartField: 'loi_nhuan',
    labelField: 'time',
    showChart: false,
    api: 'pbl',
    columns: [
      {
        name: 'Ngày',
        sortable: true,
        selector: (row) => row.time,
        width: '120px',
      },
      {
        name: 'Số đơn',
        sortable: true,
        selector: (row) => row.so_don,
        center: true,
      },
      {
        name: 'Tiền hàng',
        sortable: true,
        selector: (row) => row.t_tien_hang,
        format: (row) => numeralCustom(row.t_tien_hang).format(),
        center: true,
      },
      {
        name: 'Tiền chiết khấu',
        sortable: true,
        selector: (row) => row.t_tien_ck,
        format: (row) => numeralCustom(row.t_tien_ck).format(),
        minWidth: '140px',
        center: true,
      },
      {
        name: 'Phí nền tảng',
        sortable: true,
        selector: (row) => row.phi_nen_tang,
        format: (row) => numeralCustom(row.phi_nen_tang).format(),
        center: true,
      },
      {
        name: 'Giá vốn',
        sortable: true,
        selector: (row) => row.t_chi_phi,
        format: (row) => numeralCustom(row.t_chi_phi).format(),
        center: true,
      },
      {
        name: 'Lợi nhuận',
        sortable: true,
        selector: (row) => row.loi_nhuan,
        format: (row) => numeralCustom(row.loi_nhuan).format(),
        right: true,
      },
    ],
    convertData(data) {
      const result = [];
      const res = data.reduce(
        (acc, item) => {
          return {
            time: `${item.ngay}/${item.thang}/${item.nam}`,
            so_don: acc.so_don + 1,
            t_tien_hang: acc.t_tien_hang + item.t_tien_hang,
            t_tien_ck: acc.t_tien_ck + item.t_tien_ck,
            phi_nen_tang: acc.phi_nen_tang + item.phi_nen_tang,
            t_chi_phi: acc.t_chi_phi + item.t_chi_phi,
            loi_nhuan: acc.loi_nhuan + item.loi_nhuan,
          };
        },
        {
          time: '',
          so_don: 0,
          t_tien_hang: 0,
          t_tien_ck: 0,
          phi_nen_tang: 0,
          t_chi_phi: 0,
          loi_nhuan: 0,
        }
      );
      result.push(res);
      return result;
    },
  },
  thisweek: {
    title: 'tuần này',
    chartField: 'loi_nhuan',
    labelField: 'time',
    showChart: true,
    api: 'pbl',
    columns: [
      {
        name: 'Ngày',
        sortable: true,
        selector: (row) => row.time,
        width: '120px',
      },
      {
        name: 'Số đơn',
        sortable: true,
        selector: (row) => row.so_don,
        center: true,
      },
      {
        name: 'Tiền hàng',
        sortable: true,
        selector: (row) => row.t_tien_hang,
        format: (row) => numeralCustom(row.t_tien_hang).format(),
        center: true,
      },
      {
        name: 'Tiền chiết khấu',
        sortable: true,
        selector: (row) => row.t_tien_ck,
        format: (row) => numeralCustom(row.t_tien_ck).format(),
        minWidth: '140px',
        center: true,
      },
      {
        name: 'Phí nền tảng',
        sortable: true,
        selector: (row) => row.phi_nen_tang,
        format: (row) => numeralCustom(row.phi_nen_tang).format(),
        center: true,
      },
      {
        name: 'Giá vốn',
        sortable: true,
        selector: (row) => row.t_chi_phi,
        format: (row) => numeralCustom(row.t_chi_phi).format(),
        center: true,
      },
      {
        name: 'Lợi nhuận',
        sortable: true,
        selector: (row) => row.loi_nhuan,
        format: (row) => numeralCustom(row.loi_nhuan).format(),
        right: true,
      },
    ],
    convertData(data) {
      const result = [];
      const total = {
        time: 'Tổng cộng',
        so_don: 0,
        t_tien_hang: 0,
        t_tien_ck: 0,
        phi_nen_tang: 0,
        t_chi_phi: 0,
        loi_nhuan: 0,
      };
      const dataGrouped = groupBy({
        data,
        callbackMatch: (item) => {
          return `${item.ngay}/${item.thang}/${item.nam}`;
        },
      });
      dataGrouped.forEach((group) => {
        const res = group.reduce(
          (acc, item) => {
            return {
              time: `${item.ngay}/${item.thang}/${item.nam}`,
              so_don: acc.so_don + 1,
              t_tien_hang: acc.t_tien_hang + item.t_tien_hang,
              t_tien_ck: acc.t_tien_ck + item.t_tien_ck,
              phi_nen_tang: acc.phi_nen_tang + item.phi_nen_tang,
              t_chi_phi: acc.t_chi_phi + item.t_chi_phi,
              loi_nhuan: acc.loi_nhuan + item.loi_nhuan,
            };
          },
          {
            time: '',
            so_don: 0,
            t_tien_hang: 0,
            t_tien_ck: 0,
            phi_nen_tang: 0,
            t_chi_phi: 0,
            loi_nhuan: 0,
          }
        );
        total.so_don += res.so_don;
        total.t_tien_hang += res.t_tien_hang;
        total.t_tien_ck += res.t_tien_ck;
        total.phi_nen_tang += res.phi_nen_tang;
        total.t_chi_phi += res.t_chi_phi;
        total.loi_nhuan += res.loi_nhuan;
        result.push(res);
      });
      result.push(total);
      return result;
    },
  },
  thismonth: {
    title: 'tháng này',
    chartField: 'loi_nhuan',
    labelField: 'time',
    showChart: false,
    api: 'pbl',
    columns: [
      {
        name: 'Thời gian',
        sortable: true,
        selector: (row) => row.time,
        width: '120px',
      },
      {
        name: 'Số đơn',
        sortable: true,
        selector: (row) => row.so_don,
        center: true,
      },
      {
        name: 'Tiền hàng',
        sortable: true,
        selector: (row) => row.t_tien_hang,
        format: (row) => numeralCustom(row.t_tien_hang).format(),
        center: true,
      },
      {
        name: 'Tiền chiết khấu',
        sortable: true,
        selector: (row) => row.t_tien_ck,
        format: (row) => numeralCustom(row.t_tien_ck).format(),
        minWidth: '140px',
        center: true,
      },
      {
        name: 'Phí nền tảng',
        sortable: true,
        selector: (row) => row.phi_nen_tang,
        format: (row) => numeralCustom(row.phi_nen_tang).format(),
        center: true,
      },
      {
        name: 'Giá vốn',
        sortable: true,
        selector: (row) => row.t_chi_phi,
        format: (row) => numeralCustom(row.t_chi_phi).format(),
        center: true,
      },
      {
        name: 'Lợi nhuận',
        sortable: true,
        selector: (row) => row.loi_nhuan,
        format: (row) => numeralCustom(row.loi_nhuan).format(),
        right: true,
      },
    ],
    convertData(data) {
      const result = [];
      const res = data.reduce(
        (acc, item) => {
          return {
            time: `Tháng ${item.thang}/${item.nam}`,
            so_don: acc.so_don + 1,
            t_tien_hang: acc.t_tien_hang + item.t_tien_hang,
            t_tien_ck: acc.t_tien_ck + item.t_tien_ck,
            phi_nen_tang: acc.phi_nen_tang + item.phi_nen_tang,
            t_chi_phi: acc.t_chi_phi + item.t_chi_phi,
            loi_nhuan: acc.loi_nhuan + item.loi_nhuan,
          };
        },
        {
          time: '',
          so_don: 0,
          t_tien_hang: 0,
          t_tien_ck: 0,
          phi_nen_tang: 0,
          t_chi_phi: 0,
          loi_nhuan: 0,
        }
      );
      result.push(res);
      return result;
    },
  },
  '30daysago': {
    title: '30 ngày qua',
    chartField: 'loi_nhuan',
    labelField: 'time',
    showChart: true,
    api: 'pbl',
    columns: [
      {
        name: 'Thời gian',
        sortable: true,
        selector: (row) => row.time,
        width: '120px',
      },
      {
        name: 'Số đơn',
        sortable: true,
        selector: (row) => row.so_don,
        center: true,
      },
      {
        name: 'Tiền hàng',
        sortable: true,
        selector: (row) => row.t_tien_hang,
        format: (row) => numeralCustom(row.t_tien_hang).format(),
        minWidth: '140px',
        center: true,
      },
      {
        name: 'Tiền chiết khấu',
        sortable: true,
        selector: (row) => row.t_tien_ck,
        format: (row) => numeralCustom(row.t_tien_ck).format(),
        center: true,
      },
      {
        name: 'Phí nền tảng',
        sortable: true,
        selector: (row) => row.phi_nen_tang,
        format: (row) => numeralCustom(row.phi_nen_tang).format(),
        center: true,
      },
      {
        name: 'Giá vốn',
        sortable: true,
        selector: (row) => row.t_chi_phi,
        format: (row) => numeralCustom(row.t_chi_phi).format(),
        center: true,
      },
      {
        name: 'Lợi nhuận',
        sortable: true,
        selector: (row) => row.loi_nhuan,
        format: (row) => numeralCustom(row.loi_nhuan).format(),
        right: true,
      },
    ],
    convertData(data) {
      const result = [];
      const total = {
        time: 'Tổng cộng',
        so_don: 0,
        t_tien_hang: 0,
        t_tien_ck: 0,
        phi_nen_tang: 0,
        t_chi_phi: 0,
        loi_nhuan: 0,
      };
      const dataGrouped = groupBy({
        data,
        callbackMatch: (item) => {
          return `${item.thang}/${item.nam}`;
        },
      });
      dataGrouped.forEach((group) => {
        const res = group.reduce(
          (acc, item) => {
            return {
              time: `Tháng ${item.thang}/${item.nam}`,
              so_don: acc.so_don + 1,
              t_tien_hang: acc.t_tien_hang + item.t_tien_hang,
              t_tien_ck: acc.t_tien_ck + item.t_tien_ck,
              phi_nen_tang: acc.phi_nen_tang + item.phi_nen_tang,
              t_chi_phi: acc.t_chi_phi + item.t_chi_phi,
              loi_nhuan: acc.loi_nhuan + item.loi_nhuan,
            };
          },
          {
            time: '',
            so_don: 0,
            t_tien_hang: 0,
            t_tien_ck: 0,
            phi_nen_tang: 0,
            t_chi_phi: 0,
            loi_nhuan: 0,
          }
        );
        total.so_don += res.so_don;
        total.t_tien_hang += res.t_tien_hang;
        total.t_tien_ck += res.t_tien_ck;
        total.phi_nen_tang += res.phi_nen_tang;
        total.t_chi_phi += res.t_chi_phi;
        total.loi_nhuan += res.loi_nhuan;
        result.push(res);
      });
      result.push(total);
      return result;
    },
  },
  thisquarter: {
    title: 'quý này',
    chartField: 'loi_nhuan',
    labelField: 'time',
    showChart: true,
    api: 'pbl',
    columns: [
      {
        name: 'Thời gian',
        sortable: true,
        selector: (row) => row.time,
        width: '120px',
      },
      {
        name: 'Số đơn',
        sortable: true,
        selector: (row) => row.so_don,
        center: true,
      },
      {
        name: 'Tiền hàng',
        sortable: true,
        selector: (row) => row.t_tien_hang,
        format: (row) => numeralCustom(row.t_tien_hang).format(),
        center: true,
      },
      {
        name: 'Tiền chiết khấu',
        sortable: true,
        selector: (row) => row.t_tien_ck,
        format: (row) => numeralCustom(row.t_tien_ck).format(),
        minWidth: '140px',
        center: true,
      },
      {
        name: 'Phí nền tảng',
        sortable: true,
        selector: (row) => row.phi_nen_tang,
        format: (row) => numeralCustom(row.phi_nen_tang).format(),
        center: true,
      },
      {
        name: 'Giá vốn',
        sortable: true,
        selector: (row) => row.t_chi_phi,
        format: (row) => numeralCustom(row.t_chi_phi).format(),
        center: true,
      },
      {
        name: 'Lợi nhuận',
        sortable: true,
        selector: (row) => row.loi_nhuan,
        format: (row) => numeralCustom(row.loi_nhuan).format(),
        right: true,
      },
    ],
    convertData(data) {
      const result = [];
      const total = {
        time: 'Tổng cộng',
        so_don: 0,
        t_tien_hang: 0,
        t_tien_ck: 0,
        phi_nen_tang: 0,
        t_chi_phi: 0,
        loi_nhuan: 0,
      };
      const dataGrouped = groupBy({
        data,
        callbackMatch: (item) => {
          return `${item.thang}/${item.nam}`;
        },
      });
      dataGrouped.forEach((group) => {
        const res = group.reduce(
          (acc, item) => {
            return {
              time: `Tháng ${item.thang}/${item.nam}`,
              so_don: acc.so_don + 1,
              t_tien_hang: acc.t_tien_hang + item.t_tien_hang,
              t_tien_ck: acc.t_tien_ck + item.t_tien_ck,
              phi_nen_tang: acc.phi_nen_tang + item.phi_nen_tang,
              t_chi_phi: acc.t_chi_phi + item.t_chi_phi,
              loi_nhuan: acc.loi_nhuan + item.loi_nhuan,
            };
          },
          {
            time: '',
            so_don: 0,
            t_tien_hang: 0,
            t_tien_ck: 0,
            phi_nen_tang: 0,
            t_chi_phi: 0,
            loi_nhuan: 0,
          }
        );
        total.so_don += res.so_don;
        total.t_tien_hang += res.t_tien_hang;
        total.t_tien_ck += res.t_tien_ck;
        total.phi_nen_tang += res.phi_nen_tang;
        total.t_chi_phi += res.t_chi_phi;
        total.loi_nhuan += res.loi_nhuan;
        result.push(res);
      });
      result.push(total);
      return result;
    },
  },
  thisyear: {
    title: 'năm nay',
    chartField: 'loi_nhuan',
    labelField: 'time',
    showChart: true,
    api: 'pbl',
    columns: [
      {
        name: 'Thời gian',
        sortable: true,
        selector: (row) => row.time,
        width: '120px',
      },
      {
        name: 'Số đơn',
        sortable: true,
        selector: (row) => row.so_don,
        center: true,
      },
      {
        name: 'Tiền hàng',
        sortable: true,
        selector: (row) => row.t_tien_hang,
        format: (row) => numeralCustom(row.t_tien_hang).format(),
        center: true,
      },
      {
        name: 'Tiền chiết khấu',
        sortable: true,
        selector: (row) => row.t_tien_ck,
        format: (row) => numeralCustom(row.t_tien_ck).format(),
        minWidth: '140px',
        center: true,
      },
      {
        name: 'Phí nền tảng',
        sortable: true,
        selector: (row) => row.phi_nen_tang,
        format: (row) => numeralCustom(row.phi_nen_tang).format(),
        center: true,
      },
      {
        name: 'Giá vốn',
        sortable: true,
        selector: (row) => row.t_chi_phi,
        format: (row) => numeralCustom(row.t_chi_phi).format(),
        center: true,
      },
      {
        name: 'Lợi nhuận',
        sortable: true,
        selector: (row) => row.loi_nhuan,
        format: (row) => numeralCustom(row.loi_nhuan).format(),
        right: true,
      },
    ],
    convertData(data) {
      const result = [];
      const total = {
        time: 'Tổng cộng',
        so_don: 0,
        t_tien_hang: 0,
        t_tien_ck: 0,
        phi_nen_tang: 0,
        t_chi_phi: 0,
        loi_nhuan: 0,
      };
      const dataGrouped = groupBy({
        data,
        callbackMatch: (item) => {
          return `${item.quy}/${item.nam}`;
        },
      });
      dataGrouped.forEach((group) => {
        const res = group.reduce(
          (acc, item) => {
            return {
              time: `Quý ${item.quy}/${item.nam}`,
              so_don: acc.so_don + 1,
              t_tien_hang: acc.t_tien_hang + item.t_tien_hang,
              t_tien_ck: acc.t_tien_ck + item.t_tien_ck,
              phi_nen_tang: acc.phi_nen_tang + item.phi_nen_tang,
              t_chi_phi: acc.t_chi_phi + item.t_chi_phi,
              loi_nhuan: acc.loi_nhuan + item.loi_nhuan,
            };
          },
          {
            time: '',
            so_don: 0,
            t_tien_hang: 0,
            t_tien_ck: 0,
            phi_nen_tang: 0,
            t_chi_phi: 0,
            loi_nhuan: 0,
          }
        );
        total.so_don += res.so_don;
        total.t_tien_hang += res.t_tien_hang;
        total.t_tien_ck += res.t_tien_ck;
        total.phi_nen_tang += res.phi_nen_tang;
        total.t_chi_phi += res.t_chi_phi;
        total.loi_nhuan += res.loi_nhuan;
        result.push(res);
      });
      result.push(total);
      return result;
    },
  },
};
timeConcerns.yesterday = cloneDeep(timeConcerns.today);
timeConcerns.yesterday.title = 'hôm qua';

timeConcerns.lastweek = cloneDeep(timeConcerns.thisweek);
timeConcerns.lastweek.title = 'tuần trước';

timeConcerns['7daysago'] = cloneDeep(timeConcerns.thisweek);
timeConcerns['7daysago'].title = '7 ngày qua';

timeConcerns.lastmonth = cloneDeep(timeConcerns.thismonth);
timeConcerns.lastmonth.title = 'tháng trước';

timeConcerns.lastquarter = cloneDeep(timeConcerns.thisquarter);
timeConcerns.lastquarter.title = 'quý trước';

timeConcerns.lastyear = cloneDeep(timeConcerns.thisyear);
timeConcerns.lastyear.title = 'năm trước';

function FilterReportLoiNhuan({ setConcern, timeOption }) {
  const [valueConcern, setValueConcern] = useState(concerns[0].value);

  useEffect(() => {
    if (valueConcern === 'time') {
      if (timeOption) {
        setConcern(timeConcerns[timeOption.value]);
      } else {
        setConcern(timeConcerns.days);
      }
    } else {
      const newConcern = concerns.find((c) => c.value === valueConcern);
      setConcern(newConcern);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueConcern, timeOption]);

  return (
    <>
      <FilterRadios
        title="Mối quan tâm"
        values={concerns}
        defaultValue={concerns[0].value}
        onChange={setValueConcern}
      />
    </>
  );
}

export default FilterReportLoiNhuan;
