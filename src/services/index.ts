import axios from 'axios';

export const API_URL = `http://localhost:3001`

const api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

// ! DEMO
/* api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
})

api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 403 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.post(`${API_URL}/auth/refresh`, {}, {withCredentials: true})
            localStorage.setItem('token', response.data.token);
            return api.request(originalRequest);
        } catch (e) {
            console.log('Not authorized.')
        }
    }
    throw error;
}) */

export default api