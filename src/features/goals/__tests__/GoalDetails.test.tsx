import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { GoalDetails } from '../CreateUpdateGoal';
import { GoalStatus, GoalType } from '../../../shared/models/goal';

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

// Mock useFetchEntities for teams and goals
const mockFetchTeams = jest.fn();
const mockFetchGoals = jest.fn();
let mockCallCount = 0;

jest.mock('../../../shared/hooks/generic-entities/useFetchEntities', () => ({
  useFetchEntities: (endpoint: string) => {
    mockCallCount++;
    if (endpoint === '/api/teams') {
      return {
        fetchEntities: mockFetchTeams,
        entities: [],
        isLoading: false,
        error: null,
      };
    }
    if (endpoint === '/api/goals') {
      return {
        fetchEntities: mockFetchGoals,
        entities: [],
        isLoading: false,
        error: null,
      };
    }
    return {
      fetchEntities: jest.fn(),
      entities: [],
      isLoading: false,
      error: null,
    };
  },
}));

// Mock useSearchUserByLogin
const mockSearchUser = jest.fn();
jest.mock('../../teams/hooks/useSearchUserByLogin', () => ({
  useSearchUserByLogin: () => ({
    searchUser: mockSearchUser,
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

const renderGoalDetails = (route = '/goals/new') => {
  const path = route.includes('/new') ? '/goals/new' : '/goals/:entity_id';
  
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={<GoalDetails {...defaultProps} />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('GoalDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchedEntity = null;
    mockIsFetchingEntity = false;
    mockIsWriting = false;
    mockCallCount = 0;
    mockFetchEntity.mockResolvedValue(null);
    mockWriteEntity.mockResolvedValue({ id: 'new-goal-id' });
    mockSearchUser.mockResolvedValue(null);
    mockFetchTeams.mockResolvedValue([]);
    mockFetchGoals.mockResolvedValue([]);
  });

  describe('rendering', () => {
    it('renders the goal title input', () => {
      renderGoalDetails();
      expect(screen.getByLabelText('Goal Title')).toBeInTheDocument();
    });

    it('renders the description input', () => {
      renderGoalDetails();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
    });

    it('renders the due date input', () => {
      renderGoalDetails();
      expect(screen.getByLabelText(/Due Date/)).toBeInTheDocument();
    });

    it('renders the Goal Details card', () => {
      renderGoalDetails();
      expect(screen.getByText('Goal Details')).toBeInTheDocument();
    });

    it('renders the Assignment card', () => {
      renderGoalDetails();
      expect(screen.getByText('Assignment')).toBeInTheDocument();
    });

    it('renders the Hierarchy card', () => {
      renderGoalDetails();
      expect(screen.getByText('Hierarchy (Optional)')).toBeInTheDocument();
    });

    it('renders the Pro Tip info card', () => {
      renderGoalDetails();
      expect(screen.getByText('Pro Tip')).toBeInTheDocument();
    });

    it('sets the page title to "Goal Details"', () => {
      renderGoalDetails();
      expect(mockSetPageTitle).toHaveBeenCalledWith('Goal Details');
    });

    it('renders the placeholder for goal title input', () => {
      renderGoalDetails();
      expect(screen.getByPlaceholderText('e.g. Reduce technical debt by 30%')).toBeInTheDocument();
    });

    it('renders the placeholder for description', () => {
      renderGoalDetails();
      expect(screen.getByPlaceholderText('Provide details about the goal, success criteria, and key initiatives...')).toBeInTheDocument();
    });

    it('renders goal type dropdown', () => {
      renderGoalDetails();
      const typeSelect = screen.getByLabelText('Goal Type');
      expect(typeSelect).toBeInTheDocument();
    });

    it('renders status dropdown', () => {
      renderGoalDetails();
      const statusSelect = screen.getByLabelText('Status');
      expect(statusSelect).toBeInTheDocument();
    });
  });

  describe('creating a new goal', () => {
    it('displays "Create Goal" button when in create mode', () => {
      renderGoalDetails('/goals/new');
      expect(screen.getByRole('button', { name: /Create Goal/i })).toBeInTheDocument();
    });

    it('displays "Cancel" button when in create mode', () => {
      renderGoalDetails('/goals/new');
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('displays action card with "Ready to create?" title', () => {
      renderGoalDetails('/goals/new');
      expect(screen.getByText('Ready to create?')).toBeInTheDocument();
    });

    it('allows typing in the goal title input', async () => {
      renderGoalDetails('/goals/new');

      const titleInput = screen.getByLabelText('Goal Title');
      await userEvent.type(titleInput, 'My New Goal');

      expect(titleInput).toHaveValue('My New Goal');
    });

    it('allows typing in the description', async () => {
      renderGoalDetails('/goals/new');

      const descriptionInput = screen.getByLabelText('Description');
      await userEvent.type(descriptionInput, 'This is a test goal');

      expect(descriptionInput).toHaveValue('This is a test goal');
    });

    it('allows setting due date', async () => {
      renderGoalDetails('/goals/new');

      const dueDateInput = screen.getByLabelText(/Due Date/);
      await userEvent.type(dueDateInput, '2024-12-31');

      expect(dueDateInput).toHaveValue('2024-12-31');
    });

    it('allows changing goal type', async () => {
      renderGoalDetails('/goals/new');

      const typeSelect = screen.getByLabelText('Goal Type');
      await userEvent.selectOptions(typeSelect, GoalType.ORGANIZATIONAL);

      expect(typeSelect).toHaveValue(GoalType.ORGANIZATIONAL);
    });

    it('allows changing status', async () => {
      renderGoalDetails('/goals/new');

      const statusSelect = screen.getByLabelText('Status');
      await userEvent.selectOptions(statusSelect, GoalStatus.IN_PROGRESS);

      expect(statusSelect).toHaveValue(GoalStatus.IN_PROGRESS);
    });

    it('disables submit button when goal title is empty', () => {
      renderGoalDetails('/goals/new');
      
      const createButton = screen.getByRole('button', { name: /Create Goal/i });
      expect(createButton).toBeDisabled();
    });

    it('disables submit button when due date is not set', async () => {
      renderGoalDetails('/goals/new');
      
      mockSearchUser.mockResolvedValue({ id: 'user-1', name: 'John Doe', login: 'jdoe' });
      
      const titleInput = screen.getByLabelText('Goal Title');
      await userEvent.type(titleInput, 'Valid Title');
      
      // Simulate selecting a user
      const searchInput = screen.getByPlaceholderText('Find users by name or email...');
      await userEvent.type(searchInput, 'jdoe{enter}');

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const createButton = screen.getByRole('button', { name: /Create Goal/i });
      expect(createButton).toBeDisabled();
    });

    it('disables submit button when user is not set for personal goal', async () => {
      renderGoalDetails('/goals/new');

      const titleInput = screen.getByLabelText('Goal Title');
      await userEvent.type(titleInput, 'Valid Title');
      
      const dueDateInput = screen.getByLabelText(/Due Date/);
      await userEvent.type(dueDateInput, '2024-12-31');

      const createButton = screen.getByRole('button', { name: /Create Goal/i });
      expect(createButton).toBeDisabled();
    });

    it('disables submit button when team is not set for organizational goal', async () => {
      renderGoalDetails('/goals/new');

      const titleInput = screen.getByLabelText('Goal Title');
      await userEvent.type(titleInput, 'Valid Title');
      
      const dueDateInput = screen.getByLabelText(/Due Date/);
      await userEvent.type(dueDateInput, '2024-12-31');

      const typeSelect = screen.getByLabelText('Goal Type');
      await userEvent.selectOptions(typeSelect, GoalType.ORGANIZATIONAL);

      const createButton = screen.getByRole('button', { name: /Create Goal/i });
      expect(createButton).toBeDisabled();
    });

    it('enables submit button when goal title, due date, and user are provided for personal goal', async () => {
      mockSearchUser.mockResolvedValue({ id: 'user-1', name: 'John Doe', login: 'jdoe' });
      renderGoalDetails('/goals/new');

      const titleInput = screen.getByLabelText('Goal Title');
      await userEvent.type(titleInput, 'Valid Title');
      
      const dueDateInput = screen.getByLabelText(/Due Date/);
      await userEvent.type(dueDateInput, '2024-12-31');

      // Simulate selecting a user
      const searchInput = screen.getByPlaceholderText('Find users by name or email...');
      await userEvent.type(searchInput, 'jdoe{enter}');

      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /Create Goal/i });
        expect(createButton).not.toBeDisabled();
      });
    });
  });

  describe('editing an existing goal', () => {
    beforeEach(() => {
      mockFetchedEntity = {
        id: 'goal-123',
        name: 'Existing Goal',
        type: GoalType.PERSONAL,
        status: GoalStatus.IN_PROGRESS,
        due_date: new Date('2024-12-31'),
        description: 'Existing description',
        user: { id: 'user-1', name: 'John Doe', login: 'jdoe' },
        team: null,
        parent_goal: null,
        children: [],
      };
      mockFetchEntity.mockResolvedValue(mockFetchedEntity);
    });

    it('fetches the goal data when editing', async () => {
      renderGoalDetails('/goals/goal-123');

      await waitFor(() => {
        expect(mockFetchEntity).toHaveBeenCalledWith('goal-123');
      });
    });

    it('displays "Update Goal" button when in edit mode', async () => {
      renderGoalDetails('/goals/goal-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Update Goal/i })).toBeInTheDocument();
      });
    });

    it('displays "Return" button when in edit mode', async () => {
      renderGoalDetails('/goals/goal-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Return' })).toBeInTheDocument();
      });
    });

    it('does not display "Ready to create?" card when in edit mode', async () => {
      renderGoalDetails('/goals/goal-123');

      await waitFor(() => {
        expect(screen.queryByText('Ready to create?')).not.toBeInTheDocument();
      });
    });

    it('populates form fields with existing goal data', async () => {
      renderGoalDetails('/goals/goal-123');

      await waitFor(() => {
        expect(screen.getByDisplayValue('Existing Goal')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Existing description')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });

    it('calls writeEntity with updated data when update button is clicked', async () => {
      renderGoalDetails('/goals/goal-123');

      await waitFor(() => {
        expect(screen.getByDisplayValue('Existing Goal')).toBeInTheDocument();
      });

      const titleInput = screen.getByLabelText('Goal Title');
      await userEvent.clear(titleInput);
      await userEvent.type(titleInput, 'Updated Goal Title');

      const updateButton = screen.getByRole('button', { name: /Update Goal/i });
      await userEvent.click(updateButton);

      await waitFor(() => {
        expect(mockWriteEntity).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'goal-123',
            name: 'Updated Goal Title',
          })
        );
      });
    });
  });

  describe('deleting a goal', () => {
    beforeEach(() => {
      mockFetchedEntity = {
        id: 'goal-123',
        name: 'Goal to Delete',
        type: GoalType.PERSONAL,
        status: GoalStatus.NOT_STARTED,
        due_date: new Date('2024-12-31'),
        description: 'Description',
        user: { id: 'user-1', name: 'John Doe', login: 'jdoe' },
        team: null,
        parent_goal: null,
        children: [],
      };
      mockFetchEntity.mockResolvedValue(mockFetchedEntity);
    });

    it('displays delete button when in edit mode', async () => {
      renderGoalDetails('/goals/goal-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete goal/i })).toBeInTheDocument();
      });
    });

    it('does not show delete button when creating a new goal', () => {
      renderGoalDetails('/goals/new');
      
      expect(screen.queryByRole('button', { name: /Delete goal/i })).not.toBeInTheDocument();
    });

    it('shows delete confirmation dialog when delete button is clicked', async () => {
      renderGoalDetails('/goals/goal-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete goal/i })).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: /Delete goal/i });
      await userEvent.click(deleteButton);

      expect(screen.getByText('Delete Goal')).toBeInTheDocument();
      expect(screen.getByText(/Are you sure you want to delete this entity/i)).toBeInTheDocument();
    });

    it('shows cancel and confirm buttons in delete dialog', async () => {
      renderGoalDetails('/goals/goal-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete goal/i })).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: /Delete goal/i });
      await userEvent.click(deleteButton);

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('closes delete dialog when cancel is clicked', async () => {
      renderGoalDetails('/goals/goal-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete goal/i })).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: /Delete goal/i });
      await userEvent.click(deleteButton);

      expect(screen.getByText(/Are you sure you want to delete this entity/i)).toBeInTheDocument();

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      await userEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText(/Are you sure you want to delete this entity/i)).not.toBeInTheDocument();
      });
    });

    it('calls writeEntity for delete when confirmed', async () => {
      renderGoalDetails('/goals/goal-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete goal/i })).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: /Delete goal/i });
      await userEvent.click(deleteButton);

      const confirmDeleteButton = screen.getByRole('button', { name: 'Delete' });
      await userEvent.click(confirmDeleteButton);

      await waitFor(() => {
        expect(mockWriteEntity).toHaveBeenCalled();
      });
    });
  });

  describe('form validation', () => {
    it('requires goal title to be non-empty', async () => {
      renderGoalDetails('/goals/new');

      const titleInput = screen.getByLabelText('Goal Title');
      await userEvent.type(titleInput, '   ');
      
      const dueDateInput = screen.getByLabelText(/Due Date/);
      await userEvent.type(dueDateInput, '2024-12-31');

      const createButton = screen.getByRole('button', { name: /Create Goal/i });
      expect(createButton).toBeDisabled();
    });
    
    it('requires due date to be set', async () => {
      mockSearchUser.mockResolvedValue({ id: 'user-1', name: 'John Doe', login: 'jdoe' });
      renderGoalDetails('/goals/new');

      const titleInput = screen.getByLabelText('Goal Title');
      await userEvent.type(titleInput, 'Valid Title');
      
      // Simulate selecting a user
      const searchInput = screen.getByPlaceholderText('Find users by name or email...');
      await userEvent.type(searchInput, 'jdoe{enter}');

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const createButton = screen.getByRole('button', { name: /Create Goal/i });
      expect(createButton).toBeDisabled();
    });

    it('requires user to be selected for personal goal', async () => {
      renderGoalDetails('/goals/new');

      const titleInput = screen.getByLabelText('Goal Title');
      await userEvent.type(titleInput, 'Valid Title');
      
      const dueDateInput = screen.getByLabelText(/Due Date/);
      await userEvent.type(dueDateInput, '2024-12-31');

      const createButton = screen.getByRole('button', { name: /Create Goal/i });
      expect(createButton).toBeDisabled();
    });

    it('requires team to be selected for organizational goal', async () => {
      renderGoalDetails('/goals/new');

      const titleInput = screen.getByLabelText('Goal Title');
      await userEvent.type(titleInput, 'Valid Title');
      
      const dueDateInput = screen.getByLabelText(/Due Date/);
      await userEvent.type(dueDateInput, '2024-12-31');

      const typeSelect = screen.getByLabelText('Goal Type');
      await userEvent.selectOptions(typeSelect, GoalType.ORGANIZATIONAL);

      const createButton = screen.getByRole('button', { name: /Create Goal/i });
      expect(createButton).toBeDisabled();
    });
  });

  describe('navigation', () => {
    it('has a cancel/return button to go back', () => {
      renderGoalDetails('/goals/new');
      
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });
  });

  describe('loading states', () => {
    it('shows loading state when submitting', async () => {
      mockIsWriting = true;
      mockSearchUser.mockResolvedValue({ id: 'user-1', name: 'John Doe', login: 'jdoe' });
      renderGoalDetails('/goals/new');

      const titleInput = screen.getByLabelText('Goal Title');
      await userEvent.type(titleInput, 'Test Goal');

      // Simulate selecting a user
      const searchInput = screen.getByPlaceholderText('Find users by name or email...');
      await userEvent.type(searchInput, 'jdoe{enter}');

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // The button should show loading state
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
});

