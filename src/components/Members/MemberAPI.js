import axiosClient from '../../api/client';
import { API_ENDPOINTS } from '../../config/constants';

export const memberAPI = {
  getAll: () => axiosClient.get(API_ENDPOINTS.MEMBERS),
  
  getById: (id) => axiosClient.get(`${API_ENDPOINTS.MEMBERS}/${id}`),
  
  create: (data) => axiosClient.post(API_ENDPOINTS.MEMBERS, data),
  
  update: (id, data) => axiosClient.put(`${API_ENDPOINTS.MEMBERS}/${id}`, data),
  
  delete: (id) => axiosClient.delete(`${API_ENDPOINTS.MEMBERS}/${id}`),
};