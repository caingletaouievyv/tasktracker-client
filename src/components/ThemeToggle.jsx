// src/components/ThemeToggle.jsx

import { useTheme } from '../contexts/ThemeContext';
import Button from 'react-bootstrap/Button';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant={theme === 'dark' ? 'light' : 'dark'}
      onClick={toggleTheme}
      className={className}
    >
      {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </Button>
  );
}
