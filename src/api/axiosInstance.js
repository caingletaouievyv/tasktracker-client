// src/api/axiosInstance.js

import axios from 'axios';
import { getToken, refreshAccessToken, logout } from '../services/authService';
import { updateTokenExpiryFromToken } from '../utils/tokenUtils';
import API_BASE_URL from '../config/apiConfig';

const api = axios.create({
  // baseURL: 'https://localhost:7010/api',
  baseURL: API_BASE_URL,
  withCredentials: true
});


api.interceptors.request.use(config => {
  const token = getToken();

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        updateTokenExpiryFromToken(newToken); 
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        logout();
        window.location.href = '/login'; 
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
