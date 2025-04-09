import React, { useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useStore from '../hooks/useStore';
import './header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { user, fetchUser } = useStore();

  useEffect(() => {
    console.log("Header mounted. Local user:", user);
    if (!user) {
      console.log("Foydalanuvchi mavjud emas");
      fetchUser();
    }
  }, [user, fetchUser]);

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-left">
        <img src="./assets/img/logo.svg" className="logo" />
        <span className="username">
          {user ? user.username : 'Foydalanuvchi'}
        </span>
      </div>
      <div className="header-right">
        <nav className="nav-links">
          <Link to="/home" className={`nav-link ${isActive('/home') ? 'active' : ''}`}>
            <img src="./assets/icon/Home.svg" className="nav-icon" />
          </Link>
          <Link to="/mijozlar" className={`nav-link ${isActive('/mijozlar') ? 'active' : ''}`}>
            <img src="./assets/icon/mijozlar.svg" className="nav-icon" />
          </Link>
          <Link to="/hisobot" className={`nav-link ${isActive('/hisobot') ? 'active' : ''}`}>
            <img src="./assets/icon/hisobot.svg" className="nav-icon" />
          </Link>
          <Link to="/settings" className={`nav-link ${isActive('/settings') ? 'active' : ''}`}>
            <img src="./assets/icon/sozlamalar.svg" className="nav-icon" />
          </Link>
          <Link to="/kalendar" className={`nav-link ${isActive('/kalendar') ? 'active' : ''}`}>
            <img src="./assets/icon/kalendar.svg" className="nav-icon" />
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
