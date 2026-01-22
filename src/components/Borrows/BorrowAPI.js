import axiosClient from '../../api/client';
import { API_ENDPOINTS } from '../../config/constants';

export const borrowAPI = {
  getAll: () => axiosClient.get(API_ENDPOINTS.BORROWS),
  
  getById: (id) => axiosClient.get(`${API_ENDPOINTS.BORROWS}/${id}`),
  
  create: (data) => axiosClient.post(API_ENDPOINTS.BORROWS, data),
  
  update: (id, data) => axiosClient.put(`${API_ENDPOINTS.BORROWS}/${id}`, data),
  
  delete: (id) => axiosClient.delete(`${API_ENDPOINTS.BORROWS}/${id}`),
  
  getByMemberId: (memberId) => axiosClient.get(`${API_ENDPOINTS.BORROWS}/member/${memberId}`),
};