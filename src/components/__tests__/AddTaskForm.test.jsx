//src/components/__tests__/AddTaskForm.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddTaskForm from '../Task/AddTaskForm';
import * as taskService from '../../services/taskService';

jest.mock('../../services/taskService'); // mock API call

describe('AddTaskForm', () => {
  const mockRefreshTasks = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form fields correctly', () => {
    render(<AddTaskForm refreshTasks={mockRefreshTasks} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/completed/i)).toBeInTheDocument();
  });

  test('submits form with correct data and resets fields', async () => {
    taskService.createTask.mockResolvedValueOnce({}); // mock successful API call

    render(<AddTaskForm refreshTasks={mockRefreshTasks} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Task' },
    });

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'This is a test' },
    });

    fireEvent.change(screen.getByLabelText(/due date/i), {
      target: { value: '2025-12-31' },
    });

    fireEvent.click(screen.getByLabelText(/completed/i)); // check the box

    fireEvent.click(screen.getByText(/add task/i)); // submit

    await waitFor(() => {
      expect(taskService.createTask).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'This is a test',
        dueDate: '2025-12-31',
        isCompleted: true,
      });

      expect(mockRefreshTasks).toHaveBeenCalled();
    });

    // Verify inputs are reset
    expect(screen.getByLabelText(/title/i).value).toBe('');
    expect(screen.getByLabelText(/description/i).value).toBe('');
    expect(screen.getByLabelText(/due date/i).value).toBe('');
    expect(screen.getByLabelText(/completed/i).checked).toBe(false);
  });

  test('handles API error gracefully', async () => {
    console.error = jest.fn(); // suppress expected error logs
    taskService.createTask.mockRejectedValueOnce(new Error('API error'));

    render(<AddTaskForm refreshTasks={mockRefreshTasks} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Task' },
    });

    fireEvent.click(screen.getByText(/add task/i));

    await waitFor(() => {
      expect(taskService.createTask).toHaveBeenCalled();
      expect(mockRefreshTasks).not.toHaveBeenCalled();
    });
  });
});
