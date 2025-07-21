// src/App.js

import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './contexts/ThemeContext'; 
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
