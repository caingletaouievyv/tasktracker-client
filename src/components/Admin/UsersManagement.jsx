// src/components/Admin/UsersManagement.jsx

import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import { Spinner, Table, Button, Form } from 'react-bootstrap';
import DeleteModal from '../common/DeleteModal';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [roleDraft, setRoleDraft] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  useEffect(() => {
    adminService.getAllUsers()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRoleSave = async (userId) => {
    await adminService.updateUserRoles(userId, [roleDraft]);
    setUsers(users.map(u => u.id === userId ? { ...u, roles: [roleDraft] } : u));
    setEditingRoleId(null);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    await adminService.deleteUser(userToDelete.id);
    setUsers(users.filter(u => u.id !== userToDelete.id));
    setShowDeleteModal(false);
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Users</h3>
        <div>
          <button onClick={adminService.exportAllUsersAsCSV} className="btn btn-outline-primary me-2">
            Export CSV
          </button>
          <button onClick={adminService.exportAllUsersAsPDF} className="btn btn-outline-danger">
            Export PDF
          </button>
        </div>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.userName}</td>
              <td>{user.email}</td>
              <td>
                {editingRoleId === user.id ? (
                  <Form.Select
                    value={roleDraft}
                    onChange={(e) => setRoleDraft(e.target.value)}
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </Form.Select>
                ) : (
                  user.roles.length > 0 ? user.roles.join(', ') : 'User'
                )}
              </td>
              <td>
                {editingRoleId === user.id ? (
                  <>
                    <Button size="sm" onClick={() => handleRoleSave(user.id)}>Save</Button>{' '}
                    <Button size="sm" variant="secondary" onClick={() => setEditingRoleId(null)}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingRoleId(user.id);
                        setRoleDraft((user.roles && user.roles.length > 0) ? user.roles[0] : 'User');
                      }}
                    >
                      Edit Role
                    </Button>{' '}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        setUserToDelete(user);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteUser}
        itemLabel={userToDelete?.userName}
      />
    </div>
  );
}
