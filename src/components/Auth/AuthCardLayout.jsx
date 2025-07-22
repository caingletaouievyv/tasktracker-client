// src/components/Auth/AuthCardLayout.jsx

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const AuthCardLayout = ({ title, children }) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme === 'dark' ? '#121212' : '#f8f9fa',
        color: theme === 'dark' ? '#f1f1f1' : '#000',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        className="card shadow p-4"
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: theme === 'dark' ? '#1f1f1f' : '#fff',
          border: theme === 'dark' ? '1px solid #444' : '1px solid #ccc',
        }}
      >
        <h2 className="text-center mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default AuthCardLayout;

