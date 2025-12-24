import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "https://cafe-app-service.onrender.com",
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});


export default api;
