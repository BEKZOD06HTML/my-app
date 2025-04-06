import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  StarFilled,
  StarOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
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
  const totalDebt = passedTotalDebt !== undefined ? passedTotalDebt : computedTotalDebt;

  const { data: debts, refetch } = useQuery({
    queryKey: ["debts", id],
    queryFn: async () => {
      try {
        const { data } = await API.get(`/debts?debtor_id=${id}`);
        console.log("API dan olingan nasiyalar:", data.data);
        return data.data;
      } catch (error) {
        console.error("Nasiyalarni olishda xatolik:", error);
        return [];
      }
    },
    enabled: !!id,
  });

  const { mutate: createDebt } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await API.post("/debts", formData);
        return res.data.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      toast.success("Qarz muvaffaqiyatli qo'shildi!");
      await refetch(); // Yangi nasiyani olish
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error("Xatolik:", error);
      toast.error("Xatolik yuz berdi!");
    },
  });

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

        <h4 className="detail-active-title">Faol nasiyalar</h4>

        {debts && debts.length > 0 ? (
          debts.map((debt) => {
            const individualDebt = parseFloat(debt.debt_sum || 0);
            const percent = totalDebt > 0 ? (individualDebt / totalDebt) * 100 : 0;
            return (
              <div className="detail-debt-card" key={debt.id}>
                <div className="detail-debt-info">
                  <p className="detail-product-name">{debt.product_name}</p>
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
                  <p>Muddat: {debt.debt_period} oy</p>
                  <p>Umumiy summa: {Number(debt.total_debt_sum).toLocaleString("uz-UZ")} so'm</p>
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

        <button className="detail-add-btn" onClick={() => setIsModalOpen(true)}>
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
