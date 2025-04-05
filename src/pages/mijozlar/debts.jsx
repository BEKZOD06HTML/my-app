import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import API from "../../services/API";

const Debts = () => {
  const { id } = useParams(); // Debtor ID olish
  const methods = useForm();
  const queryClient = useQueryClient();

  // Ma'lum bir qarzchi uchun qarzlarni olish
  const { data: debts, refetch } = useQuery({
    queryKey: ["debts", id],
    queryFn: async () => {
      const { data } = await API.get(`/debts?debtor_id=${id}`);
      return data.data;
    },
    enabled: !!id,
  });

  // Yangi qarz qo'shish mutatsiyasi
  const { mutate: createdDebt, isPending } = useMutation({
    mutationFn: async (formData) => {
      const { data } = await API.post("/debts", formData);
      return data.data;
    },
    onSuccess: () => {
      toast.success("Qarz muvaffaqiyatli qo'shildi!");
      refetch();  // Yangi qarz qo'shilgandan so'ng, qarzlarni yangilash
    },
    onError: () => {
      toast.error("Qarz qo'shishda xatolik!");
    },
  });

  // Formani yuborish uchun handleSubmit funksiyasi
  const handleSubmit = (data) => {
    const newData = {
      ...data,
      debtor: id,  // Debtor ID ni form ma'lumotiga qo'shish
      debt_status: "active",
      images: [
        { image: "image-url-1" },
        { image: "image-url-2" },
      ],
    };

    createdDebt(newData); // Yangi qarzni yaratish
  };

  return (
    <div>
      {/* Yangi qarz qo'shish formasi */}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <input
            type="date"
            name="next_payment_date"
            placeholder="Keyingi to'lov sanasi"
            {...methods.register("next_payment_date")}
          />
          <input
            type="number"
            name="debt_period"
            placeholder="Qarz muddati"
            {...methods.register("debt_period")}
          />
          <input
            type="number"
            name="debt_sum"
            placeholder="Qarz summasi"
            {...methods.register("debt_sum")}
          />
          <input
            type="number"
            name="total_debt_sum"
            placeholder="Jami qarz summasi"
            {...methods.register("total_debt_sum")}
          />
          <input
            type="text"
            name="description"
            placeholder="Ta'rif"
            {...methods.register("description")}
          />
          <button type="submit" disabled={isPending}>
            {isPending ? "Yuklanmoqda..." : "Qarzni qo'shish"}
          </button>
        </form>
      </FormProvider>

      {/* Qarzlar ro'yxatini ko'rsatish */}
      <div className="debts-list">
        {debts?.map((debt) => (
          <div key={debt.id} className="debt-card">
            <p>Keyingi to'lov sanasi: {debt.next_payment_date}</p>
            <p>Qarz muddati: {debt.debt_period}</p>
            <p>Qarz summasi: {debt.debt_sum}</p>
            <p>Jami qarz summasi: {debt.total_debt_sum}</p>
            <p>Ta'rif: {debt.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Debts;
