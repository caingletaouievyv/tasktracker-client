//src/components/__tests__/DeleteModal.test.jsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteModal from '../Task/DeleteModal';

describe('DeleteModal', () => {
  const mockTask = { id: 1, title: 'Sample Task' };
  const onCloseMock = jest.fn();
  const onConfirmMock = jest.fn();

  beforeEach(() => {
    onCloseMock.mockClear();
    onConfirmMock.mockClear();
  });

  test('renders modal with correct task title', () => {
    render(
      <DeleteModal
        show={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        task={mockTask}
      />
    );

    expect(screen.getByText('Delete Task')).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete/i)
    ).toHaveTextContent(`Are you sure you want to delete "Sample Task"?`);
  });

  test('calls onConfirm when Delete is clicked', () => {
    render(
      <DeleteModal
        show={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        task={mockTask}
      />
    );

    fireEvent.click(screen.getByText('Delete'));
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when Cancel is clicked', () => {
    render(
      <DeleteModal
        show={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        task={mockTask}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('does not render when show is false', () => {
    const { container } = render(
      <DeleteModal
        show={false}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        task={mockTask}
      />
    );
    expect(container.querySelector('.modal')).toBeNull();
  });
});
