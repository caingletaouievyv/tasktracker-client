//src/views/AdminDashboard.jsx

import React, { useState } from 'react';
import UsersManagement from '../components/Admin/UsersManagement.jsx';
import TasksManagement from '../components/Admin/TasksManagement.jsx';
import { useTheme } from '../contexts/ThemeContext';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const { theme } = useTheme();

  return (
    <div
      className={`container mt-4 ${
        theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'
      } p-4 rounded shadow`}
    >

      <h1>Admin Dashboard</h1>
      <ul
        className={`nav nav-tabs ${
          theme === 'dark' ? 'nav-dark-tabs' : ''
        }`}
      >
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
        </li>
      </ul>
      <div className="tab-content mt-3">
        {activeTab === 'users' && <UsersManagement />}
        {activeTab === 'tasks' && <TasksManagement />}
      </div>
    </div>
  );
}

