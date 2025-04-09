import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  StarFilled,
  StarOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../../services/API";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import "./detail.css";
import NasiyaModal from './NasiyaModal';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [favorite, setFavorite] = useState(false);
  const [debtor, setDebtor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchDebtor = async () => {
      try {
        const res = await API.get(`/debtor/${id}`);
        if (res.data && res.data.data) {
          setDebtor(res.data.data);
        } else {
          fetchLocalDebtor();
        }
      } catch (err) {
        console.error("API xatoligi:", err);
        fetchLocalDebtor();
      }
    };

    const fetchLocalDebtor = () => {
      const localDebtors = localStorage.getItem("localDebtors");
      if (localDebtors) {
        const parsedDebtors = JSON.parse(localDebtors);
        const foundDebtor = parsedDebtors.find(
          (item) => String(item.id) === String(id)
        );
        if (foundDebtor) {
          setDebtor(foundDebtor);
        }
      }
    };

    fetchDebtor();
  }, [id]);

  const passedTotalDebt = location.state?.totalDebt;
  const computedTotalDebt = debtor?.debts?.reduce(
    (sum, d) => sum + parseFloat(d.debt_sum || 0),
    0
  );
  const totalDebt = passedTotalDebt !== undefined ? passedTotalDebt : computedTotalDebt || 0;

  const { data: debts = [], refetch, isLoading } = useQuery({
    queryKey: ["debts", id],
    queryFn: async () => {
      try {
        const response = await API.get(`/debts`, {
          params: { debtor_id: id }
        });
        console.log("API dan olingan nasiyalar:", response.data?.data);
        return response.data?.data || [];
      } catch (error) {
        console.error("Nasiyalarni olishda xatolik:", error);
        toast.error("Nasiyalarni yuklashda xatolik yuz berdi");
        return [];
      }
    },
    enabled: !!id,
    retry: 1,
    staleTime: 0,
    refetchOnWindowFocus: true
  });

  const { mutate: createDebt, isLoading: isCreating } = useMutation({
    mutationFn: async (formData) => {
      try {
        // product_name va debtor_id ni tashlaymiz
        const { product_name, debtor_id, ...cleanData } = formData;
        
        // debt_sum va total_debt_sum ni to'g'ri formatda yuboramiz
        if (cleanData.debt_sum) {
          cleanData.debt_sum = parseFloat(cleanData.debt_sum.toFixed(2));
        }

        if (cleanData.total_debt_sum) {
          cleanData.total_debt_sum = parseFloat(cleanData.total_debt_sum.toFixed(2));
        }
        
        // Juda katta sonlarni tekshirish
        if (cleanData.debt_sum > 1000000000 || cleanData.total_debt_sum > 1000000000) {
          throw new Error("Qarz summasi juda katta (1 milliarddan katta). Iltimos, kichikroq summa kiriting.");
        }
        
        console.log("API ga yuborilayotgan ma'lumotlar:", cleanData);
        
        // debtor_id ni body ga qo'shamiz
        cleanData.debtor_id = id;
        
        // To'g'ridan-to'g'ri POST so'rovi yuboramiz
        const res = await API.post("/debts", cleanData);
        
        console.log("API dan kelgan javob:", res.data);
        return res.data.data;
      } catch (error) {
        console.error("Qarz yaratishda xatolik:", error.response?.data || error);
        throw error;
      }
    },
    onSuccess: async (newDebt) => {
      toast.success("Qarz muvaffaqiyatli qo'shildi!");
      
      // Cache ni yangilash
      queryClient.setQueryData(["debts", id], (oldDebts = []) => {
        console.log("Yangi qarz qo'shildi:", newDebt);
        // Yangi yaratilgan qarzni old debts arrayga qo'shamiz
        return [newDebt, ...(oldDebts || [])];
      });
      
      // Ma'lumotlarni qayta yuklash
      await refetch();
      
      // Modalni yopish
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error("Xatolik:", error);
      if (error.message) {
        toast.error(error.message);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Qarz yaratishda xatolik yuz berdi. Internet aloqangizni tekshiring.");
      }
    },
  });

  if (isLoading) {
    return <div className="detail-loading">Ma'lumotlar yuklanmoqda...</div>;
  }

  return (
    <section className="detail-section">
      <div className="detail-container">
        <div className="detail-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeftOutlined /> Ortga
        </div>

        <div className="detail-header">
          <h2>{debtor?.full_name}</h2>
          <div onClick={() => setFavorite(!favorite)}>
            {favorite ? (
              <StarFilled style={{ color: "gold", fontSize: "24px" }} />
            ) : (
              <StarOutlined style={{ color: "#ccc", fontSize: "24px" }} />
            )}
          </div>
        </div>

        <div className="detail-total-debt">
          <p>Umumiy nasiya:</p>
          <h3>{totalDebt?.toLocaleString("uz-UZ")} so'm</h3>
        </div>

        <h4 className="detail-active-title">Faol nasiyalar ({debts?.length || 0})</h4>

        {debts && debts.length > 0 ? (
          debts.map((debt) => {
            const individualDebt = parseFloat(debt.debt_sum || 0);
            const percent = totalDebt > 0 ? (individualDebt / totalDebt) * 100 : 0;
            return (
              <div className="detail-debt-card" key={debt.id}>
                <div className="detail-debt-info">
                  <p className="detail-debt-date">
                    {dayjs(debt.created_at).format("YYYY-MM-DD")}
                  </p>
                </div>
                <div className="detail-debt-progress">
                  <div
                    className="detail-progress-bar"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <div className="detail-payment-info">
                  <p>Keyingi to'lov: {debt.next_payment_date || "No data"}</p>
                  <p>Muddat: {debt.debt_period || 0} oy</p>
                  <p>Umumiy summa: {Number(debt.total_debt_sum || 0).toLocaleString("uz-UZ")} so'm</p>
                  <p className={`client-debt ${individualDebt < 0 ? "negative" : "positive"}`}>
                    Oylik to'lov: {individualDebt.toLocaleString("uz-UZ")} so'm
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-debts">Hech qanday faol nasiya topilmadi</p>
        )}

        <button className="detail-add-btn" onClick={() => setIsModalOpen(true)} disabled={isCreating}>
          <PlusOutlined /> Yangi nasiya
        </button>
      </div>

      <NasiyaModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        debtorId={id}
        createDebt={createDebt}
      />
    </section>
  );
};

export default Detail;
