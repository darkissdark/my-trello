import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Board } from './pages/Board/Board';
import './App.scss';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div className="App">My Trello App</div>} />
        <Route path="/board" element={<Board />} />
      </Routes>
    </Router>
  );
}

export default App;
