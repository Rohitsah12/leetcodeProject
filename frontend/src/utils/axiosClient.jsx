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
        console.log('🚀 Making request to:', config.baseURL + config.url);
        console.log('🍪 Request cookies:', document.cookie);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Fixed response interceptor - NO AUTO REDIRECT
axiosClient.interceptors.response.use(
    (response) => {
        console.log('✅ Response from:', response.config.url, response.status);
        return response;
    },
    (error) => {
        console.log('❌ Response error:', error.response?.status, error.response?.data);
        
        // DON'T auto-redirect on 401 - let components handle it
        // The auth check failures should be handled by the Redux state, not forced redirects
        
        return Promise.reject(error);
    }
);

export default axiosClient;
