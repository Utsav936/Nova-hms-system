import api from './api';

const medicalRecordService = {
  getAll: (params) => api.get('/medical-records', { params }),
  getById: (id) => api.get(`/medical-records/${id}`),
  getByPatientId: (patientId) => api.get(`/medical-records/patient/${patientId}`),
  create: (data) => api.post('/medical-records', data),
  update: (id, data) => api.patch(`/medical-records/${id}`, data),
};

export default medicalRecordService;
