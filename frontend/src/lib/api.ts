import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || "https://online-quiz-application-duig.onrender.com/api/quiz",
    withCredentials: true
});

export default API;