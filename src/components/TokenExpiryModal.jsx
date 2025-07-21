// src/components/TokenExpiryModal.jsx

import React from 'react';
import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const TokenExpiryModal = ({ show, onClose }) => {
  const [countdown, setCountdown] = useState(120);
  const { handleLogout } = useAuth();

  useEffect(() => {
    if (!show) return;

    setCountdown(120); 

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [show, handleLogout, onClose]);

  const handleManualLogout = () => {
    handleLogout();
    if (onClose) onClose();
  };
  
  return (
    <Modal show={show} backdrop="static" keyboard={false} centered>
      <Modal.Header>
        <Modal.Title>Session Expiring Soon</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Your session will expire in <strong>{countdown}</strong> seconds.
        Please save your work or re-login to continue.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Stay Logged In
        </Button>
        <Button variant="danger" onClick={handleManualLogout}>
          Logout Now
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TokenExpiryModal;

