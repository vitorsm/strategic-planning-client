import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TaskTypePage } from '../TaskTypePage';

// Mock the hooks
const mockFetchEntities = jest.fn();
let mockEntities: any[] = [];
let mockIsLoading = false;
let mockError: string | null = null;

jest.mock('../../../shared/hooks/generic-entities/useFetchEntities', () => ({
  useFetchEntities: () => ({
    fetchEntities: mockFetchEntities,
    entities: mockEntities,
    isLoading: mockIsLoading,
    error: mockError,
  }),
}));

const mockFetchEntity = jest.fn();
let mockFetchedEntity: any = null;
jest.mock('../../../shared/hooks/generic-entities/useFetchEntity', () => ({
  useFetchEntity: () => ({
    fetchEntity: mockFetchEntity,
    entity: mockFetchedEntity,
    isLoading: false,
    error: null,
  }),
}));

const mockWriteEntity = jest.fn();
jest.mock('../../../shared/hooks/generic-entities/useWriteEntity', () => ({
  useWriteEntity: () => ({
    writeEntity: mockWriteEntity,
    isLoading: false,
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

const renderTaskTypePage = (initialRoute = '/task-types') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/task-types/*" element={<TaskTypePage {...defaultProps} />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('TaskTypePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEntities = [];
    mockIsLoading = false;
    mockError = null;
    mockFetchedEntity = null;
    mockFetchEntity.mockResolvedValue(null);
    mockWriteEntity.mockResolvedValue(true);
  });

  describe('rendering', () => {
    it('renders the search input', () => {
      renderTaskTypePage();
      expect(screen.getByPlaceholderText('Search task types...')).toBeInTheDocument();
    });

    it('renders the refresh button', () => {
      renderTaskTypePage();
      expect(screen.getByText('refresh')).toBeInTheDocument();
    });

    it('displays empty state when no task types exist', () => {
      mockEntities = [];
      renderTaskTypePage();
      expect(screen.getByText('No items found')).toBeInTheDocument();
      expect(screen.getByText('Create your first item to get started')).toBeInTheDocument();
    });

    it('sets the page title to "Task Types Management"', () => {
      renderTaskTypePage();
      expect(mockSetPageTitle).toHaveBeenCalledWith('Task Types Management');
    });

    it('sets the page subtitle', () => {
      renderTaskTypePage();
      expect(mockSetPageSubtitle).toHaveBeenCalledWith('Manage your task types');
    });

    it('sets up the primary action button with "New Task Type" label', () => {
      renderTaskTypePage();
      expect(mockSetPrimaryActionButton).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'New Task Type',
          icon: 'add',
        })
      );
    });
  });

  describe('displaying task types in table', () => {
    it('displays task types in the table', () => {
      mockEntities = [
        { id: '1', name: 'Bug', icon: 'bug_report', color: '#ef4444', parentTaskType: null },
        { id: '2', name: 'Feature', icon: 'star', color: '#22c55e', parentTaskType: null },
      ];
      renderTaskTypePage();

      expect(screen.getByText('Bug')).toBeInTheDocument();
      expect(screen.getByText('Feature')).toBeInTheDocument();
    });

    it('displays the correct icon info for each task type', () => {
      mockEntities = [
        { id: '1', name: 'Bug', icon: 'bug_report', color: '#ef4444', parentTaskType: { name: 'Issue' } },
        { id: '2', name: 'Feature', icon: 'star', color: '#22c55e', parentTaskType: null },
      ];
      renderTaskTypePage();

      expect(screen.getByText('Icon: bug_report')).toBeInTheDocument();
      expect(screen.getByText('Icon: star')).toBeInTheDocument();
    });

    it('displays loading state when fetching task types', () => {
      mockIsLoading = true;
      renderTaskTypePage();
      
      // Table should show loading indicator
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('search functionality', () => {
    it('filters task types based on search query', async () => {
      mockEntities = [
        { id: '1', name: 'Bug', icon: 'bug_report', color: '#ef4444', parentTaskType: null },
        { id: '2', name: 'Feature', icon: 'star', color: '#22c55e', parentTaskType: null },
        { id: '3', name: 'Story', icon: 'book', color: '#3b82f6', parentTaskType: null },
      ];
      renderTaskTypePage();

      const searchInput = screen.getByPlaceholderText('Search task types...');
      await userEvent.type(searchInput, 'Bug');

      expect(screen.getByText('Bug')).toBeInTheDocument();
      expect(screen.queryByText('Feature')).not.toBeInTheDocument();
      expect(screen.queryByText('Story')).not.toBeInTheDocument();
    });

    it('shows empty state when search has no results', async () => {
      mockEntities = [
        { id: '1', name: 'Bug', icon: 'bug_report', color: '#ef4444', parentTaskType: null },
      ];
      renderTaskTypePage();

      const searchInput = screen.getByPlaceholderText('Search task types...');
      await userEvent.type(searchInput, 'Nonexistent');

      expect(screen.getByText('No items found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search query')).toBeInTheDocument();
    });

    it('clears search and shows all task types', async () => {
      mockEntities = [
        { id: '1', name: 'Bug', icon: 'bug_report', color: '#ef4444', parentTaskType: null },
        { id: '2', name: 'Feature', icon: 'star', color: '#22c55e', parentTaskType: null },
      ];
      renderTaskTypePage();

      const searchInput = screen.getByPlaceholderText('Search task types...');
      await userEvent.type(searchInput, 'Bug');
      expect(screen.queryByText('Feature')).not.toBeInTheDocument();

      await userEvent.clear(searchInput);
      expect(screen.getByText('Bug')).toBeInTheDocument();
      expect(screen.getByText('Feature')).toBeInTheDocument();
    });
  });

  describe('refresh functionality', () => {
    it('calls fetchEntities when refresh button is clicked', async () => {
      mockEntities = [
        { id: '1', name: 'Bug', icon: 'bug_report', color: '#ef4444', parentTaskType: null },
      ];
      renderTaskTypePage();

      const refreshButton = screen.getByText('refresh').closest('button');
      expect(refreshButton).toBeInTheDocument();

      await userEvent.click(refreshButton!);

      expect(mockFetchEntities).toHaveBeenCalled();
    });
  });

  describe('navigation', () => {
    it('sets up navigation to create new task type', () => {
      renderTaskTypePage();

      // Check that the primary action button is set up with onClick handler
      expect(mockSetPrimaryActionButton).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'New Task Type',
          onClick: expect.any(Function),
        })
      );
    });
  });

  describe('delete task type flow', () => {
    it('refreshes the list after clicking a task type, deleting it, and confirming', async () => {
      // Setup: Task type exists in the list
      mockEntities = [
        { id: 'task-type-1', name: 'Task Type to Delete', icon: 'delete', color: '#ef4444', parentTaskType: null, childrenTaskTypes: [] },
      ];
      
      // Setup: When task type details are fetched
      const taskTypeData = { 
        id: 'task-type-1', 
        name: 'Task Type to Delete', 
        icon: 'delete',
        color: '#ef4444',
        parentTaskType: null,
        childrenTaskTypes: [],
      };
      mockFetchEntity.mockResolvedValue(taskTypeData);
      mockFetchedEntity = taskTypeData;
      
      // Setup: Delete will succeed
      mockWriteEntity.mockResolvedValue(true);
      
      renderTaskTypePage();

      // Clear the initial fetch calls
      mockFetchEntities.mockClear();

      // Step 1: Click on the task type row to navigate to details
      const taskTypeRow = screen.getByText('Task Type to Delete').closest('tr');
      expect(taskTypeRow).toBeInTheDocument();
      await userEvent.click(taskTypeRow!);

      // Step 2: Wait for the details page to load and show the delete button
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete task type/i })).toBeInTheDocument();
      });

      // Step 3: Click the delete button
      const deleteButton = screen.getByRole('button', { name: /Delete task type/i });
      await userEvent.click(deleteButton);

      // Step 4: Confirm deletion in the dialog
      await waitFor(() => {
        expect(screen.getByText(/Are you sure you want to delete this entity/i)).toBeInTheDocument();
      });
      
      const confirmDeleteButton = screen.getByRole('button', { name: 'Delete' });
      await userEvent.click(confirmDeleteButton);

      // Step 5: Verify that fetchEntities was called again to refresh the list
      await waitFor(() => {
        expect(mockFetchEntities).toHaveBeenCalled();
      });
    });
  });
});

