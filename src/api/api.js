import axios from 'axios';

// Configure base URL - change this to match your Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Member API calls
export const memberApi = {
  getAll: () => api.get('/members'),
  getById: (id) => api.get(`/members/${id}`),
  create: (member) => api.post('/members', member),
  update: (id, member) => api.put(`/members/${id}`, member),
  delete: (id) => api.delete(`/members/${id}`),
};

// Book API calls
export const bookApi = {
  getAll: () => api.get('/books'),
  getById: (id) => api.get(`/books/${id}`),
  create: (book) => api.post('/books', book),
  update: (id, book) => api.put(`/books/${id}`, book),
  delete: (id) => api.delete(`/books/${id}`),
  searchByTitle: (title) => api.get(`/books/search?title=${title}`),
  searchByAuthor: (author) => api.get(`/books/author?author=${author}`),
};

// Borrow API calls
export const borrowApi = {
  getAll: () => api.get('/borrows'),
  getById: (id) => api.get(`/borrows/${id}`),
  create: (borrow) => api.post('/borrows', borrow),
  returnBook: (id) => api.put(`/borrows/${id}/return`),
  getByMember: (memberId) => api.get(`/borrows/member/${memberId}`),
  getOverdue: () => api.get('/borrows/overdue'),
};

export default api;
