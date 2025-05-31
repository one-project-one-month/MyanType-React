import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://myantype-nodejs.onrender.com/api/v1/',
    withCredentials: true,
});

export default axiosInstance;