import axios from "axios";
import { message } from "antd";

const API = axios.create({
    baseURL: "https://nasiya.takedaservice.uz/api",
    headers: {
        "Content-Type": "application/json",
    }
});

API.interceptors.request.use(
    (req) => {
        const token = localStorage.getItem("token");
        if (token) {
            req.headers["Authorization"] = `Bearer ${token}`;
        }
        return req;
    },
    (error) => {
        console.error("Request xatoligi:", error);
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
    (res) => {
        return res;
    },
    (err) => {
        console.error("Response xatoligi:", err);
        if (err.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            message.error("Sessiya tugadi. Iltimos, qayta kiring.");
            setTimeout(() => {
                window.location.replace("/login"); 
            }, 500);
        }
        return Promise.reject(err);
    }
);

export default API;
