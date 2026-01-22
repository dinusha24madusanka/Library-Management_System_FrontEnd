import axiosClient from '../../api/client';
import { API_ENDPOINTS } from '../../config/constants';

export const bookAPI = {
  getAll: () => axiosClient.get(API_ENDPOINTS.BOOKS),
  
  getById: (id) => axiosClient.get(`${API_ENDPOINTS.BOOKS}/${id}`),
  
  create: (data) => axiosClient.post(API_ENDPOINTS.BOOKS, data),
  
  update: (id, data) => axiosClient.put(`${API_ENDPOINTS.BOOKS}/${id}`, data),
  
  delete: (id) => axiosClient.delete(`${API_ENDPOINTS.BOOKS}/${id}`),
};