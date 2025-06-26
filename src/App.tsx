import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { logout } from './store/slices/authSlice';
import AuthRoutes from './pages/Auth';
import Home from './pages/Home/Home';
import Board from './pages/Board/Board';
import './App.scss';

function PrivateRoute() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
}

function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <button
      className="button blue logOut"
      onClick={() => {
        dispatch(logout());
        navigate('/auth/login');
      }}
    >
      Вийти
    </button>
  );
}

export default function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return (
    <Router basename="/my-trello">
      {isAuthenticated && <LogoutButton />}
      <Routes>
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/board/:boardId" element={<Board />} />
          <Route path="/board/:boardId/card/:cardId" element={<Board />} />
        </Route>
      </Routes>
    </Router>
  );
}
