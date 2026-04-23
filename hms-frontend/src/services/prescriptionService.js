import api from './api';

const prescriptionService = {
  getAll: (params) => api.get('/prescriptions', { params }),
  getById: (id) => api.get(`/prescriptions/${id}`),
  create: (data) => api.post('/prescriptions', data),
  updateStatus: (id, status) => api.patch(`/prescriptions/${id}/status`, { status }),
};

export default prescriptionService;
