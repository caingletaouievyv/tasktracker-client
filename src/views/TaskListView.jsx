//src/views/TaskListView.jsx

import React, { useEffect, useState } from 'react';
import { getTasks } from '../services/taskService';

import TaskList from '../components/Task/TaskList';
import AddTaskForm from '../components/Task/AddTaskForm';

const TaskListView = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('dueDate');
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await getTasks(filter, searchTerm, sortBy, sortOrder); // Include filter, searchTerm, sortBy, and sortOrder
        setTasks(response);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };    
  
    fetchTasks();
  }, [filter, searchTerm, sortBy, sortOrder]); 
  
  const refreshTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks(filter, searchTerm, sortBy, sortOrder);
      setTasks(response);
    } catch (error) {
      console.error('Error refreshing tasks:', error);
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="container">
      <h1>Task Tracker</h1>
      <div className="mb-3">
        <AddTaskForm refreshTasks={refreshTasks} />
      </div>
      {/* Filter Buttons */}
      <div className="mb-3">
        <button className="btn btn-secondary me-2" onClick={() => setFilter('all')}>All</button>
        <button className="btn btn-secondary me-2" onClick={() => setFilter('active')}>Active</button>
        <button className="btn btn-secondary" onClick={() => setFilter('completed')}>Completed</button>
      </div>
      {/* Sort Order Toggle */}
      <div className="mb-3">
      <label className="form-label me-2">Sort by:</label>
      <select
        className="form-select w-auto d-inline-block me-2"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="dueDate">Due Date</option>
        <option value="title">Title</option>
      </select>

      <select
        className="form-select w-auto d-inline-block"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <TaskList tasks={tasks} 
                refreshTasks={refreshTasks} 
                filter={filter}
                sortOrder={sortOrder}
                sortBy={sortBy}
                searchTerm={searchTerm}
                loading={loading} />
    </div>
  );
}

export default TaskListView;
