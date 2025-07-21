// src/__tests__/AuthContext.test.jsx

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import * as authService from '../../services/authService';
import * as tokenUtils from '../../utils/tokenUtils';
import { jwtDecode } from 'jwt-decode';

jest.mock('../../services/authService');
jest.mock('../../utils/tokenUtils');
jest.mock('jwt-decode');

const mockToken = 'mock.jwt.token';
const mockUser = {
  sub: 'testuser',
  nameid: '123',
  exp: Math.floor(Date.now() / 1000) + 60 * 5, // 5 min
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': ['User'],
};

const TestComponent = () => {
  const {
    user,
    isAuthenticated,
    loginUser,
    handleLogout,
    loading,
    showExpiryWarning,
  } = useAuth();

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'Logged In' : 'Logged Out'}</div>
      <div data-testid="loading">{loading ? 'Loading' : 'Loaded'}</div>
      <div data-testid="user">{user ? user.username : 'No User'}</div>
      <div data-testid="expiry">{showExpiryWarning ? 'Warning' : 'Safe'}</div>
      <button onClick={() => loginUser({ username: 'test', password: 'pass' })}>Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('logs in and sets user/auth state', async () => {
    authService.login.mockResolvedValue(mockToken);
    jwtDecode.mockReturnValue(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText('Login').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged In');
      expect(screen.getByTestId('user')).toHaveTextContent('testuser');
    });

    expect(localStorage.getItem('token')).toBe(mockToken);
  });

  test('logs out and clears user/auth state', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText('Logout').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
      expect(screen.getByTestId('user')).toHaveTextContent('No User');
    });

    expect(authService.logout).toHaveBeenCalled();
  });

  test('sets expiry warning 2 minutes before token expiry', async () => {
    // Simulate a token expiring in 2.5 minutes
    const expiry = Date.now() + 2.5 * 60 * 1000;
    jwtDecode.mockReturnValue({ ...mockUser, exp: Math.floor(expiry / 1000) });
    authService.getToken.mockReturnValue(mockToken);

    jest.useFakeTimers();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('expiry')).toHaveTextContent('Safe');
    });

    act(() => {
      jest.advanceTimersByTime(60 * 1000); // 1 minute
    });

    expect(screen.getByTestId('expiry')).toHaveTextContent('Warning');

    jest.useRealTimers();
  });

  test('loads token on mount and logs out if expired', async () => {
    // Expired token
    const expired = Math.floor(Date.now() / 1000) - 100;
    jwtDecode.mockReturnValue({ ...mockUser, exp: expired });
    authService.getToken.mockReturnValue(mockToken);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
    });

    expect(authService.logout).toHaveBeenCalled();
  });

  test('registers expiry callback that updates state', async () => {
    let registeredCallback;
    tokenUtils.setExpiryCallback.mockImplementation(cb => {
      registeredCallback = cb;
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Simulate setting a new expiry 5 minutes in the future
    act(() => {
      registeredCallback(Date.now() + 5 * 60 * 1000); // ✅ 5 mins from now
    });

    await waitFor(() => {
      expect(screen.getByTestId('expiry')).toHaveTextContent('Safe');
    });
  });

  test('sets showExpiryWarning to true if new expiry is within 2 minutes', async () => {
    let registeredCallback;
    tokenUtils.setExpiryCallback.mockImplementation(cb => {
      registeredCallback = cb;
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      registeredCallback(Date.now() + 60 * 1000); // ⏰ Only 1 minute left
    });

    await waitFor(() => {
      expect(screen.getByTestId('expiry')).toHaveTextContent('Warning');
    });
  });

});
