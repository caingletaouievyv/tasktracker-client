//src/components/__tests__/EditTaskForm.test.jsx

jest.mock('../../services/taskService', () => ({
  updateTask: jest.fn().mockResolvedValue({}), // mock async success
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditTaskForm from '../Task/EditTaskForm';

const mockTask = {
  id: 1,
  title: 'Initial Title',
  description: 'Initial Description',
  dueDate: '2025-06-01T00:00:00.000Z',
  isCompleted: false,
};

describe('EditTaskForm', () => {
  test('renders form with initial values', () => {
    render(<EditTaskForm task={mockTask} onCancelEdit={() => {}} onSave={() => {}} />);
    expect(screen.getByLabelText(/Title/i)).toHaveValue('Initial Title');
    expect(screen.getByLabelText(/Description/i)).toHaveValue('Initial Description');
    expect(screen.getByLabelText(/Due Date/i)).toHaveValue('2025-06-01');
    expect(screen.getByLabelText(/Completed/i)).not.toBeChecked();
  });

  test('submits updated task data', async () => {
    const onSaveMock = jest.fn();
    render(<EditTaskForm task={mockTask} onCancelEdit={() => {}} onSave={onSaveMock} />);

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Updated Title' } });
    fireEvent.click(screen.getByLabelText(/Completed/i)); // Toggle checkbox
    fireEvent.submit(screen.getByRole('button', { name: /Save Changes/i }));

    // wait for async function to complete
    await screen.findByDisplayValue('Updated Title'); // crude wait for re-render

    expect(onSaveMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        title: 'Updated Title',
        isCompleted: true,
      })
    );
  });

  test('calls onCancelEdit when cancel button is clicked', () => {
    const onCancelMock = jest.fn();
    render(<EditTaskForm task={mockTask} onCancelEdit={onCancelMock} onSave={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(onCancelMock).toHaveBeenCalled();
  });
});
