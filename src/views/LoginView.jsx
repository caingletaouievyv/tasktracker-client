//src/views/LoginView.jsx

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthCardLayout from '../components/Auth/AuthCardLayout';

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
    navigate(res.roles.includes('Admin') ? '/admin' : '/tasks');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
};

  return (
    <AuthCardLayout title="Login">
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            className="form-control"
            type="text"
            placeholder="Username"
            value={credentials.userName}
            onChange={(e) => setCredentials({ ...credentials, userName: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
          />
        </div>
        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-3 text-center">
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </AuthCardLayout>
  );
};

export default LoginView;
