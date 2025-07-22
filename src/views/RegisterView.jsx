//src/views/RegisterView.jsx

import { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; 

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
    <>
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>{success}</div>}
        <input
          type="text"
          placeholder="Username"
          value={userInfo.userName}
          onChange={(e) => setUserInfo({ ...userInfo, userName: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={userInfo.email}
          onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={userInfo.password}
          onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={userInfo.confirmPassword}
          onChange={(e) => setUserInfo({ ...userInfo, confirmPassword: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </>
  );
};

export default RegisterView;
