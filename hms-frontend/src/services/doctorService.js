import api from './api';

const doctorService = {
  getAll: (params) => api.get('/doctors', { params }),
  getById: (id) => api.get(`/doctors/${id}`),
  create: (data) => api.post('/doctors', data),
  update: (id, data) => api.patch(`/doctors/${id}`, data),
  delete: (id) => api.delete(`/doctors/${id}`),
};

export default doctorService;
