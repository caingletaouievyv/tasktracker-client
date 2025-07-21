// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, getToken, logout } from '../services/authService';
import { jwtDecode } from 'jwt-decode';
import { setExpiryCallback } from '../utils/tokenUtils';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenExpiry, setTokenExpiry] = useState(null);
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);
  const [loading, setLoading] = useState(true);

const loginUser = async (credentials) => {
  const token = await login(credentials);
  const decoded = jwtDecode(token);

  const rawRoles = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  const roles = Array.isArray(rawRoles) ? rawRoles : [rawRoles];

  const user = {
    username: decoded.sub || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
    id: decoded.nameid || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/2claims/nameidentifier"],
    roles,
  };

  setUser(user);
  setIsAuthenticated(true);
  setTokenExpiry(decoded.exp * 1000);
  localStorage.setItem('token', token);

  return user;
};

useEffect(() => {
  const token = getToken();

  if (!token) {
  setLoading(false);
  return;
  }

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      handleLogout();
    } else {
      const rawRoles = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const roles = Array.isArray(rawRoles) ? rawRoles : [rawRoles];

      setUser({
        username: decoded.sub || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        id: decoded.nameid || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/2claims/nameidentifier"],
        roles,
      });

      setIsAuthenticated(true);
      setTokenExpiry(decoded.exp * 1000);
    }
  } catch (err) {
    console.error('Invalid token', err);
    handleLogout();
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
    if (!tokenExpiry) return;

    const now = Date.now();
    const warningTime = tokenExpiry - 2 * 60 * 1000; 

    if (now >= warningTime) {
      setShowExpiryWarning(true); 
      return;
    }

    const timeoutId = setTimeout(() => {
      setShowExpiryWarning(true);
    }, warningTime - now);

    return () => clearTimeout(timeoutId);
  }, [tokenExpiry]);

useEffect(() => {
  setExpiryCallback((newExpiry) => {
    setTokenExpiry(newExpiry);
    setShowExpiryWarning(false);
  });
}, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        setUser,
        setIsAuthenticated,
        loginUser, 
        handleLogout,
        showExpiryWarning,
        setShowExpiryWarning,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { AuthProvider };

