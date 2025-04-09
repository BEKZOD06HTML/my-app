import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../services/API";

const useDebts = (debtorId) => {
  const queryClient = useQueryClient();

  // Fetch all debts for a debtor
  const { data: debts = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ["debts", debtorId],
    queryFn: async () => {
      if (!debtorId) return [];
      const response = await API.get("/debts", {
        params: { debtor_id: debtorId },
      });
      console.log("useDebts: API dan olingan nasiyalar:", response.data?.data);
      return response.data?.data || [];
    },
    enabled: !!debtorId, // Only run the query if debtorId exists
    staleTime: 0, // Ma'lumotlar har doim yangilansin
    refetchOnWindowFocus: true, // Oyna fokusga kelganda yangilansin
  });

  // Mutation to create a new debt
  const createDebtMutation = useMutation({
    mutationFn: async (debtData) => {
      try {
        // product_name va debtor_id ni tashlaymiz
        const { product_name, debtor_id, ...cleanData } = debtData;
        
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
        
        console.log("useDebts: API ga yuborilayotgan ma'lumotlar:", cleanData);
        console.log("useDebts: debtor_id:", debtorId);
        
        // debtor_id ni body ga qo'shamiz
        cleanData.debtor_id = debtorId;
        
        // To'g'ridan-to'g'ri POST so'rovi yuboramiz
        const response = await API.post("/debts", cleanData);
        
        console.log("useDebts: API javob:", response.data);
        return response.data?.data;
      } catch (error) {
        console.error("useDebts: Qarz yaratishda xatolik:", error.response?.data || error);
        throw error;
      }
    },
    onSuccess: (newDebt) => {
      if (debtorId) {
        // Yangi qarz qo'shilganini ko'rsatish uchun cache ni yangilaymiz
        queryClient.setQueryData(["debts", debtorId], (oldDebts = []) => {
          console.log("useDebts: Yangi qarz qo'shildi:", newDebt);
          return [newDebt, ...oldDebts];
        });
        
        // Cache ni invalidatsiya qilish (majburiy yangilash)
        queryClient.invalidateQueries(["debts", debtorId]);
      }
    },
    onError: (error) => {
      console.error("useDebts: Qarz yaratishda xatolik:", error);
    }
  });

  // Fetch a specific debt by its ID
  const getDebtById = (debtId) => {
    return useQuery({
      queryKey: ["debt", debtId],
      queryFn: async () => {
        const response = await API.get(`/debts/${debtId}`);
        return response.data?.data;
      },
      enabled: !!debtId, // Ensure the query runs only if debtId exists
    });
  };

  // Mutation to delete a debt
  const deleteDebtMutation = useMutation({
    mutationFn: async (debtId) => {
      await API.delete(`/debts/${debtId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debts", debtorId] });
    },
  });

  // Mutation to update an existing debt
  const updateDebtMutation = useMutation({
    mutationFn: async ({ debtId, debtData }) => {
      try {
        const { product_name, debtor_id, ...cleanData } = debtData;
        
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
        
        console.log("useDebts: Qarz yangilash ma'lumotlari:", cleanData);
        
        const response = await API.put(`/debts/${debtId}`, cleanData);
        return response.data?.data;
      } catch (error) {
        console.error("useDebts: Qarz yangilashda xatolik:", error.response?.data || error);
        throw error;
      }
    },
    onSuccess: (updatedDebt) => {
      queryClient.setQueryData(["debt", updatedDebt.id], updatedDebt);
      queryClient.invalidateQueries({ queryKey: ["debts", debtorId] });
    },
    onError: (error) => {
      console.error("useDebts: Qarz yangilashda xatolik:", error);
    }
  });

  return {
    debts,
    loading,
    error,
    refetch,
    createDebt: createDebtMutation.mutateAsync,
    getDebtById, // Return the method so it can be used in the component
    deleteDebt: deleteDebtMutation.mutateAsync,
    updateDebt: updateDebtMutation.mutateAsync,
  };
};

export default useDebts;
