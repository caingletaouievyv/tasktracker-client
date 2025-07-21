//src/components/AddTaskForm/AddTaskForm.jsx

import React, { useState } from 'react';
import { createTask } from '../../services/taskService';

const AddTaskForm = ({ refreshTasks }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      title,
      description,
      dueDate,
      isCompleted,
    };

    try {
      await createTask(newTask);
      refreshTasks();
      setTitle('');
      setDescription('');
      setDueDate('');
      setIsCompleted(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label" htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="description">Description</label>
        <textarea
          id="description"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          type="date"
          className="form-control"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="completed">Completed</label>
        <input
          id="completed"
          type="checkbox"
          className="form-check-input"
          checked={isCompleted}
          onChange={() => setIsCompleted(!isCompleted)}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Add Task
      </button>
    </form>
  );
};

export default AddTaskForm;

