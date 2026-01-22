import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config);
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;