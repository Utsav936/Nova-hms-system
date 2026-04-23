import api from './api';

const authService = {
  registerInit: (data) => api.post('/auth/register-init', data),
  registerVerify: (data) => api.post('/auth/register-verify', data),
  sendOtp: (data) => api.post('/auth/send-otp', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export default authService;

