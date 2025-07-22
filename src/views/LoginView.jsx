//src/views/LoginView.jsx

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginView = () => {
  const [credentials, setCredentials] = useState({ userName: '', password: '' });
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const res = await loginUser(credentials);
    
    if (res.roles.includes('Admin')) {
      navigate('/admin');
    } else {
      navigate('/tasks');
    }
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
};

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={credentials.userName}
          onChange={(e) => setCredentials({ ...credentials, userName: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p style={{ marginTop: '1rem' }}>
      Don’t have an account? <Link to="/register">Register here</Link>
      </p>
    </>
  );
};

export default LoginView;
