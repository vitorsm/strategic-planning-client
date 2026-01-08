import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TeamPage } from '../TeamPage';

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

const renderTeamPage = (initialRoute = '/teams') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/teams/*" element={<TeamPage {...defaultProps} />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('TeamPage', () => {
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
      renderTeamPage();
      expect(screen.getByPlaceholderText('Search teams...')).toBeInTheDocument();
    });

    it('renders the refresh button', () => {
      renderTeamPage();
      expect(screen.getByText('refresh')).toBeInTheDocument();
    });

    it('displays empty state when no teams exist', () => {
      mockEntities = [];
      renderTeamPage();
      expect(screen.getByText('No items found')).toBeInTheDocument();
      expect(screen.getByText('Create your first item to get started')).toBeInTheDocument();
    });

    it('sets the page title to "Teams Management"', () => {
      renderTeamPage();
      expect(mockSetPageTitle).toHaveBeenCalledWith('Teams Management');
    });

    it('sets the page subtitle', () => {
      renderTeamPage();
      expect(mockSetPageSubtitle).toHaveBeenCalledWith('Manage your teams');
    });

    it('sets up the primary action button with "New Team" label', () => {
      renderTeamPage();
      expect(mockSetPrimaryActionButton).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'New Team',
          icon: 'add',
        })
      );
    });
  });

  describe('displaying teams in table', () => {
    it('displays teams in the table', () => {
      mockEntities = [
        { id: '1', name: 'Engineering Team', number_of_members: 5 },
        { id: '2', name: 'Design Team', number_of_members: 3 },
      ];
      renderTeamPage();

      expect(screen.getByText('Engineering Team')).toBeInTheDocument();
      expect(screen.getByText('Design Team')).toBeInTheDocument();
    });

    it('displays the correct member count for each team', () => {
      mockEntities = [
        { id: '1', name: 'Engineering Team', number_of_members: 5 },
        { id: '2', name: 'Design Team', number_of_members: 1 },
      ];
      renderTeamPage();

      expect(screen.getByText('5 members')).toBeInTheDocument();
      expect(screen.getByText('1 member')).toBeInTheDocument();
    });

    it('displays loading state when fetching teams', () => {
      mockIsLoading = true;
      renderTeamPage();
      
      // Table should show loading indicator
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('search functionality', () => {
    it('filters teams based on search query', async () => {
      mockEntities = [
        { id: '1', name: 'Engineering Team', number_of_members: 5 },
        { id: '2', name: 'Design Team', number_of_members: 3 },
        { id: '3', name: 'Marketing Team', number_of_members: 4 },
      ];
      renderTeamPage();

      const searchInput = screen.getByPlaceholderText('Search teams...');
      await userEvent.type(searchInput, 'Engineering');

      expect(screen.getByText('Engineering Team')).toBeInTheDocument();
      expect(screen.queryByText('Design Team')).not.toBeInTheDocument();
      expect(screen.queryByText('Marketing Team')).not.toBeInTheDocument();
    });

    it('shows empty state when search has no results', async () => {
      mockEntities = [
        { id: '1', name: 'Engineering Team', number_of_members: 5 },
      ];
      renderTeamPage();

      const searchInput = screen.getByPlaceholderText('Search teams...');
      await userEvent.type(searchInput, 'Nonexistent');

      expect(screen.getByText('No items found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search query')).toBeInTheDocument();
    });

    it('clears search and shows all teams', async () => {
      mockEntities = [
        { id: '1', name: 'Engineering Team', number_of_members: 5 },
        { id: '2', name: 'Design Team', number_of_members: 3 },
      ];
      renderTeamPage();

      const searchInput = screen.getByPlaceholderText('Search teams...');
      await userEvent.type(searchInput, 'Engineering');
      expect(screen.queryByText('Design Team')).not.toBeInTheDocument();

      await userEvent.clear(searchInput);
      expect(screen.getByText('Engineering Team')).toBeInTheDocument();
      expect(screen.getByText('Design Team')).toBeInTheDocument();
    });
  });

  describe('refresh functionality', () => {
    it('calls fetchEntities when refresh button is clicked', async () => {
      mockEntities = [
        { id: '1', name: 'Engineering Team', number_of_members: 5 },
      ];
      renderTeamPage();

      const refreshButton = screen.getByText('refresh').closest('button');
      expect(refreshButton).toBeInTheDocument();

      await userEvent.click(refreshButton!);

      expect(mockFetchEntities).toHaveBeenCalled();
    });
  });

  describe('navigation', () => {
    it('sets up navigation to create new team', () => {
      renderTeamPage();

      // Check that the primary action button is set up with onClick handler
      expect(mockSetPrimaryActionButton).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'New Team',
          onClick: expect.any(Function),
        })
      );
    });
  });

  describe('delete team flow', () => {
    it('refreshes the list after clicking a team, deleting it, and confirming', async () => {
      // Setup: Team exists in the list
      mockEntities = [
        { id: 'team-1', name: 'Team to Delete', number_of_members: 3, description: 'A team', members: [] },
      ];
      
      // Setup: When team details are fetched
      const teamData = { 
        id: 'team-1', 
        name: 'Team to Delete', 
        description: 'A team', 
        members: [] 
      };
      mockFetchEntity.mockResolvedValue(teamData);
      mockFetchedEntity = teamData;
      
      // Setup: Delete will succeed
      mockWriteEntity.mockResolvedValue(true);
      
      renderTeamPage();

      // Clear the initial fetch calls
      mockFetchEntities.mockClear();

      // Step 1: Click on the team row to navigate to details
      const teamRow = screen.getByText('Team to Delete').closest('tr');
      expect(teamRow).toBeInTheDocument();
      await userEvent.click(teamRow!);

      // Step 2: Wait for the details page to load and show the delete button
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete team/i })).toBeInTheDocument();
      });

      // Step 3: Click the delete button
      const deleteButton = screen.getByRole('button', { name: /Delete team/i });
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

