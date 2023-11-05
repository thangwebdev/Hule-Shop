import React from 'react';
import { Box } from '@mui/material';
import MenuStore from './MenuStore';
import ButtonOption from '~/components/button/ButtonOption';
import { FaUserCircle } from 'react-icons/fa';
import { TbLogout } from 'react-icons/tb';
import { logoutUser } from '~/redux/actions/auth.action';
import { useDispatch, useSelector } from 'react-redux';
import Themes from './Themes';
import { useGlobalTheme } from '~/context/themeContext';

function HeaderActions({ isAdmin }) {
  const { auth } = useSelector((state) => state);
  const [, setThemeId] = useGlobalTheme();
  const dispath = useDispatch();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <MenuStore isAdmin={isAdmin} />
      <Themes />
      <ButtonOption
        style={{ borderRadius: '4px' }}
        endIcon={<FaUserCircle fontSize="14px" />}
        menuWidth="200px"
        popupOptions={[
          {
            text: 'Đăng xuất',
            startIcon: <TbLogout fontSize="14px" />,
            onClick: () => logoutUser(dispath, setThemeId),
          },
        ]}
      >
        {auth.login?.user?.user?.email || 'email@gmail.com'}
      </ButtonOption>
    </Box>
  );
}

export default HeaderActions;
