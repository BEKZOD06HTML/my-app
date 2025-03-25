import React, { useState } from 'react';
import Header from '../../components/header/header';
import './home.css';

const Home = () => {
  const [showAmount, setShowAmount] = useState(false);

  const toggleAmount = () => {
    setShowAmount(!showAmount);
  };

  return (
    <div className="home-container">
      <Header />
      <main className="main-content">
        <div className="balance-section">
          <div className="balance-card">
            <div className="balance-title">
              <h2>Umumiy nasiya:</h2>
              <button className="eye-button" onClick={toggleAmount}>
                <img 
                  src={showAmount ? "./assets/icon/Hide.svg" : "./assets/icon/Show.svg"}
                  
                  className="toggle-icon"
                />
              </button>
            </div>
            <div className="balance-amount">
              {showAmount ? '151,500,000' : '**********'} so'm
            </div>
          </div>
        </div>

        <div className="stats-section">
          <div className="stats-card">
            <p>Mijozlar soni</p>
            <span className="clients-count">151 ta</span>
          </div>
          <div className="stats-card">
            <p>Kechiktirilgan to'lovlar</p>
            <span className="delayed-payments">26 ta</span>
          </div>
        </div>

        <div className="wallet-section">
          <h2>Hamyoningiz</h2>
          <div className="wallet-card">
            <span className="wallet-img">
              <img src="./assets/icon/Wallet.svg" alt="" />
              <p>Hisobingizda</p>
            </span>
            <span className="wallet-amount">300 000 so'm</span>
            <button className="add-money">+</button>
          </div>
          <p className="payment-status">Bu oy uchun to'lov: <span className="paid">To'lov qilingan</span></p>
        </div>
      </main>
    </div>
  );
};

export default Home;
