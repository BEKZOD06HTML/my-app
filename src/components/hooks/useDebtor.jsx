import { useEffect, useState } from "react";
import API from "../../services/API";

const useDebtor = () => {
  const [debtors, setDebtors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDebtors = async () => {
      try {
        const response = await API.get("/debtor?spik=0&take=10");
        setDebtors(Array.isArray(response.data?.data) ? response.data.data : []);
      } catch {
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchDebtors();
  }, []);

  return { debtors, loading, error };
};

export default useDebtor;
