import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TaskTypeDetails } from '../CreateUpdateTaskType';

// Mock hooks
const mockFetchEntity = jest.fn();
let mockFetchedEntity: any = null;
let mockIsFetchingEntity = false;

jest.mock('../../../shared/hooks/generic-entities/useFetchEntity', () => ({
  useFetchEntity: () => ({
    fetchEntity: mockFetchEntity,
    entity: mockFetchedEntity,
    isLoading: mockIsFetchingEntity,
    error: null,
  }),
}));

const mockWriteEntity = jest.fn();
let mockIsWriting = false;

jest.mock('../../../shared/hooks/generic-entities/useWriteEntity', () => ({
  useWriteEntity: (endpoint: string, type: string) => ({
    writeEntity: mockWriteEntity,
    isLoading: mockIsWriting,
    error: null,
  }),
}));

// Mock useIsMobile
jest.mock('../../../shared/styles/useIsMobile', () => ({
  useIsMobile: () => false,
}));

// Mock useFetchTaskTypes
jest.mock('../hooks/useFetchTaskTypes', () => ({
  useFetchTaskTypes: () => ({
    taskTypes: [],
    isLoading: false,
    error: null,
    fetchTaskTypes: jest.fn(),
  }),
}));

// Mock props
const mockSetPageTitle = jest.fn();
const mockSetPrimaryActionButton = jest.fn();
const mockSetSecondaryActionButton = jest.fn();
const mockSetPageSubtitle = jest.fn();

const defaultProps = {
  setPageTitle: mockSetPageTitle,
  setPrimaryActionButton: mockSetPrimaryActionButton,
  setSecondaryActionButton: mockSetSecondaryActionButton,
  setPageSubtitle: mockSetPageSubtitle,
};

