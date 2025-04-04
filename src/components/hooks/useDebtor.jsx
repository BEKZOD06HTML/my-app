import { useEffect, useState } from "react";
import API from "../../services/API";

const useDebtor = () => {
  const [debtors, setDebtors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // LocalStorage uchun kalit
  const LOCAL_STORAGE_KEY = "localDebtors";

  // LocalStorage'dan yaratilgan qarzdorlarni olish
  const getLocalDebtors = () => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  // LocalStorage'dagi qarzdorlarni yangilash
  const updateLocalDebtors = (newDebtors) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newDebtors));
  };

  // Ilk yuklanishda API va localStorage'dan ma'lumotlarni birlashtirish
  useEffect(() => {
    const fetchDebtors = async () => {
      try {
        // API dan kelgan foydalanuvchilar
        const response = await API.get("/debtor?spik=0&take=10");
        const apiDebtors = Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        // LocalStorage dan yaratilgan foydalanuvchilar
        const localDebtors = getLocalDebtors();

        // Ikkala ro'yxatni birlashtiramiz
        setDebtors([...apiDebtors, ...localDebtors]);
      } catch (err) {
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchDebtors();
  }, []);

  // Yangi qarzdor qo'shish (FormData orqali)
  const addDebtor = async (debtorData) => {
    try {
      // FormData'dan obyektga aylantiramiz
      const newDebtor = {
        id: Date.now(), // Yagona id (bu demo uchun; real loyihada serverdan olingan id bo'lishi mumkin)
        full_name: debtorData.get("full_name"),
        address: debtorData.get("address") || "",
        comment: debtorData.get("comment") || "",
        // Telefon raqamlarini vergul bo‘yicha ajratamiz
        phone_numbers: debtorData.get("phone_numbers")
          ? debtorData.get("phone_numbers").split(",")
          : [],
        images: [], // Keyinchalik qo‘shish mumkin
        debts: [] // Dastlab bo‘sh qarzdorliklar ro‘yhatini yaratiladi
      };

      // LocalStorage'dagi mavjud qarzdorlar ro'yxatini o‘qiymiz
      const localDebtors = getLocalDebtors();
      const updatedLocalDebtors = [...localDebtors, newDebtor];
      updateLocalDebtors(updatedLocalDebtors);

      // API dagi qarzdorlar ro'yxati bilan birlashtiramiz
      setDebtors((prev) => [...prev, newDebtor]);

      return newDebtor;
    } catch (err) {
      throw new Error("Qarzdorni qo'shishda xatolik yuz berdi");
    }
  };

  // Ro'yxatni qayta yuklash
  const refetch = () => {
    setLoading(true);
    // API dan ma'lumotlarni qayta olish va localStorage bilan birlashtirish
    API.get("/debtor?spik=0&take=10")
      .then((response) => {
        const apiDebtors = Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        const localDebtors = getLocalDebtors();
        setDebtors([...apiDebtors, ...localDebtors]);
      })
      .catch(() => {
        setError("Ma'lumotlarni qayta yuklashda xatolik yuz berdi");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { debtors, loading, error, addDebtor, refetch };
};

export default useDebtor;
