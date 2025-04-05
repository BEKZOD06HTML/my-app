import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './pages/home/home';
import Kalendar from './components/kalendar/kalendar';
import Mijozlar from './pages/mijozlar/mijozlar';
import Detail from './pages/mijozlar/detail'; // Detail component import
import Debts from './pages/mijozlar/debts'; // Debts component import
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// PrivateRoute component to protect routes that need authentication
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Check for token in localStorage
  return token ? children : <Navigate to="/login" />; // If token exists, render children; otherwise, redirect to login
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Private Routes */}
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
          
          {/* Debts Route */}
          <Route
            path="/debts"
            element={
              <PrivateRoute>
                <Debts />
              </PrivateRoute>
            }
          />

          {/* Calendar Route */}
          <Route
            path="/kalendar"
            element={
              <PrivateRoute>
                <Kalendar />
              </PrivateRoute>
            }
          />

          {/* Customer Detail Route */}
          <Route
            path="/customer/:id"
            element={
              <PrivateRoute>
                <Detail />
              </PrivateRoute>
            }
          />

          {/* Default Route (redirect to login) */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
