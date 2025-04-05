import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message, Alert } from "antd";
import {
  SearchOutlined,
  StarFilled,
  StarOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

import Header from "../../components/header/header";
import useDebtor from "../../components/hooks/useDebtor";
import AddDebtorModal from "./modal";
import "./mijozlar.css";

const Mijozlar = () => {
  const { debtors, error, addDebtor, refetch, loading } = useDebtor();
  const [favorites, setFavorites] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAddDebtor = async (debtorData) => {
    try {
      await addDebtor(debtorData);
      message.success("Qarzdor muvaffaqiyatli qo'shildi!");
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      message.error("Qarzdorni qo'shishda xatolik yuz berdi.");
    }
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="clients-section">
      <Header />

      <div className="clients-container">
        
        <div className="clients-search">
          <form className="clients-search-form">
            <input type="text" placeholder="Mijozlarni qidirish..." />
            <SearchOutlined className="clients-search-icon" />
          </form>
        </div>

        {error ? (
          <Alert message={error} type="error" />
        ) : (
          <div className="clients-list">
            {Array.isArray(debtors) && debtors.length > 0 ? (
              debtors.map((customer) => {
                const totalDebt = customer.debts.reduce(
                  (sum, debt) => sum + parseFloat(debt.debt_sum || "0"),
                  0
                );
                return (
                  <div
                    key={customer.id}
                    className="client-card"
                    onClick={() =>
                      navigate(`/customer/${customer.id}`, {
                        state: { totalDebt },
                      })
                    }
                  >
                    <div className="client-info">
                      <h3 className="client-name">{customer.full_name}</h3>
                      <p className="client-phone">
                        {customer.phone_numbers.length > 0
                          ? customer.phone_numbers[0].number
                          : "Telefon raqami yo'q"}
                      </p>
                      <p className="client-debt-label">Jami nasiya:</p>
                      <p
                        className={`client-debt ${
                          totalDebt < 0 ? "negative" : "positive"
                        }`}
                      >
                        {totalDebt.toLocaleString("uz-UZ")} so'm
                      </p>
                    </div>
                    <div
                      className="client-favorite"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(customer.id);
                      }}
                    >
                      {favorites[customer.id] ? (
                        <StarFilled className="icon-star active" />
                      ) : (
                        <StarOutlined className="icon-star" />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p>Mijoz topilmadi.</p>
            )}
          </div>
        )}

        <button
          className="client-add-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <UserAddOutlined />
          Yaratish
        </button>
      </div>

      <AddDebtorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddDebtor={handleAddDebtor}
      />
    </section>
  );
};

export default Mijozlar;
