import api from './api';

const labResultService = {
  getAll: (params) => api.get('/lab-results', { params }),
  getById: (id) => api.get(`/lab-results/${id}`),
  create: (data) => api.post('/lab-results', data),
};

export default labResultService;
