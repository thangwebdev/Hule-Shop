import React from 'react';
import { Box, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import styled from 'styled-components';
import ButtonOption from '~/components/button/ButtonOption';
import {
  HiOutlineViewGridAdd,
  HiOutlineDocumentText,
  HiOutlineCurrencyDollar,
} from 'react-icons/hi';
import {
  BsBoxSeam,
  BsGrid3X3,
  BsBoxArrowInDown,
  BsBarChartLine,
  BsPlusSlashMinus,
} from 'react-icons/bs';
import { BiCoinStack, BiListCheck, BiTransferAlt } from 'react-icons/bi';
import {
  AiOutlineDeploymentUnit,
  AiOutlineLineChart,
  AiOutlinePieChart,
} from 'react-icons/ai';
import { useLocation, useNavigate } from 'react-router-dom';
import { TbFileInvoice } from 'react-icons/tb';
import { VscTelescope } from 'react-icons/vsc';

function MenuBar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <MenuBarWrapper bgColor={theme.palette.primary.second}>
      <Container maxWidth="xl" sx={{ height: '100%' }}>
        <MenuBarContainer>
          <ButtonOption
            active={location.pathname === '/'}
            style={{ borderRadius: '4px' }}
            primary
            startIcon={<HiOutlineViewGridAdd fontSize="16px" />}
            onClick={() => navigate('/')}
          >
            Tổng quan
          </ButtonOption>
          <ButtonOption
            style={{ borderRadius: '4px' }}
            primary
            startIcon={<BsBoxSeam fontSize="16px" />}
            menuColor={theme.palette.primary.second}
            active={['/list/dmvt', '/list/dmdvt', '/list/dmkb'].includes(
              location.pathname
            )}
            popupOptions={[
              {
                text: 'Danh sách hàng hóa',
                startIcon: <BsGrid3X3 fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/dmvt'),
                active: location.pathname.indexOf('dmvt') >= 0,
              },
              {
                text: 'Đơn vị tính',
                startIcon: <AiOutlineDeploymentUnit fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/dmdvt'),
                active: location.pathname.indexOf('dmdvt') >= 0,
              },
              {
                text: 'Kênh bán hàng',
                startIcon: <VscTelescope fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/dmkb'),
                active: location.pathname.indexOf('dmkb') >= 0,
              },
            ]}
          >
            Hàng hóa
          </ButtonOption>
          <ButtonOption
            style={{ borderRadius: '4px' }}
            primary
            startIcon={<BiTransferAlt fontSize="16px" />}
            menuColor={theme.palette.primary.second}
            active={['/list/pnk', '/list/pxk', '/list/pbl'].includes(
              location.pathname
            )}
            popupOptions={[
              {
                text: 'Nhập kho',
                startIcon: <BsBoxArrowInDown fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/pnk'),
                active: location.pathname.indexOf('pnk') >= 0,
              },
              {
                text: 'Xuất kho',
                startIcon: <HiOutlineDocumentText fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/pxk'),
                active: location.pathname.indexOf('pxk') >= 0,
              },
              {
                text: 'Kiểm kho',
                startIcon: <BiListCheck fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/pkk'),
                active: location.pathname.indexOf('pkk') >= 0,
              },
              {
                text: 'Phiếu bán lẻ',
                startIcon: <TbFileInvoice fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/pbl'),
                active: location.pathname.indexOf('pbl') >= 0,
              },
            ]}
          >
            Giao dịch
          </ButtonOption>
          <ButtonOption
            style={{ borderRadius: '4px' }}
            primary
            startIcon={<HiOutlineCurrencyDollar fontSize="16px" />}
            menuColor={theme.palette.primary.second}
            active={['/list/soquy', '/report/soquy'].includes(
              location.pathname
            )}
            popupOptions={[
              {
                text: 'Phiếu thu chi',
                startIcon: <BsPlusSlashMinus fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/list/soquy'),
                active: location.pathname.indexOf('/list/soquy') >= 0,
              },
              {
                text: 'Báo cáo sổ quỹ',
                startIcon: <BiCoinStack fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/report/soquy'),
                active: location.pathname.indexOf('/report/soquy') >= 0,
              },
            ]}
          >
            Sổ quỹ
          </ButtonOption>
          <ButtonOption
            style={{ borderRadius: '4px' }}
            primary
            startIcon={<AiOutlinePieChart fontSize="16px" />}
            menuColor={theme.palette.primary.second}
            active={['/report/doanhthu', '/report/loinhuan'].includes(
              location.pathname
            )}
            popupOptions={[
              {
                text: 'Báo cáo doanh thu',
                startIcon: <BsBarChartLine fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/report/doanhthu'),
                active: location.pathname.indexOf('/report/doanhthu') >= 0,
              },
              {
                text: 'Báo cáo lợi nhuận',
                startIcon: <AiOutlineLineChart fontSize="14px" />,
                primary: true,
                onClick: () => navigate('/report/loinhuan'),
                active: location.pathname.indexOf('/report/loinhuan') >= 0,
              },
            ]}
          >
            Báo cáo
          </ButtonOption>
        </MenuBarContainer>
      </Container>
    </MenuBarWrapper>
  );
}

export default MenuBar;

const MenuBarWrapper = styled.div`
  height: 42px;
  background-color: ${(props) => props.bgColor};
`;
const MenuBarContainer = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  gap: 10px;
`;
