import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});


export default api;
