import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { StarFilled, StarOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import API from "../../services/API";
import { toast } from "react-toastify";
import dayjs from "dayjs";
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
  const totalDebt =
    passedTotalDebt !== undefined ? passedTotalDebt : computedTotalDebt;

  const { data: debts, refetch } = useQuery({
    queryKey: ["debts", id],
    queryFn: async () => {
      const { data } = await API.get(`/debts?debtor_id=${id}`);
      return data.data;
    },
  });

  const methods = useForm({
    defaultValues: {
      next_payment_date: "",
      debtor_period: "",
      debt_sum: "",
      total_debt_sum: "",
      description: "",
    },
  });

  const { mutate: createdDebt, isPending } = useMutation({
    mutationFn: async (formData) => {
      const res = await API.post("/debts", formData);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Debt added successfully!");
      refetch(); 
      methods.reset(); 
    },
    onError: (error) => {
      console.error("Server error:", error.response?.data);
      toast.error("Error adding debt!");
    },
  });

  const handleSubmit = (formValues) => {
    const formattedDate = dayjs(formValues.next_payment_date).format("YYYY-MM-DD");

    const newData = {
      next_payment_date: formattedDate,
      debtor_period: Number(formValues.debtor_period),
      debt_sum: Number(formValues.debt_sum),
      total_debt_sum: Number(formValues.total_debt_sum),
      description: formValues.description,
      debtor_id: id,
      debt_status: "active",
      images: [] // Placeholder for images
    };

    console.log("Submitting data:", newData);

    createdDebt(newData);
  };

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

        {debts?.map((debt) => {
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
              <p className={`client-debt ${individualDebt < 0 ? "negative" : "positive"}`}>
                {individualDebt.toLocaleString("uz-UZ")} so'm
              </p>
            </div>
          );
        })}

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <input
              type="date"
              {...methods.register("next_payment_date", { required: true })}
            />
            <input
              type="number"
              {...methods.register("debtor_period", { required: true })}
              placeholder="Debtor period"
            />
            <input
              type="number"
              {...methods.register("debt_sum", { required: true })}
              placeholder="Debt sum"
            />
            <input
              type="number"
              {...methods.register("total_debt_sum", { required: true })}
              placeholder="Total debt sum"
            />
            <input
              type="text"
              {...methods.register("description", { required: true })}
              placeholder="Description"
            />
            <button type="submit" disabled={isPending}>
              {isPending ? "Loading..." : "Add Debt"}
            </button>
          </form>
        </FormProvider>
      </div>

      <button className="detail-add-btn" onClick={() => refetch()}>
        Yangilash
      </button>
    </section>
  );
};

export default Detail;
