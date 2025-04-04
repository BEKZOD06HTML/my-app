import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Header from '../../components/header/header';
import './Kalendar.css';

const Kalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="kalendar-container">
      <Header />
      <main className="kalendar-content">
        <div className="calendar-card">
          <div className="calendar-header">
            <h2>Kalendar</h2>
          </div>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd.MM.yyyy"
            className="custom-datepicker"
            inline
          />
        </div>
      </main>
    </div>
  );
};

export default Kalendar;
