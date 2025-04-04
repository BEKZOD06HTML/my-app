import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './pages/home/home';
import Kalendar from './components/kalendar/kalendar';
import Mijozlar from './pages/mijozlar/mijozlar';
import Detail from './pages/mijozlar/detail'; // Detail komponentini import qilamiz
// import Hisobot from './pages/hisobot/hisobot';
// import Sozlamalar from './pages/sozlamalar/sozlamalar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/mijozlar"
            element={
              <PrivateRoute>
                <Mijozlar />
              </PrivateRoute>
            }
          />
          <Route
            path="/kalendar"
            element={
              <PrivateRoute>
                <Kalendar />
              </PrivateRoute>
            }
          />
          {/* Yangi qo'shilgan marshrut: "/customer/:id" */}
          <Route
            path="/customer/:id"
            element={
              <PrivateRoute>
                <Detail />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
