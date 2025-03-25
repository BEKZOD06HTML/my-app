import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (formData.username === 'bekzod' && formData.password === '123456') {
      navigate('/home');
    } else {
      setError('Notogri username yoki parol!');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Kirish</h1>
        <p>Xush kelibsiz! Iltimos, tizimga kirish uchun ma'lumotlaringizni kiriting.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Parol"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
          <a href="#" className="forgot-password">Parolni unutdingizmi?</a>
          <button type="submit" className="login-button">
            Kirish
          </button>
        </form>
        <p className="register-text">
          Hisobingiz yo'qmi? <a href="/register">Ro'yxatdan o'tish</a>
        </p>
      </div>
    </div>
  );
};

export default Login; 