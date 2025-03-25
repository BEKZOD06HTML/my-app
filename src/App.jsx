import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './pages/home/home';
import Kalendar from './pages/kalendar/kalendar';
// import Mijozlar from './pages/mijozlar/mijozlar';
// import Hisobot from './pages/hisobot/hisobot';
// import Sozlamalar from './pages/sozlamalar/sozlamalar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/mijozlar" element={<Mijozlar />} />
        <Route path="/hisobot" element={<Hisobot />} />
        <Route path="/sozlamalar" element={<Sozlamalar />} /> */}
        <Route path="/kalendar" element={<Kalendar />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
