import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import AuthRoutes from './pages/Auth';
import Home from './pages/Home/Home';
import Board from './pages/Board/Board';
import './App.scss';

function PrivateRoute() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
}

export default function App() {
  return (
    <Router>
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
