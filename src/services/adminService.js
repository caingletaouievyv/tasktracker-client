//src/services/adminService.js

import axiosAPI from '../api/axiosInstance';

const adminService = {
  getAllUsers: async () => {
    const response = await axiosAPI.get('/admin/users');
    return response.data;
  },
  
  updateUserRoles: async (userId, roles) => {
  const response = await axiosAPI.post('/admin/updateUserRoles', {
    userId,
    roles
  });
  return response.data;
  },

  deleteUser: async (userId) => {
    await axiosAPI.delete(`/admin/users/${userId}`);
  },

  getAllTasks: async () => {
    const response = await axiosAPI.get('/admin/tasks');
    return response.data;
  },

  deleteTask: async (taskId) => {
    await axiosAPI.delete(`/admin/tasks/${taskId}`);
  },

  exportAllTasksAsCSV: async () => {
    const response = await axiosAPI.get('/tasks/export/csv?all=true', {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tasks.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  exportAllTasksAsPDF: async () => {
    const response = await axiosAPI.get('/tasks/export/pdf?all=true', {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tasks.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  exportAllUsersAsCSV: async () => {
    const response = await axiosAPI.get('/admin/export/users/csv', {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  exportAllUsersAsPDF: async () => {
    const response = await axiosAPI.get('/admin/export/users/pdf', {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

};

export default adminService;



