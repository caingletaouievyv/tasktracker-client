//src/components/__tests__/TaskList.test.jsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from '../Task/TaskList';

const mockRefreshTasks = jest.fn();
const mockUpdateTask = jest.fn();
const mockDeleteTask = jest.fn();

jest.mock('../../services/taskService', () => ({
  updateTask: jest.fn(() => Promise.resolve()),
  deleteTask: jest.fn(() => Promise.resolve()),
}));

// Sample data
const sampleTasks = [
  {
    id: 1,
    title: 'Task A',
    description: 'Do something',
    isCompleted: false,
    dueDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
  },
  {
    id: 2,
    title: 'Task B',
    description: 'Do another thing',
    isCompleted: true,
    dueDate: new Date(Date.now() - 86400000).toISOString(), // yesterday
  },
];

describe('TaskList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correct number of tasks', () => {
    render(<TaskList tasks={sampleTasks} refreshTasks={mockRefreshTasks} />);
    expect(screen.getByText('Task A')).toBeInTheDocument();
    expect(screen.getByText('Task B')).toBeInTheDocument();
  });

  test('calls updateTask when checkbox is toggled', async () => {
    const { getAllByRole } = render(<TaskList tasks={sampleTasks} refreshTasks={mockRefreshTasks} />);
    const checkboxes = getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); // toggle Task A
    expect(await screen.findByText('Task A')).toBeInTheDocument();
  });

test('shows edit form when Edit is clicked', () => {
  render(
    <TaskList
      tasks={sampleTasks}
      refreshTasks={mockRefreshTasks}
      sortBy="title"
      sortOrder="asc" // Ensure predictable order: Task A, Task B
    />
  );

  fireEvent.click(screen.getAllByText('Edit')[0]); // Should be Task A now
  expect(screen.getByLabelText(/Title/i)).toHaveValue('Task A');
});

  test('shows delete modal when Delete is clicked', () => {
    render(<TaskList tasks={sampleTasks} refreshTasks={mockRefreshTasks} />);
    fireEvent.click(screen.getAllByText('Delete')[0]);
    expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument();
  });

  test('shows loading spinner when loading is true', () => {
    render(<TaskList tasks={[]} refreshTasks={mockRefreshTasks} loading />);
    expect(screen.getByText(/Loading tasks/i)).toBeInTheDocument();
  });

  test('shows "No tasks found" when task list is empty', () => {
    render(<TaskList tasks={[]} refreshTasks={mockRefreshTasks} />);
    expect(screen.getByText(/No tasks found/i)).toBeInTheDocument();
  });

  test('filters out completed tasks if filter is active', () => {
    render(
      <TaskList
        tasks={sampleTasks}
        refreshTasks={mockRefreshTasks}
        filter="active"
      />
    );
    expect(screen.getByText('Task A')).toBeInTheDocument();
    expect(screen.queryByText('Task B')).not.toBeInTheDocument();
  });

  test('filters out active tasks if filter is completed', () => {
    render(
      <TaskList
        tasks={sampleTasks}
        refreshTasks={mockRefreshTasks}
        filter="completed"
      />
    );
    expect(screen.queryByText('Task A')).not.toBeInTheDocument();
    expect(screen.getByText('Task B')).toBeInTheDocument();
  });

  test('search filters tasks by title and description', () => {
    render(
      <TaskList
        tasks={sampleTasks}
        refreshTasks={mockRefreshTasks}
        searchTerm="another"
      />
    );
    expect(screen.queryByText('Task A')).not.toBeInTheDocument();
    expect(screen.getByText('Task B')).toBeInTheDocument();
  });

  test('sorts tasks by title ascending', () => {
    const { container } = render(
      <TaskList
        tasks={sampleTasks}
        refreshTasks={mockRefreshTasks}
        sortBy="title"
        sortOrder="asc"
      />
    );
    const items = container.querySelectorAll('li');
    expect(items[0]).toHaveTextContent('Task A');
    expect(items[1]).toHaveTextContent('Task B');
  });

  test('sorts tasks by title descending', () => {
    const { container } = render(
      <TaskList
        tasks={sampleTasks}
        refreshTasks={mockRefreshTasks}
        sortBy="title"
        sortOrder="desc"
      />
    );
    const items = container.querySelectorAll('li');
    expect(items[0]).toHaveTextContent('Task B');
    expect(items[1]).toHaveTextContent('Task A');
  });
});
