import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";   

const axiosClient = axios.create({
    baseURL: `${apiUrl}`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for debugging
axiosClient.interceptors.request.use(
    (config) => {
        console.log('Request cookies:', document.cookie);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.log('Response error:', error.response?.data);
        return Promise.reject(error);
    }
);

export default axiosClient;
