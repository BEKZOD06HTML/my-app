import axios from "axios";
import { message } from "antd";

const API = axios.create({
    baseURL: "https://nasiya.takedaservice.uz/api",
    headers: {
        "Content-Type": "application/json",
    }
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers["Authorization"] = `Bearer ${token}`;
    }
    
    console.log("API request URL:", req.baseURL + req.url);
    console.log("API request data:", req.data);
    console.log("API request params:", req.params);
    
    return req;
});

API.interceptors.response.use(
    (res) => res,
    (err) => {
        console.error("API response error:", err);
        
        if (err.response?.status === 401) {
            localStorage.removeItem("token");
            message.error("Session expired. Please login again.");
            setTimeout(() => {
                window.location.replace("/login"); 
            }, 500);
        } else if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
            message.error("Serverga ulanishda xatolik yuz berdi. Iltimos, internet aloqangizni tekshiring.");
        } else if (err.response?.status === 504) {
            message.error("Server so'rovga javob bermadi. Iltimos keyinroq qayta urinib ko'ring.");
        }
        return Promise.reject(err);
    }
);

export default API;