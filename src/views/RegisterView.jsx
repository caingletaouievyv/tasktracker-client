//src/views/RegisterView.jsx

import { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const RegisterView = () => {
  const [userInfo, setUserInfo] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userInfo.password !== userInfo.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      await register(userInfo);
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={userInfo.userName}
        onChange={(e) => setUserInfo({ ...userInfo, userName: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={userInfo.email}
        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={userInfo.password}
        onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={userInfo.confirmPassword}
        onChange={(e) => setUserInfo({ ...userInfo, confirmPassword: e.target.value })}
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterView;
