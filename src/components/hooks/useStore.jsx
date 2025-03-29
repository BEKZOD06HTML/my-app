import { create } from "zustand";
import API from "../../services/API";

const useStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  
  setUser: (user) => {
    set({ user });
    localStorage.setItem("user", JSON.stringify(user));
  },

  fetchUser: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token topilmadi!");
      }

      const response = await API.get("/auth/profile");
      set({ user: response.data });
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Foydalanuvchi ma'lumotlarini olishda xatolik:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null });
  },

  clearUser: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },
}));

export default useStore;
