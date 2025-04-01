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
        console.error("Token");
        return;
      }

      const response = await API.get("/auth/profile");

      if (response.data && response.data.data) {
        const userData = { 
          ...response.data.data, 
          username: response.data.data.login
        };

        set({ user: userData });
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        console.error( response.data);
      }
    } catch (error) {
      console.error( error);
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null });

  },
}));

export default useStore;
