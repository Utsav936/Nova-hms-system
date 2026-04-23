import axios from 'axios';
import { auth } from '../config/firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor — Inject Firebase ID Token
 */
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor — Simple Error Handling
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401, it means the token is invalid or user is not authenticated
    // We could trigger a logout here if needed
    return Promise.reject(error);
  }
);

export default api;

