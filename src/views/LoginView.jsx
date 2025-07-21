//src/views/LoginView.jsx

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginView = () => {
  const [credentials, setCredentials] = useState({ userName: '', password: '' });
  const { loginUser } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await loginUser(credentials);
    if (res.roles.includes('Admin')) {
      navigate('/admin');
    } else {
      navigate('/tasks');
    }
  } catch (err) {
    alert('Login failed');
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={credentials.userName}
        onChange={(e) => setCredentials({ ...credentials, userName: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginView;
