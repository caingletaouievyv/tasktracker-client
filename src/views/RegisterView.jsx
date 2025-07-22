//src/views/RegisterView.jsx

import { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import AuthCardLayout from '../components/Auth/AuthCardLayout';

const RegisterView = () => {
  const [userInfo, setUserInfo] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (userInfo.password !== userInfo.confirmPassword) {
      alert('Passwords do not match!');
      setLoading(false);
      return;
    }
    try {
      await register(userInfo);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCardLayout title="Register">
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            className="form-control"
            type="text"
            placeholder="Username"
            value={userInfo.userName}
            onChange={(e) => setUserInfo({ ...userInfo, userName: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            type="email"
            placeholder="Email"
            value={userInfo.email}
            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            type="password"
            placeholder="Password"
            value={userInfo.password}
            onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            type="password"
            placeholder="Confirm Password"
            value={userInfo.confirmPassword}
            onChange={(e) => setUserInfo({ ...userInfo, confirmPassword: e.target.value })}
            required
          />
        </div>
        <button className="btn btn-success w-100" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className="mt-3 text-center">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </AuthCardLayout>
  );
};

export default RegisterView;
