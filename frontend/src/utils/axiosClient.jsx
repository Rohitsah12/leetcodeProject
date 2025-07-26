import axios from "axios"
const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";   

const axiosClient=axios.create({
    baseURL:`${apiUrl}`,
    withCredentials:true,
    headers:{
        'Content-Type':'application/json'
    }
});

export default axiosClient;