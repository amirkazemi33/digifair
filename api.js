import axios from 'axios';

const API_BASE_URL = 'http://localhost:7274/api'; // مطمئن شوید این آدرس http و پورت صحیح باشد

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// اضافه کردن Interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;