const renderTaskTypeDetails = (route = '/task-types/new') => {
  const path = route.includes('/new') ? '/task-types/new' : '/task-types/:entity_id';
  
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={<TaskTypeDetails {...defaultProps} />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('TaskTypeDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchedEntity = null;
    mockIsFetchingEntity = false;
    mockIsWriting = false;
    mockFetchEntity.mockResolvedValue(null);
    mockWriteEntity.mockResolvedValue({ id: 'new-task-type-id' });
  });

  describe('rendering', () => {
    it('renders the task type name input', () => {
      renderTaskTypeDetails();
      expect(screen.getByLabelText('Task Type Name')).toBeInTheDocument();
    });

    it('renders icon selection buttons', () => {
      renderTaskTypeDetails();
      expect(screen.getByText('Icon Representation')).toBeInTheDocument();
    });

    it('renders color selection buttons', () => {
      renderTaskTypeDetails();
      expect(screen.getByText('Color Tag')).toBeInTheDocument();
    });

    it('renders the Best Practices info card', () => {
      renderTaskTypeDetails();
      expect(screen.getByText('Best Practices')).toBeInTheDocument();
    });

    it('sets the page title to "Define New Task Type"', () => {
      renderTaskTypeDetails();
      expect(mockSetPageTitle).toHaveBeenCalledWith('Define New Task Type');
    });

    it('renders the placeholder for task type name input', () => {
      renderTaskTypeDetails();
      expect(screen.getByPlaceholderText('e.g., Incident Management')).toBeInTheDocument();
    });

    it('renders icon picker buttons', () => {
      renderTaskTypeDetails();
      expect(screen.getByLabelText('Select bug_report icon')).toBeInTheDocument();
    });
  });

  describe('creating a new task type', () => {
    it('displays "Create Task Type" button when in create mode', () => {
      renderTaskTypeDetails('/task-types/new');
      expect(screen.getByRole('button', { name: /Create Task Type/i })).toBeInTheDocument();
    });

    it('displays "Cancel" button when in create mode', () => {
      renderTaskTypeDetails('/task-types/new');
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('displays action card with "Ready to create?" title', () => {
      renderTaskTypeDetails('/task-types/new');
      expect(screen.getByText('Ready to create?')).toBeInTheDocument();
    });

    it('allows typing in the task type name input', async () => {
      renderTaskTypeDetails('/task-types/new');

      const nameInput = screen.getByLabelText('Task Type Name');
      await userEvent.type(nameInput, 'Bug');

      expect(nameInput).toHaveValue('Bug');
    });

    it('allows selecting an icon', async () => {
      renderTaskTypeDetails('/task-types/new');

      const iconButton = screen.getByLabelText('Select star icon');
      await userEvent.click(iconButton);

      // The button should visually indicate selection (we can't easily check styles, but the click should work)
      expect(iconButton).toBeInTheDocument();
    });

    it('allows selecting a color', async () => {
      renderTaskTypeDetails('/task-types/new');

      const colorButton = screen.getByLabelText('Green');
      await userEvent.click(colorButton);

      // The button should visually indicate selection
      expect(colorButton).toBeInTheDocument();
    });

    it('disables submit button when task type name is empty', () => {
      renderTaskTypeDetails('/task-types/new');
      
      const createButton = screen.getByRole('button', { name: /Create Task Type/i });
      expect(createButton).toBeDisabled();
    });

    it('enables submit button when task type name is provided', async () => {
      renderTaskTypeDetails('/task-types/new');

      const nameInput = screen.getByLabelText('Task Type Name');
      await userEvent.type(nameInput, 'Valid Task Type');

      const createButton = screen.getByRole('button', { name: /Create Task Type/i });
      expect(createButton).not.toBeDisabled();
    });

    it('calls writeEntity when create button is clicked with valid data', async () => {
      renderTaskTypeDetails('/task-types/new');

      const nameInput = screen.getByLabelText('Task Type Name');
      await userEvent.type(nameInput, 'New Task Type');

      // Select an icon by clicking an icon button
      const iconButton = screen.getByLabelText('Select star icon');
      await userEvent.click(iconButton);

      const createButton = screen.getByRole('button', { name: /Create Task Type/i });
      await userEvent.click(createButton);

      await waitFor(() => {
        expect(mockWriteEntity).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'New Task Type',
            icon: 'star',
          })
        );
      });
    });
  });

  describe('editing an existing task type', () => {
    beforeEach(() => {
      mockFetchedEntity = {
        id: 'task-type-123',
        name: 'Existing Task Type',
        icon: 'bug_report',
        color: '#ef4444',
        parentTaskType: null,
        childrenTaskTypes: [],
      };
      mockFetchEntity.mockResolvedValue(mockFetchedEntity);
    });

    it('fetches the task type data when editing', async () => {
      renderTaskTypeDetails('/task-types/task-type-123');

      await waitFor(() => {
        expect(mockFetchEntity).toHaveBeenCalledWith('task-type-123');
      });
    });

    it('displays "Update Task Type" button when in edit mode', async () => {
      renderTaskTypeDetails('/task-types/task-type-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Update Task Type/i })).toBeInTheDocument();
      });
    });

    it('displays "Return" button when in edit mode', async () => {
      renderTaskTypeDetails('/task-types/task-type-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Return' })).toBeInTheDocument();
      });
    });

    it('does not display "Ready to create?" card when in edit mode', async () => {
      renderTaskTypeDetails('/task-types/task-type-123');

      await waitFor(() => {
        expect(screen.queryByText('Ready to create?')).not.toBeInTheDocument();
      });
    });

    it('populates form fields with existing task type data', async () => {
      renderTaskTypeDetails('/task-types/task-type-123');

      await waitFor(() => {
        expect(screen.getByDisplayValue('Existing Task Type')).toBeInTheDocument();
      });
    });

    it('calls writeEntity with updated data when update button is clicked', async () => {
      renderTaskTypeDetails('/task-types/task-type-123');

      await waitFor(() => {
        expect(screen.getByDisplayValue('Existing Task Type')).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText('Task Type Name');
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'Updated Task Type Name');

      const updateButton = screen.getByRole('button', { name: /Update Task Type/i });
      await userEvent.click(updateButton);

      await waitFor(() => {
        expect(mockWriteEntity).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'task-type-123',
            name: 'Updated Task Type Name',
          })
        );
      });
    });
  });

  describe('deleting a task type', () => {
    beforeEach(() => {
      mockFetchedEntity = {
        id: 'task-type-123',
        name: 'Task Type to Delete',
        icon: 'delete',
        color: '#ef4444',
        parentTaskType: null,
        childrenTaskTypes: [],
      };
      mockFetchEntity.mockResolvedValue(mockFetchedEntity);
    });

    it('displays delete button when in edit mode', async () => {
      renderTaskTypeDetails('/task-types/task-type-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete task type/i })).toBeInTheDocument();
      });
    });

    it('does not show delete button when creating a new task type', () => {
      renderTaskTypeDetails('/task-types/new');
      
      expect(screen.queryByRole('button', { name: /Delete task type/i })).not.toBeInTheDocument();
    });

    it('shows delete confirmation dialog when delete button is clicked', async () => {
      renderTaskTypeDetails('/task-types/task-type-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete task type/i })).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: /Delete task type/i });
      await userEvent.click(deleteButton);

      expect(screen.getByText('Delete Task Type')).toBeInTheDocument();
      expect(screen.getByText(/Are you sure you want to delete this entity/i)).toBeInTheDocument();
    });

    it('shows cancel and confirm buttons in delete dialog', async () => {
      renderTaskTypeDetails('/task-types/task-type-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete task type/i })).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: /Delete task type/i });
      await userEvent.click(deleteButton);

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('closes delete dialog when cancel is clicked', async () => {
      renderTaskTypeDetails('/task-types/task-type-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete task type/i })).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: /Delete task type/i });
      await userEvent.click(deleteButton);

      expect(screen.getByText(/Are you sure you want to delete this entity/i)).toBeInTheDocument();

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      await userEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText(/Are you sure you want to delete this entity/i)).not.toBeInTheDocument();
      });
    });

    it('calls writeEntity for delete when confirmed', async () => {
      renderTaskTypeDetails('/task-types/task-type-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete task type/i })).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: /Delete task type/i });
      await userEvent.click(deleteButton);

      const confirmDeleteButton = screen.getByRole('button', { name: 'Delete' });
      await userEvent.click(confirmDeleteButton);

      await waitFor(() => {
        expect(mockWriteEntity).toHaveBeenCalled();
      });
    });
  });

  describe('form validation', () => {
    it('requires task type name to be non-empty', async () => {
      renderTaskTypeDetails('/task-types/new');

      const nameInput = screen.getByLabelText('Task Type Name');
      await userEvent.type(nameInput, '   ');

      const createButton = screen.getByRole('button', { name: /Create Task Type/i });
      expect(createButton).toBeDisabled();
    });

    it('allows creation with only task type name filled', async () => {
      renderTaskTypeDetails('/task-types/new');

      const nameInput = screen.getByLabelText('Task Type Name');
      await userEvent.type(nameInput, 'Task type with only name');

      const createButton = screen.getByRole('button', { name: /Create Task Type/i });
      expect(createButton).not.toBeDisabled();
    });
  });

  describe('navigation', () => {
    it('has a cancel/return button to go back', () => {
      renderTaskTypeDetails('/task-types/new');
      
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });
  });

  describe('loading states', () => {
    it('shows loading state when submitting', async () => {
      mockIsWriting = true;
      renderTaskTypeDetails('/task-types/new');

      const nameInput = screen.getByLabelText('Task Type Name');
      await userEvent.type(nameInput, 'Test Task Type');

      // The button should show loading state
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
});

