import axios from "axios";
import { toast } from "sonner";

export const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized request");
    }
    return Promise.reject(error);
  }
);

export const authApi = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

authApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 429) {
      toast.err("You have exceeded the rate limit. Please try again later.");
    }

    if (err.response?.status === 401) {
      const currentPath = window.location.pathname;
      window.location.href = `/login?redirectTo=${encodeURIComponent(
        currentPath
      )}`;
    }
    return Promise.reject(err);
  }
);

export default api;
