//src/components/__tests__/TokenExpiryModal.test.jsx

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import TokenExpiryModal from '../TokenExpiryModal';
import { useAuth } from '../../contexts/AuthContext';

// Mock useAuth
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.useFakeTimers();

describe('TokenExpiryModal', () => {
  const handleLogoutMock = jest.fn();
  const onCloseMock = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({ handleLogout: handleLogoutMock });
    handleLogoutMock.mockClear();
    onCloseMock.mockClear();
  });

  it('renders the countdown and modal content', () => {
    render(<TokenExpiryModal show={true} onClose={onCloseMock} />);
    expect(screen.getByText(/session will expire in/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /stay logged in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout now/i })).toBeInTheDocument();
  });

  it('counts down and calls handleLogout at 0', () => {
    render(<TokenExpiryModal show={true} onClose={onCloseMock} />);
    
    act(() => {
      jest.advanceTimersByTime(120_000); // fast-forward 120 seconds
    });

    expect(handleLogoutMock).toHaveBeenCalledTimes(1);
  });

  it('calls handleLogout and onClose when Logout Now is clicked', () => {
    render(<TokenExpiryModal show={true} onClose={onCloseMock} />);
    
    fireEvent.click(screen.getByRole('button', { name: /logout now/i }));

    expect(handleLogoutMock).toHaveBeenCalledTimes(1);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Stay Logged In is clicked', () => {
    render(<TokenExpiryModal show={true} onClose={onCloseMock} />);

    fireEvent.click(screen.getByRole('button', { name: /stay logged in/i }));

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('does not start countdown when show is false', () => {
    render(<TokenExpiryModal show={false} onClose={onCloseMock} />);

    act(() => {
      jest.advanceTimersByTime(120_000);
    });

    expect(handleLogoutMock).not.toHaveBeenCalled();
  });
});
