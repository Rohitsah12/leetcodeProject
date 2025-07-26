import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";   

const axiosClient = axios.create({
    baseURL: `${apiUrl}`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Enhanced request interceptor
axiosClient.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.baseURL + config.url);
        console.log('Request cookies:', document.cookie);
        console.log('WithCredentials:', config.withCredentials);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Enhanced response interceptor
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.log('Response error:', error.response?.status, error.response?.data);
        // If token expired or invalid, redirect to login
        if (error.response?.status === 401) {
            console.log('Authentication failed - redirecting to login');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
