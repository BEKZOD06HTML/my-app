import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../services/API";

const useDebts = (debtorId) => {
  const queryClient = useQueryClient();

  // Fetch all debts for a debtor
  const { data: debts = [], isLoading: loading, error } = useQuery({
    queryKey: ["debts", debtorId],
    queryFn: async () => {
      if (!debtorId) return [];
      const response = await API.get("/debts", {
        params: { debtor_id: debtorId },
      });
      return response.data?.data || [];
    },
    enabled: !!debtorId, // Only run the query if debtorId exists
  });

  // Mutation to create a new debt
  const createDebtMutation = useMutation({
    mutationFn: async (debtData) => {
/*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Called after a new debt has been successfully created.
     * 
     * If `debtorId` is provided, the new debt will be prepended to the list of debts for that debtor in the cache.
     * @param {Object} newDebt - The newly created debt.
     */
/*******  652e8472-8d44-4fa7-803b-424643fbe99b  *******/      const response = await API.post("/debts", debtData);
      return response.data?.data;
    },
    onSuccess: (newDebt) => {
      if (debtorId) {
        // Optimistically update the cache
        queryClient.setQueryData(["debts", debtorId], (oldDebts = []) => [newDebt, ...oldDebts]);
      }
    },
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
      const response = await API.put(`/debts/${debtId}`, debtData);
      return response.data?.data;
    },
    onSuccess: (updatedDebt) => {
      queryClient.setQueryData(["debt", updatedDebt.id], updatedDebt);
      queryClient.invalidateQueries({ queryKey: ["debts", debtorId] });
    },
  });

  return {
    debts,
    loading,
    error,
    createDebt: createDebtMutation.mutateAsync,
    getDebtById, // Return the method so it can be used in the component
    deleteDebt: deleteDebtMutation.mutateAsync,
    updateDebt: updateDebtMutation.mutateAsync,
  };
};

export default useDebts;
