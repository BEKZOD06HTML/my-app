import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './pages/home/home';
import Kalendar from './components/kalendar/kalendar';
import Mijozlar from './pages/mijozlar/mijozlar';
import Detail from './pages/mijozlar/detail'; // Detail component import
import Debts from './pages/mijozlar/debts'; // Debts component import
import Settings from './pages/Settings';
import Profile from './pages/Settings/Profile';
import Help from './pages/Settings/Help';
import Feedback from './pages/Settings/Feedback';
import About from './pages/Settings/About';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// PrivateRoute component to protect routes that need authentication
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
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

          {/* Settings Routes */}
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings/security"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings/help"
            element={
              <PrivateRoute>
                <Help />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings/feedback"
            element={
              <PrivateRoute>
                <Feedback />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings/about"
            element={
              <PrivateRoute>
                <About />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings/terms"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings/privacy"
            element={
              <PrivateRoute>
                <Settings />
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
