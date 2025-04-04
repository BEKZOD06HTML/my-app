import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { StarFilled, StarOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import API from "../../services/API";
import "./detail.css";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [favorite, setFavorite] = useState(false);
  const [debtor, setDebtor] = useState(null);

  useEffect(() => {
    const fetchDebtor = async () => {
      try {
        const res = await API.get(`/debtor/${id}`);
        // Agar API dan kelgan ma'lumot mavjud bo'lsa, uni qo'llaymiz
        if (res.data && res.data.data) {
          setDebtor(res.data.data);
        } else {
          fetchLocalDebtor();
        }
      } catch (err) {
        console.error("API xatoligi:", err);
        // API chaqiruvida xatolik bo'lsa, localStorage'dan qidiramiz
        fetchLocalDebtor();
      }
    };

    // localStorage'dan qarzdorni topish (agar localDebtors kalitida saqlangan bo'lsa)
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

  // Agar state orqali totalDebt uzatilgan bo'lsa, undan foydalanamiz.
  const passedTotalDebt = location.state?.totalDebt;
  const computedTotalDebt = debtor?.debts?.reduce(
    (sum, d) => sum + parseFloat(d.debt_sum || 0),
    0
  );
  const totalDebt =
    passedTotalDebt !== undefined ? passedTotalDebt : computedTotalDebt;

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

        {debtor?.debts?.map((debt) => {
          const individualDebt = parseFloat(debt.debt_sum || 0);
          const percent = totalDebt > 0 ? (individualDebt / totalDebt) * 100 : 0;
          return (
            <div className="detail-debt-card" key={debt.id}>
              <p className="detail-debt-date">{debt.created_at}</p>
              <div className="detail-debt-progress">
                <div
                  className="detail-progress-bar"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <p>Keyingi to'lov: {debt.next_payment_date || "No data"}</p>
              <p
                className={`client-debt ${
                  individualDebt < 0 ? "negative" : "positive"
                }`}
              >
                {individualDebt.toLocaleString("uz-UZ")} so'm
              </p>
            </div>
          );
        })}
      </div>

      <button className="detail-add-btn">Qo'shish</button>
    </section>
  );
};

export default Detail;
