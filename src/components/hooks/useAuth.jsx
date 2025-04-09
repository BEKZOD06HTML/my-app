import API from "../../services/API";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import useStore from "./useStore";

const useAuth = () => {
  const navigate = useNavigate();
  const { setUser, fetchUser } = useStore();

  const loginMutation = useMutation({
    mutationFn: async ({ login, hashed_password }) => {
      try {
        const response = await API.post("/auth/login", {
          login: login.trim(),
          hashed_password: hashed_password.trim()
        });

        if (response.data && response.data.accessToken) {
          localStorage.setItem("token", response.data.accessToken);

          const userData = {
            username: login,
            ...response.data.user
          };

          localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);

          return response.data;
        } else {
          throw new Error("Token topilmadi");
        }
      } catch (error) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        throw new Error("Login muvaffaqiyatsiz tugadi");
      }
    },
    onSuccess: async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          message.error("Token saqlanmadi");
          return;
        }

        await fetchUser();
        navigate("/home", { replace: true });
        message.success("Muvaffaqiyatli tizimga kirdingiz");
      } catch (error) {
        message.error("Foydalanuvchi ma'lumotlarini olishda xatolik yuz berdi.");
      }
    },
    onError: (error) => {
      if (error?.response?.status === 403) {
        message.warning("Siz faol emassiz. Iltimos, do'kon bilan bog'laning");
      } else {
        message.error(error.message || "Kirishda xatolik yuz berdi. Qayta urinib ko'ring.");
      }
    },
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    const { logout: storeLogout } = useStore.getState();
    storeLogout();
    navigate("/login", { replace: true });
    message.info("Tizimdan chiqdingiz.");
  };

  return { loginMutation, logout };
};

export default useAuth;
