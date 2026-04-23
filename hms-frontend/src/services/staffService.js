import api from './api';

const staffService = {
  getAll: (params) => api.get('/staff', { params }),
  getById: (id) => api.get(`/staff/${id}`),
  create: (data) => api.post('/staff', data),
  update: (id, data) => api.patch(`/staff/${id}`, data),
  delete: (id) => api.delete(`/staff/${id}`),
};

export default staffService;
