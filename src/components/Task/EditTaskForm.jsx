//src/components/EditTaskForm.jsx

import React, { useState } from 'react';
import { updateTask } from '../../services/taskService';

const EditTaskForm = ({ task, onCancelEdit, onSave }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate.split('T')[0]);
  const [isCompleted, setIsCompleted] = useState(task.isCompleted);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedTask = {
      id: task.id,
      title,
      description,
      dueDate,
      isCompleted,
    };

    try {
      await updateTask(updatedTask);
      onSave(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <form onSubmit = {handleSubmit}>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Title</label>
        <input
          id="title"
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <input
          id="description"
          type="text"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="dueDate" className="form-label">Due Date</label>
        <input
          id="dueDate"
          type="date"
          className="form-control"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>

      <div className="mb-3 form-check">
        <input
          id="isCompleted"
          type="checkbox"
          className="form-check-input"
          checked={isCompleted}
          onChange={(e) => setIsCompleted(e.target.checked)}
        />
        <label htmlFor="isCompleted" className="form-check-label">Completed</label>
      </div>

       <button type="submit" className="btn btn-primary me-2">Save Changes</button>
       <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>Cancel</button>
    </form>
  );
};

export default EditTaskForm;

