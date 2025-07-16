import axios from "axios";

export const API_URL = `http://localhost:3001`;
// export const API_URL = `https://gym-sets-tracker-server.onrender.com`;

const api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
});

export default api;
