//src/components/TaskList/TaskList.jsx

import React, { useState } from 'react';
import { deleteTask, updateTask } from '../../services/taskService'; 
import EditTaskForm from '../Task//EditTaskForm';
import DeleteModal from '../Task//DeleteModal';
import Spinner from 'react-bootstrap/Spinner';
import { exportTasksAsCSV, exportTasksAsPDF } from "../../services/taskService";
import { useTheme } from '../../contexts/ThemeContext';

const TaskList = ({
  tasks,
  refreshTasks,
  filter = 'all',
  sortOrder = 'asc',
  sortBy = 'dueDate',
  searchTerm = '',
  loading = false,
}) => {
  const { theme } = useTheme();

  const [editTask, setEditTask] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const handleEdit = (task) => setEditTask(task);
  const handleCancelEdit = () => setEditTask(null);

  const handleUpdateTask = async (updatedTask) => {
    try {
      await updateTask(updatedTask);
      await refreshTasks();
      setEditTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const confirmDeleteTask = async () => {
    try {
      await deleteTask(taskToDelete.id);
      await refreshTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };

  const handleDelete = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleToggleCompleted = async (task) => {
    try {
      const updatedTask = { ...task, isCompleted: !task.isCompleted };
      await updateTask(updatedTask);
      await refreshTasks();
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const getStatusBadge = (task) => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    if (task.isCompleted) return <span className="badge bg-success ms-2">Completed</span>;
    if (dueDate < today) return <span className="badge bg-danger ms-2">Overdue</span>;
    return <span className="badge bg-primary ms-2">Upcoming</span>;
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.isCompleted;
    if (filter === 'completed') return task.isCompleted;
    return true;
  });

  const searchedTasks = filteredTasks.filter(task => {
  const lowerSearch = searchTerm.toLowerCase();
  return (
    task.title.toLowerCase().includes(lowerSearch) ||
    task.description.toLowerCase().includes(lowerSearch)
  );
});


  const sortedTasks = [...searchedTasks].sort((a, b) => {
    if (sortBy === 'title') {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      return sortOrder === 'asc' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
    } else {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
  });
  
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <div>Loading tasks...</div>
      </div>
    );
  }

  return (
  <div>
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h5>Your Tasks</h5>

      <div>
        <button onClick={exportTasksAsCSV} className="btn btn-outline-primary me-2">
          Export CSV
        </button>
        <button onClick={exportTasksAsPDF} className="btn btn-outline-danger">
          Export PDF
        </button>
      </div>
      
    </div>
      {editTask ? (
        <EditTaskForm 
          task={editTask} 
          onCancelEdit={handleCancelEdit} 
          onSave={handleUpdateTask}
        />
      ) : (
        <>
          {showDeleteModal && (
            <DeleteModal
              show={showDeleteModal}
              onClose={() => setShowDeleteModal(false)}
              onConfirm={confirmDeleteTask}
              task={taskToDelete}
            />
          )}

          {sortedTasks.length === 0 ? (
            <div className="text-center text-muted my-4">No tasks found.</div>
          ) : (
            <ul className={`list-group ${theme === 'dark' ? 'bg-dark' : ''}`}>
              {sortedTasks.map((task) => (
                <li
                  key={task.id}
                  className={`list-group-item d-flex justify-content-between align-items-center ${
                    theme === 'dark' ? 'bg-secondary text-light' : ''
                  }`}
                >
                <div>
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      checked={task.isCompleted}
                      onChange={() => handleToggleCompleted(task)}
                    />
                    <span className={task.isCompleted ? 'text-decoration-line-through' : ''}>
                      {task.title} {getStatusBadge(task)}
                    </span>
                    <div className="text-muted small">
                      Due: {new Date(task.dueDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <p className="mb-1">{task.description}</p>
                  </div>
                  <div>
                    <button className="btn btn-primary me-2" onClick={() => handleEdit(task)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(task)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default TaskList;
