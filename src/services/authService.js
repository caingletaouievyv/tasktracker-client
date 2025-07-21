//src/services/authService.js

import axios from 'axios'; 
import API_BASE_URL from '../config/apiConfig';

// const API_URL = 'https://localhost:7010/api/account';
const API_URL = `${API_BASE_URL}/account`;

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    console.log('Login successful:', response.data);

    const { token, refreshToken } = response.data;

    setTokens(token, refreshToken);

    return token;
  } catch (error) {
    console.error('Login API error:', error.response?.data || error.message);
    throw error;
  }
};


export const register = async (userInfo) => {
  const response = await axios.post(`${API_URL}/register`, userInfo);
  return response.data;
};

const TOKEN_KEY = 'token';

export const setTokens = (accessToken) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const refreshAccessToken = async () => {
  try {
    const res = await axios.post(`${API_URL}/refresh`, {}, { withCredentials: true });
    const { token: newAccessToken } = res.data;
    setTokens(newAccessToken);
    return newAccessToken;
  } catch (err) {
    console.error('Refresh token failed:', err);
    logout();
    return null;
  }
};
