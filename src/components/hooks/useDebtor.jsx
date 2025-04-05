import { useEffect, useState } from "react";
import API from "../../services/API";

const useDebtor = () => {
  const [debtors, setDebtors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const LOCAL_STORAGE_KEY = "localDebtors";

  const getLocalDebtors = () => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  const updateLocalDebtors = (newDebtors) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newDebtors));
  };

  useEffect(() => {
    const fetchDebtors = async () => {
      try {
        const response = await API.get("/debtor?spik=0&take=10");
        const apiDebtors = Array.isArray(response.data?.data) ? response.data.data : [];
        const localDebtors = getLocalDebtors();
        setDebtors([...apiDebtors, ...localDebtors]);
      } catch (err) {
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchDebtors();
  }, []);

  const addDebtor = async (debtorData) => {
    try {
      const newDebtor = {
        id: Date.now(),
        full_name: debtorData.get("full_name"),
        address: debtorData.get("address") || "",
        comment: debtorData.get("comment") || "",
        phone_numbers: debtorData.get("phone_numbers")
          ? debtorData.get("phone_numbers").split(",")
          : [],
        images: [],
        debts: []
      };

      const localDebtors = getLocalDebtors();
      const updatedLocalDebtors = [...localDebtors, newDebtor];
      updateLocalDebtors(updatedLocalDebtors);
      setDebtors((prev) => [...prev, newDebtor]);

      return newDebtor;
    } catch (err) {
      throw new Error("Qarzdorni qo'shishda xatolik yuz berdi");
    }
  };

  const refetch = () => {
    setLoading(true);
    API.get("/debtor?spik=0&take=10")
      .then((response) => {
        const apiDebtors = Array.isArray(response.data?.data) ? response.data.data : [];
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
