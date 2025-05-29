import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://myantype-nodejs.onrender.com/api/v1/'
});

export default axiosInstance;