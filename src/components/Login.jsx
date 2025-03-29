import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { loginMutation } = useAuth();
  const [formData, setFormData] = useState({
    login: '',
    hashed_password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await loginMutation.mutateAsync(formData);
    } catch (error) {
      setError(error.message || 'Kirishda xatolik yuz berdi');
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
              name="login"
              placeholder="Login"
              value={formData.login}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="hashed_password"
              placeholder="Parol"
              value={formData.hashed_password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
          <a href="#" className="forgot-password">Parolni unutdingizmi?</a>
          <button type="submit" className="login-button" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Kirish...' : 'Kirish'}
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