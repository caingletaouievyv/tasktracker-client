// src/components/Admin/TasksManagement.jsx

import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import { Spinner, Table, Button } from 'react-bootstrap';
import EditTaskForm from '../Task/EditTaskForm';
import DeleteModal from '../Task/DeleteModal';

export default function TasksManagement() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    adminService.getAllTasks()
      .then(setTasks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (taskId) => {
    await adminService.deleteTask(taskId);
    setTasks(tasks.filter(t => t.id !== taskId));
    setDeleteTarget(null);
  };

  const handleEdit = (updated) => {
    setTasks(tasks.map(t => t.id === updated.id ? updated : t));
    setShowEdit(false);
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">All Tasks</h3>
        <div>
          <button onClick={adminService.exportAllTasksAsCSV} className="btn btn-outline-primary me-2">
            Export CSV
          </button>
          <button onClick={adminService.exportAllTasksAsPDF} className="btn btn-outline-danger">
            Export PDF
          </button>
        </div>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Owner</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.isCompleted ? 'Completed' : 'Active'}</td>
              <td>{task.ownerEmail}</td>
              <td>{task.dueDate?.slice(0, 10)}</td>
              <td>
                <Button size="sm" onClick={() => { setSelectedTask(task); setShowEdit(true); }}>
                  Edit
                </Button>{' '}
                <Button size="sm" variant="danger" onClick={() => setDeleteTarget(task)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showEdit && selectedTask && (
        <EditTaskForm
          task={selectedTask}
          onClose={() => setShowEdit(false)}
          onSave={handleEdit}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          itemName={deleteTarget.title}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => handleDelete(deleteTarget.id)}
        />
      )}
    </div>
  );
}

