// src/components/common/DeleteModal.jsx

import React from 'react';  
import { Modal, Button } from 'react-bootstrap';

const DeleteModal = ({ show, onClose, onConfirm, itemLabel = 'item' }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete <strong>"{itemLabel}"</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;



