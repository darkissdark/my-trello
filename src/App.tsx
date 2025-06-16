import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Board } from './pages/Board/Board';
import { Home } from './pages/Home/Home';
import './App.scss';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/board/:boardId" element={<Board />} />
          <Route path="/board/:boardId/card/:cardId" element={<Board />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
