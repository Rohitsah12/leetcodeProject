import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";   

const axiosClient = axios.create({
    baseURL: `${apiUrl}`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Enhanced request interceptor with localStorage fallback
axiosClient.interceptors.request.use(
    (config) => {
        console.log('🚀 Making request to:', config.baseURL + config.url);
        console.log('🍪 Request cookies:', document.cookie);
        
        // Fallback: if no cookies, check localStorage
        if (!document.cookie && localStorage.getItem('auth_token')) {
            config.headers.Authorization = `Bearer ${localStorage.getItem('auth_token')}`;
            console.log('📱 Using localStorage token as fallback');
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => {
        console.log('✅ Response from:', response.config.url, response.status);
        
        // Store token in localStorage if provided
        if (response.data?.token) {
            localStorage.setItem('auth_token', response.data.token);
            console.log('💾 Token stored in localStorage');
        }
        
        return response;
    },
    (error) => {
        console.log('❌ Response error:', error.response?.status, error.response?.data);
        
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
        }
        
        return Promise.reject(error);
    }
);

export default axiosClient;
