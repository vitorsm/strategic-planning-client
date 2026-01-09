import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ReminderPage } from '../ReminderPage';
import { ReminderStatus } from '../../../shared/models/reminder';

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

const renderReminderPage = (initialRoute = '/reminders') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/reminders/*" element={<ReminderPage {...defaultProps} />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ReminderPage', () => {
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
      renderReminderPage();
      expect(screen.getByPlaceholderText('Search reminders...')).toBeInTheDocument();
    });

    it('renders the refresh button', () => {
      renderReminderPage();
      expect(screen.getByText('refresh')).toBeInTheDocument();
    });

    it('displays empty state when no reminders exist', () => {
      mockEntities = [];
      renderReminderPage();
      expect(screen.getByText('No items found')).toBeInTheDocument();
      expect(screen.getByText('Create your first item to get started')).toBeInTheDocument();
    });

    it('sets the page title to "Reminders Management"', () => {
      renderReminderPage();
      expect(mockSetPageTitle).toHaveBeenCalledWith('Reminders Management');
    });

    it('sets the page subtitle', () => {
      renderReminderPage();
      expect(mockSetPageSubtitle).toHaveBeenCalledWith('Manage your reminders');
    });

    it('sets up the primary action button with "New Reminder" label', () => {
      renderReminderPage();
      expect(mockSetPrimaryActionButton).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'New Reminder',
          icon: 'add',
        })
      );
    });
  });

  describe('displaying reminders in table', () => {
    it('displays reminders in the table', () => {
      mockEntities = [
        { id: '1', name: 'Review Code', status: ReminderStatus.PENDING, to_user: { name: 'John Doe' } },
        { id: '2', name: 'Submit Report', status: ReminderStatus.DONE, to_user: { name: 'Jane Smith' } },
      ];
      renderReminderPage();

      expect(screen.getByText('Review Code')).toBeInTheDocument();
      expect(screen.getByText('Submit Report')).toBeInTheDocument();
    });

    it('displays the correct recipient for each reminder', () => {
      mockEntities = [
        { id: '1', name: 'Review Code', status: ReminderStatus.PENDING, to_user: { name: 'John Doe' } },
        { id: '2', name: 'Submit Report', status: ReminderStatus.DONE, to_user: { name: 'Jane Smith' } },
      ];
      renderReminderPage();

      expect(screen.getByText('To: John Doe')).toBeInTheDocument();
      expect(screen.getByText('To: Jane Smith')).toBeInTheDocument();
    });

    it('displays status badges for reminders', () => {
      mockEntities = [
        { id: '1', name: 'Review Code', status: ReminderStatus.PENDING, to_user: { name: 'John Doe' } },
        { id: '2', name: 'Submit Report', status: ReminderStatus.DONE, to_user: { name: 'Jane Smith' } },
      ];
      renderReminderPage();

      expect(screen.getByText('PENDING')).toBeInTheDocument();
      expect(screen.getByText('DONE')).toBeInTheDocument();
    });

    it('displays loading state when fetching reminders', () => {
      mockIsLoading = true;
      renderReminderPage();
      
      // Table should show loading indicator
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('search functionality', () => {
    it('filters reminders based on search query', async () => {
      mockEntities = [
        { id: '1', name: 'Review Code', status: ReminderStatus.PENDING, to_user: { name: 'John Doe' } },
        { id: '2', name: 'Submit Report', status: ReminderStatus.DONE, to_user: { name: 'Jane Smith' } },
        { id: '3', name: 'Meeting Notes', status: ReminderStatus.PENDING, to_user: { name: 'Bob Johnson' } },
      ];
      renderReminderPage();

      const searchInput = screen.getByPlaceholderText('Search reminders...');
      await userEvent.type(searchInput, 'Review');

      expect(screen.getByText('Review Code')).toBeInTheDocument();
      expect(screen.queryByText('Submit Report')).not.toBeInTheDocument();
      expect(screen.queryByText('Meeting Notes')).not.toBeInTheDocument();
    });

    it('shows empty state when search has no results', async () => {
      mockEntities = [
        { id: '1', name: 'Review Code', status: ReminderStatus.PENDING, to_user: { name: 'John Doe' } },
      ];
      renderReminderPage();

      const searchInput = screen.getByPlaceholderText('Search reminders...');
      await userEvent.type(searchInput, 'Nonexistent');

      expect(screen.getByText('No items found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search query')).toBeInTheDocument();
    });

    it('clears search and shows all reminders', async () => {
      mockEntities = [
        { id: '1', name: 'Review Code', status: ReminderStatus.PENDING, to_user: { name: 'John Doe' } },
        { id: '2', name: 'Submit Report', status: ReminderStatus.DONE, to_user: { name: 'Jane Smith' } },
      ];
      renderReminderPage();

      const searchInput = screen.getByPlaceholderText('Search reminders...');
      await userEvent.type(searchInput, 'Review');
      expect(screen.queryByText('Submit Report')).not.toBeInTheDocument();

      await userEvent.clear(searchInput);
      expect(screen.getByText('Review Code')).toBeInTheDocument();
      expect(screen.getByText('Submit Report')).toBeInTheDocument();
    });
  });

  describe('refresh functionality', () => {
    it('calls fetchEntities when refresh button is clicked', async () => {
      mockEntities = [
        { id: '1', name: 'Review Code', status: ReminderStatus.PENDING, to_user: { name: 'John Doe' } },
      ];
      renderReminderPage();

      const refreshButton = screen.getByText('refresh').closest('button');
      expect(refreshButton).toBeInTheDocument();

      await userEvent.click(refreshButton!);

      expect(mockFetchEntities).toHaveBeenCalled();
    });
  });

  describe('navigation', () => {
    it('sets up navigation to create new reminder', () => {
      renderReminderPage();

      // Check that the primary action button is set up with onClick handler
      expect(mockSetPrimaryActionButton).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'New Reminder',
          onClick: expect.any(Function),
        })
      );
    });
  });

  describe('delete reminder flow', () => {
    it('refreshes the list after clicking a reminder, deleting it, and confirming', async () => {
      // Setup: Reminder exists in the list
      mockEntities = [
        { id: 'reminder-1', name: 'Reminder to Delete', status: ReminderStatus.PENDING, to_user: { id: 'user-1', name: 'John Doe', login: 'jdoe' }, description: 'Test reminder', related_user: null, related_team: null },
      ];
      
      // Setup: When reminder details are fetched
      const reminderData = { 
        id: 'reminder-1', 
        name: 'Reminder to Delete', 
        status: ReminderStatus.PENDING,
        description: 'Test reminder',
        to_user: { id: 'user-1', name: 'John Doe', login: 'jdoe' },
        related_user: null,
        related_team: null
      };
      mockFetchEntity.mockResolvedValue(reminderData);
      mockFetchedEntity = reminderData;
      
      // Setup: Delete will succeed
      mockWriteEntity.mockResolvedValue(true);
      
      renderReminderPage();

      // Clear the initial fetch calls
      mockFetchEntities.mockClear();

      // Step 1: Click on the reminder row to navigate to details
      const reminderRow = screen.getByText('Reminder to Delete').closest('tr');
      expect(reminderRow).toBeInTheDocument();
      await userEvent.click(reminderRow!);

      // Step 2: Wait for the details page to load and show the delete button
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete reminder/i })).toBeInTheDocument();
      });

      // Step 3: Click the delete button
      const deleteButton = screen.getByRole('button', { name: /Delete reminder/i });
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

