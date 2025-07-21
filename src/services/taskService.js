//src/services/taskService.js

import axiosAPI from '../api/axiosInstance';
import API_BASE_URL from '../config/apiConfig';

// const API_URL = 'https://localhost:7010/api/tasks';
const API_URL = `${API_BASE_URL}/tasks`;

export const getTasks = async (filter, searchTerm, sortBy, sortOrder) => {
  try {
    const params = new URLSearchParams({
      status: filter,
      search: searchTerm,
      sortBy: sortBy,
      sortOrder: sortOrder,
    });
    const response = await axiosAPI.get(`${API_URL}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const createTask = async (task) => {
  try {
    const response = await axiosAPI.post(API_URL, task);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (task) => {
  try {
    const response = await axiosAPI.put(`${API_URL}/${task.id}`, task); // Send PUT request
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    await axiosAPI.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const exportTasksAsCSV = async () => {
  const response = await axiosAPI.get(`${API_URL}/export/csv`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "tasks.csv");
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const exportTasksAsPDF = async () => {
  try {
    const response = await axiosAPI.get("/tasks/export/pdf", {
      responseType: "blob"
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tasks.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error exporting PDF:", error);
    alert("There was an error downloading the PDF. Please try again.");
  }
};


