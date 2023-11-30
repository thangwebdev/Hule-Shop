import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const savedMode = localStorage.getItem('mode');
  let { mode } = useParams();

  if (mode === 'viewer' && savedMode !== 'viewer') {
    localStorage.setItem('mode', 'viewer');
    window.location.reload();
  }

  const dataLogin = useSelector((state) => state.auth.login);
  const navigate = useNavigate();
  useEffect(() => {
    let savedModeLocal = savedMode;
    if (mode === 'viewer') {
      savedModeLocal = localStorage.getItem('mode');
    }
    if (!dataLogin?.user && savedModeLocal !== 'viewer') navigate('/login');
  }, [dataLogin?.user, navigate, savedMode, mode]);

  return <>{children}</>;
}
