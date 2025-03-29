import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src="./assets/img/logo.svg" alt="Logo" className="logo" />
        <span className="username">{user.username || 'Foydalanuvchi'}</span>
      </div>
      <div className="header-right">
        <nav className="nav-links">
          <Link to="/home" className={`nav-link ${isActive('/home') ? 'active' : ''}`}>
            <img src="./assets/icon/Home.svg" alt="Home" className="nav-icon" />
          </Link>
          <Link to="/mijozlar" className={`nav-link ${isActive('/mijozlar') ? 'active' : ''}`}>
            <img src="./assets/icon/mijozlar.svg" alt="Mij" className="nav-icon" />
          </Link>
          <Link to="/hisobot" className={`nav-link ${isActive('/hisobot') ? 'active' : ''}`}>
            <img src="./assets/icon/hisobot.svg" alt="t" className="nav-icon" />
          </Link>
          <Link to="/sozlamalar" className={`nav-link ${isActive('/sozlamalar') ? 'active' : ''}`}>
            <img src="./assets/icon/soslamalar.svg" alt="" className="nav-icon" />
          </Link>
          <Link to="/kalendar" className={`nav-link ${isActive('/kalendar') ? 'active' : ''}`}>
            <img src="./assets/icon/kalendar.svg" alt="Kalendar" className="nav-icon" />
          </Link>
          <button onClick={handleLogout} className="logout-button">
            Chiqish
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;