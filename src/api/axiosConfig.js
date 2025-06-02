// api.js
import axios from 'axios';
import { toast } from 'sonner';

export const BASE_URL = 'https://myantype-nodejs.onrender.com/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized request');
    }
    return Promise.reject(error);
  }
);

export const authApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

authApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 429) {
      toast.error('You have exceeded the rate limit. Please try again later.');
    }
    if (err.response?.status === 401) {
      const currentPath = window.location.pathname;
      window.location.href = `/login?redirectTo=${encodeURIComponent(currentPath)}`;
    }
    return Promise.reject(err);
  }
);

// Fetch words for word mode
export const fetchWords = async (lang, count) => {
  try {
    const response = await api.get(`/words?lang=${lang}&count=${count}`);
    console.log('fetchWords response:', response.data);
    if (response.data.paragraph) {
      return { words: response.data.paragraph.split(' '), lang, count };
    }
    throw new Error('Invalid response structure: missing paragraph');
  } catch (error) {
    toast.error(`Failed to fetch words for ${lang}, count ${count}`);
    console.error('fetchWords error:', error);
    throw error;
  }
};

// Fetch words for time mode
export const fetchTimeWords = async (lang, timeMode) => {
  try {
    const response = await api.get(`/time?lang=${lang}&time=${timeMode}`);
    console.log('fetchTimeWords response:', response.data);
    if (response.data.paragraph) {
      return { words: response.data.paragraph.split(' '), lang, timeMode };
    }
    throw new Error('Invalid response structure: missing paragraph');
  } catch (error) {
    toast.error(`Failed to fetch time words for ${lang}, mode ${timeMode}`);
    console.error('fetchTimeWords error:', error);
    throw error;
  }
};

// Fetch a random quote for quote mode
export const fetchQuote = async () => {
  try {
    const response = await api.get('/quote');
    console.log('fetchQuote response:', response.data);
    if (response.data.text) {
      return { quote: response.data.text }; // Return object with 'quote' property
    }
    throw new Error('Invalid response structure: missing text');
  } catch (error) {
    toast.error('Failed to fetch quote');
    console.error('fetchQuote error:', error);
    throw error;
  }
};

export default api;