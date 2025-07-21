//src/components/__tests__/PrivateRoute.test.jsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import { useAuth } from '../../contexts/AuthContext';

// Mock useAuth
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const TestPage = () => <div>Protected Page</div>;
const PublicPage = () => <div>Login Page</div>;
const FallbackPage = () => <div>Fallback Route</div>;

describe('PrivateRoute', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (authMock, route = '/protected', roles = null) => {
    useAuth.mockReturnValue(authMock);

    render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/login" element={<PublicPage />} />
          <Route path="/tasks" element={<FallbackPage />} />
          <Route
            path="/protected"
            element={
              <PrivateRoute roles={roles}>
                <TestPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders loading state when loading', () => {
    renderWithRouter({ user: null, loading: true });

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('redirects to /login if not authenticated', () => {
    renderWithRouter({ user: null, loading: false });

    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });

  it('allows access to authenticated user when no roles required', () => {
    renderWithRouter({ user: { roles: ['User'] }, loading: false });

    expect(screen.getByText(/protected page/i)).toBeInTheDocument();
  });

  it('allows access to user with required role', () => {
    renderWithRouter({ user: { roles: ['Admin'] }, loading: false }, '/protected', ['Admin']);

    expect(screen.getByText(/protected page/i)).toBeInTheDocument();
  });

  it('redirects to /tasks if user lacks required role', () => {
    renderWithRouter({ user: { roles: ['User'] }, loading: false }, '/protected', ['Admin']);

    expect(screen.getByText(/fallback route/i)).toBeInTheDocument();
  });
});
