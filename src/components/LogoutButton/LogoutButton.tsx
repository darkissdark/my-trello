import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import styles from './LogoutButton.module.scss';

export const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  return (
    <button className={styles.logoutButton} onClick={handleLogout}>
      Вийти
    </button>
  );
}; 