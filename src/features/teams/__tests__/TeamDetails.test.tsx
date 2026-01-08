import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TeamDetails } from '../TeamDetails';

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

const renderTeamDetails = (route = '/teams/new') => {
  const path = route.includes('/new') ? '/teams/new' : '/teams/:entity_id';
  
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={<TeamDetails {...defaultProps} />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('TeamDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchedEntity = null;
    mockIsFetchingEntity = false;
    mockIsWriting = false;
    mockFetchEntity.mockResolvedValue(null);
    mockWriteEntity.mockResolvedValue({ id: 'new-team-id' });
  });

  describe('rendering', () => {
    it('renders the team name input', () => {
      renderTeamDetails();
      expect(screen.getByLabelText('Team Name')).toBeInTheDocument();
    });

    it('renders the mission description input', () => {
      renderTeamDetails();
      expect(screen.getByLabelText('Mission Description')).toBeInTheDocument();
    });

    it('renders the Team Details card', () => {
      renderTeamDetails();
      expect(screen.getByText('Team Details')).toBeInTheDocument();
    });

    it('renders the Team Members card', () => {
      renderTeamDetails();
      expect(screen.getByText('Team Members')).toBeInTheDocument();
    });

    it('renders the Pro Tip info card', () => {
      renderTeamDetails();
      expect(screen.getByText('Pro Tip')).toBeInTheDocument();
    });

    it('sets the page title to "Team Details"', () => {
      renderTeamDetails();
      expect(mockSetPageTitle).toHaveBeenCalledWith('Team Details');
    });

    it('renders the placeholder for team name input', () => {
      renderTeamDetails();
      expect(screen.getByPlaceholderText('e.g. Platform Infrastructure')).toBeInTheDocument();
    });

    it('renders the placeholder for mission description', () => {
      renderTeamDetails();
      expect(screen.getByPlaceholderText("Describe the team's mission, strategic focus, and key responsibilities...")).toBeInTheDocument();
    });
  });

  describe('creating a new team', () => {
    it('displays "Create Team" button when in create mode', () => {
      renderTeamDetails('/teams/new');
      expect(screen.getByRole('button', { name: /Create Team/i })).toBeInTheDocument();
    });

    it('displays "Cancel" button when in create mode', () => {
      renderTeamDetails('/teams/new');
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('displays action card with "Ready to create?" title', () => {
      renderTeamDetails('/teams/new');
      expect(screen.getByText('Ready to create?')).toBeInTheDocument();
    });

    it('allows typing in the team name input', async () => {
      renderTeamDetails('/teams/new');

      const nameInput = screen.getByLabelText('Team Name');
      await userEvent.type(nameInput, 'My New Team');

      expect(nameInput).toHaveValue('My New Team');
    });

    it('allows typing in the mission description', async () => {
      renderTeamDetails('/teams/new');

      const descriptionInput = screen.getByLabelText('Mission Description');
      await userEvent.type(descriptionInput, 'This is our mission');

      expect(descriptionInput).toHaveValue('This is our mission');
    });

    it('disables submit button when team name is empty', () => {
      renderTeamDetails('/teams/new');
      
      const createButton = screen.getByRole('button', { name: /Create Team/i });
      expect(createButton).toBeDisabled();
    });

    it('enables submit button when team name is provided', async () => {
      renderTeamDetails('/teams/new');

      const nameInput = screen.getByLabelText('Team Name');
      await userEvent.type(nameInput, 'Valid Team Name');

      const createButton = screen.getByRole('button', { name: /Create Team/i });
      expect(createButton).not.toBeDisabled();
    });

    it('calls writeEntity when create button is clicked with valid data', async () => {
      renderTeamDetails('/teams/new');

      const nameInput = screen.getByLabelText('Team Name');
      await userEvent.type(nameInput, 'New Team');

      const descriptionInput = screen.getByLabelText('Mission Description');
      await userEvent.type(descriptionInput, 'Team description');

      const createButton = screen.getByRole('button', { name: /Create Team/i });
      await userEvent.click(createButton);

      await waitFor(() => {
        expect(mockWriteEntity).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'New Team',
            description: 'Team description',
          })
        );
      });
    });
  });

  describe('editing an existing team', () => {
    beforeEach(() => {
      mockFetchedEntity = {
        id: 'team-123',
        name: 'Existing Team',
        description: 'Existing description',
        members: [],
      };
      mockFetchEntity.mockResolvedValue(mockFetchedEntity);
    });

    it('fetches the team data when editing', async () => {
      renderTeamDetails('/teams/team-123');

      await waitFor(() => {
        expect(mockFetchEntity).toHaveBeenCalledWith('team-123');
      });
    });

    it('displays "Update Team" button when in edit mode', async () => {
      renderTeamDetails('/teams/team-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Update Team/i })).toBeInTheDocument();
      });
    });

    it('displays "Return" button when in edit mode', async () => {
      renderTeamDetails('/teams/team-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Return' })).toBeInTheDocument();
      });
    });

    it('does not display "Ready to create?" card when in edit mode', async () => {
      renderTeamDetails('/teams/team-123');

      await waitFor(() => {
        expect(screen.queryByText('Ready to create?')).not.toBeInTheDocument();
      });
    });

    it('populates form fields with existing team data', async () => {
      renderTeamDetails('/teams/team-123');

      await waitFor(() => {
        expect(screen.getByDisplayValue('Existing Team')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Existing description')).toBeInTheDocument();
      });
    });

    it('calls writeEntity with updated data when update button is clicked', async () => {
      renderTeamDetails('/teams/team-123');

      await waitFor(() => {
        expect(screen.getByDisplayValue('Existing Team')).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText('Team Name');
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'Updated Team Name');

      const updateButton = screen.getByRole('button', { name: /Update Team/i });
      await userEvent.click(updateButton);

      await waitFor(() => {
        expect(mockWriteEntity).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'team-123',
            name: 'Updated Team Name',
          })
        );
      });
    });
  });

  describe('deleting a team', () => {
    beforeEach(() => {
      mockFetchedEntity = {
        id: 'team-123',
        name: 'Team to Delete',
        description: 'Description',
        members: [],
      };
      mockFetchEntity.mockResolvedValue(mockFetchedEntity);
    });

    it('displays delete button when in edit mode', async () => {
      renderTeamDetails('/teams/team-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete team/i })).toBeInTheDocument();
      });
    });

    it('does not show delete button when creating a new team', () => {
      renderTeamDetails('/teams/new');
      
      expect(screen.queryByRole('button', { name: /Delete team/i })).not.toBeInTheDocument();
    });

    it('shows delete confirmation dialog when delete button is clicked', async () => {
      renderTeamDetails('/teams/team-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete team/i })).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: /Delete team/i });
      await userEvent.click(deleteButton);

      expect(screen.getByText('Delete Team')).toBeInTheDocument();
      expect(screen.getByText(/Are you sure you want to delete this entity/i)).toBeInTheDocument();
    });

    it('shows cancel and confirm buttons in delete dialog', async () => {
      renderTeamDetails('/teams/team-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete team/i })).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: /Delete team/i });
      await userEvent.click(deleteButton);

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('closes delete dialog when cancel is clicked', async () => {
      renderTeamDetails('/teams/team-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete team/i })).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: /Delete team/i });
      await userEvent.click(deleteButton);

      expect(screen.getByText(/Are you sure you want to delete this entity/i)).toBeInTheDocument();

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      await userEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText(/Are you sure you want to delete this entity/i)).not.toBeInTheDocument();
      });
    });

    it('calls writeEntity for delete when confirmed', async () => {
      renderTeamDetails('/teams/team-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete team/i })).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: /Delete team/i });
      await userEvent.click(deleteButton);

      const confirmDeleteButton = screen.getByRole('button', { name: 'Delete' });
      await userEvent.click(confirmDeleteButton);

      await waitFor(() => {
        expect(mockWriteEntity).toHaveBeenCalled();
      });
    });
  });

  describe('form validation', () => {
    it('requires team name to be non-empty', async () => {
      renderTeamDetails('/teams/new');

      const nameInput = screen.getByLabelText('Team Name');
      await userEvent.type(nameInput, '   ');

      const createButton = screen.getByRole('button', { name: /Create Team/i });
      expect(createButton).toBeDisabled();
    });

    it('allows creation with only team name filled', async () => {
      renderTeamDetails('/teams/new');

      const nameInput = screen.getByLabelText('Team Name');
      await userEvent.type(nameInput, 'Team with only name');

      const createButton = screen.getByRole('button', { name: /Create Team/i });
      expect(createButton).not.toBeDisabled();
    });
  });

  describe('navigation', () => {
    it('has a cancel/return button to go back', () => {
      renderTeamDetails('/teams/new');
      
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });
  });

  describe('loading states', () => {
    it('shows loading state when submitting', async () => {
      mockIsWriting = true;
      renderTeamDetails('/teams/new');

      const nameInput = screen.getByLabelText('Team Name');
      await userEvent.type(nameInput, 'Test Team');

      // The button should show loading state
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
});

