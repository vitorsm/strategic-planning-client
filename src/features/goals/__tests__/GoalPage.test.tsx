import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { GoalPage } from '../GoalPage';
import { GoalStatus, GoalType } from '../../../shared/models/goal';

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

// Mock useSearchUserByLogin
jest.mock('../../teams/hooks/useSearchUserByLogin', () => ({
  useSearchUserByLogin: () => ({
    searchUser: jest.fn(),
    users: [],
    isLoading: false,
    error: null,
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

const renderGoalPage = (initialRoute = '/goals') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/goals/*" element={<GoalPage {...defaultProps} />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('GoalPage', () => {
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
      renderGoalPage();
      expect(screen.getByPlaceholderText('Search goals...')).toBeInTheDocument();
    });

    it('renders the refresh button', () => {
      renderGoalPage();
      expect(screen.getByText('refresh')).toBeInTheDocument();
    });

    it('displays empty state when no goals exist', () => {
      mockEntities = [];
      renderGoalPage();
      expect(screen.getByText('No items found')).toBeInTheDocument();
      expect(screen.getByText('Create your first item to get started')).toBeInTheDocument();
    });

    it('sets the page title to "Goals Management"', () => {
      renderGoalPage();
      expect(mockSetPageTitle).toHaveBeenCalledWith('Goals Management');
    });

    it('sets the page subtitle', () => {
      renderGoalPage();
      expect(mockSetPageSubtitle).toHaveBeenCalledWith('Track and manage personal and organizational goals');
    });

    it('sets up the primary action button with "New Goal" label', () => {
      renderGoalPage();
      expect(mockSetPrimaryActionButton).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'New Goal',
          icon: 'add',
        })
      );
    });
  });

  describe('displaying goals in table', () => {
    it('displays goals in the table', () => {
      mockEntities = [
        { id: '1', name: 'Reduce Technical Debt', type: GoalType.ORGANIZATIONAL, status: GoalStatus.IN_PROGRESS, due_date: new Date('2024-12-31'), team: { name: 'Engineering' }, user: null, children: [] },
        { id: '2', name: 'Complete Certification', type: GoalType.PERSONAL, status: GoalStatus.NOT_STARTED, due_date: new Date('2024-11-30'), user: { name: 'John Doe' }, team: null, children: [] },
      ];
      renderGoalPage();

      expect(screen.getByText('Reduce Technical Debt')).toBeInTheDocument();
      expect(screen.getByText('Complete Certification')).toBeInTheDocument();
    });

    it('displays the correct assignment for each goal', () => {
      mockEntities = [
        { id: '1', name: 'Team Goal', type: GoalType.ORGANIZATIONAL, status: GoalStatus.IN_PROGRESS, due_date: new Date('2024-12-31'), team: { name: 'Engineering' }, user: null, children: [] },
        { id: '2', name: 'Personal Goal', type: GoalType.PERSONAL, status: GoalStatus.NOT_STARTED, due_date: new Date('2024-11-30'), user: { name: 'John Doe' }, team: null, children: [] },
      ];
      renderGoalPage();

      expect(screen.getByText('Engineering')).toBeInTheDocument();
      expect(screen.getByText('Personal - John Doe')).toBeInTheDocument();
    });

    it('displays status badges for goals', () => {
      mockEntities = [
        { id: '1', name: 'Goal 1', type: GoalType.ORGANIZATIONAL, status: GoalStatus.IN_PROGRESS, due_date: new Date('2024-12-31'), team: { name: 'Engineering' }, user: null, children: [] },
        { id: '2', name: 'Goal 2', type: GoalType.PERSONAL, status: GoalStatus.DONE, due_date: new Date('2024-11-30'), user: { name: 'John Doe' }, team: null, children: [] },
      ];
      renderGoalPage();

      expect(screen.getByText('IN PROGRESS')).toBeInTheDocument();
      expect(screen.getByText('DONE')).toBeInTheDocument();
    });

    it('displays type badges for goals', () => {
      mockEntities = [
        { id: '1', name: 'Goal 1', type: GoalType.ORGANIZATIONAL, status: GoalStatus.IN_PROGRESS, due_date: new Date('2024-12-31'), team: { name: 'Engineering' }, user: null, children: [] },
        { id: '2', name: 'Goal 2', type: GoalType.PERSONAL, status: GoalStatus.NOT_STARTED, due_date: new Date('2024-11-30'), user: { name: 'John Doe' }, team: null, children: [] },
      ];
      renderGoalPage();

      expect(screen.getByText('ORGANIZATIONAL')).toBeInTheDocument();
      expect(screen.getByText('PERSONAL')).toBeInTheDocument();
    });

    it('displays loading state when fetching goals', () => {
      mockIsLoading = true;
      renderGoalPage();
      
      // Table should show loading indicator
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('search functionality', () => {
    it('filters goals based on search query', async () => {
      mockEntities = [
        { id: '1', name: 'Reduce Technical Debt', type: GoalType.ORGANIZATIONAL, status: GoalStatus.IN_PROGRESS, due_date: new Date('2024-12-31'), team: { name: 'Engineering' }, user: null, children: [] },
        { id: '2', name: 'Improve Hiring', type: GoalType.ORGANIZATIONAL, status: GoalStatus.NOT_STARTED, due_date: new Date('2024-10-31'), team: { name: 'HR' }, user: null, children: [] },
        { id: '3', name: 'Complete Certification', type: GoalType.PERSONAL, status: GoalStatus.DONE, due_date: new Date('2024-11-30'), user: { name: 'John Doe' }, team: null, children: [] },
      ];
      renderGoalPage();

      const searchInput = screen.getByPlaceholderText('Search goals...');
      await userEvent.type(searchInput, 'Reduce');

      expect(screen.getByText('Reduce Technical Debt')).toBeInTheDocument();
      expect(screen.queryByText('Improve Hiring')).not.toBeInTheDocument();
      expect(screen.queryByText('Complete Certification')).not.toBeInTheDocument();
    });

    it('shows empty state when search has no results', async () => {
      mockEntities = [
        { id: '1', name: 'Reduce Technical Debt', type: GoalType.ORGANIZATIONAL, status: GoalStatus.IN_PROGRESS, due_date: new Date('2024-12-31'), team: { name: 'Engineering' }, user: null, children: [] },
      ];
      renderGoalPage();

      const searchInput = screen.getByPlaceholderText('Search goals...');
      await userEvent.type(searchInput, 'Nonexistent');

      expect(screen.getByText('No items found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search query')).toBeInTheDocument();
    });

    it('clears search and shows all goals', async () => {
      mockEntities = [
        { id: '1', name: 'Reduce Technical Debt', type: GoalType.ORGANIZATIONAL, status: GoalStatus.IN_PROGRESS, due_date: new Date('2024-12-31'), team: { name: 'Engineering' }, user: null, children: [] },
        { id: '2', name: 'Complete Certification', type: GoalType.PERSONAL, status: GoalStatus.NOT_STARTED, due_date: new Date('2024-11-30'), user: { name: 'John Doe' }, team: null, children: [] },
      ];
      renderGoalPage();

      const searchInput = screen.getByPlaceholderText('Search goals...');
      await userEvent.type(searchInput, 'Reduce');
      expect(screen.queryByText('Complete Certification')).not.toBeInTheDocument();

      await userEvent.clear(searchInput);
      expect(screen.getByText('Reduce Technical Debt')).toBeInTheDocument();
      expect(screen.getByText('Complete Certification')).toBeInTheDocument();
    });
  });

  describe('refresh functionality', () => {
    it('calls fetchEntities when refresh button is clicked', async () => {
      mockEntities = [
        { id: '1', name: 'Reduce Technical Debt', type: GoalType.ORGANIZATIONAL, status: GoalStatus.IN_PROGRESS, due_date: new Date('2024-12-31'), team: { name: 'Engineering' }, user: null, children: [] },
      ];
      renderGoalPage();

      const refreshButton = screen.getByText('refresh').closest('button');
      expect(refreshButton).toBeInTheDocument();

      await userEvent.click(refreshButton!);

      expect(mockFetchEntities).toHaveBeenCalled();
    });
  });

  describe('navigation', () => {
    it('sets up navigation to create new goal', () => {
      renderGoalPage();

      // Check that the primary action button is set up with onClick handler
      expect(mockSetPrimaryActionButton).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'New Goal',
          onClick: expect.any(Function),
        })
      );
    });
  });

  describe('delete goal flow', () => {
    it('refreshes the list after clicking a goal, deleting it, and confirming', async () => {
      // Setup: Goal exists in the list
      mockEntities = [
        { 
          id: 'goal-1', 
          name: 'Goal to Delete', 
          type: GoalType.PERSONAL, 
          status: GoalStatus.NOT_STARTED,
          due_date: new Date('2024-12-31'),
          user: { id: 'user-1', name: 'John Doe', login: 'jdoe' }, 
          team: null,
          description: 'Test goal', 
          parent_goal: null,
          children: []
        },
      ];
      
      // Setup: When goal details are fetched
      const goalData = { 
        id: 'goal-1', 
        name: 'Goal to Delete', 
        type: GoalType.PERSONAL,
        status: GoalStatus.NOT_STARTED,
        due_date: new Date('2024-12-31'),
        description: 'Test goal',
        user: { id: 'user-1', name: 'John Doe', login: 'jdoe' },
        team: null,
        parent_goal: null,
        children: []
      };
      mockFetchEntity.mockResolvedValue(goalData);
      mockFetchedEntity = goalData;
      
      // Setup: Delete will succeed
      mockWriteEntity.mockResolvedValue(true);
      
      renderGoalPage();

      // Clear the initial fetch calls
      mockFetchEntities.mockClear();

      // Step 1: Click on the goal row to navigate to details
      const goalRow = screen.getByText('Goal to Delete').closest('tr');
      expect(goalRow).toBeInTheDocument();
      await userEvent.click(goalRow!);

      // Step 2: Wait for the details page to load and show the delete button
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete goal/i })).toBeInTheDocument();
      });

      // Step 3: Click the delete button
      const deleteButton = screen.getByRole('button', { name: /Delete goal/i });
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

