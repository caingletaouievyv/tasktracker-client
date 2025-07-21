// src/utils/tokenUtils.js

import { jwtDecode } from 'jwt-decode';

let expiryCallback = null;

export const setExpiryCallback = (cb) => {
  expiryCallback = cb;
};

export const updateTokenExpiryFromToken = (token) => {
  if (!token || typeof token !== 'string') return;
  try {
    const decoded = jwtDecode(token);
    const expiry = decoded.exp * 1000;
    if (expiryCallback) expiryCallback(expiry);
  } catch (err) {
    console.error('Failed to decode token for expiry update', err);
  }
};
