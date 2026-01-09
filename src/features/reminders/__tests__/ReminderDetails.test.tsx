import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ReminderDetails } from '../ReminderDetails';
import { ReminderStatus } from '../../../shared/models/reminder';

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

// Mock useFetchEntities for teams
const mockFetchTeams = jest.fn();
jest.mock('../../../shared/hooks/generic-entities/useFetchEntities', () => ({
  useFetchEntities: () => ({
    fetchEntities: mockFetchTeams,
    entities: [],
    isLoading: false,
    error: null,
  }),
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

const renderReminderDetails = (route = '/reminders/new') => {
  const path = route.includes('/new') ? '/reminders/new' : '/reminders/:entity_id';
  
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={<ReminderDetails {...defaultProps} />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ReminderDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchedEntity = null;
    mockIsFetchingEntity = false;
    mockIsWriting = false;
    mockFetchEntity.mockResolvedValue(null);
    mockWriteEntity.mockResolvedValue({ id: 'new-reminder-id' });
    mockSearchUser.mockResolvedValue(null);
  });

  describe('rendering', () => {
    it('renders the reminder title input', () => {
      renderReminderDetails();
      expect(screen.getByLabelText('Reminder Title')).toBeInTheDocument();
    });

    it('renders the description input', () => {
      renderReminderDetails();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
    });

    it('renders the Reminder Details card', () => {
      renderReminderDetails();
      expect(screen.getByText('Reminder Details')).toBeInTheDocument();
    });

    it('renders the Recipient card', () => {
      renderReminderDetails();
      expect(screen.getByText('Recipient')).toBeInTheDocument();
    });

    it('renders the Related Context card', () => {
      renderReminderDetails();
      expect(screen.getByText('Related Context (Optional)')).toBeInTheDocument();
    });

    it('renders the Pro Tip info card', () => {
      renderReminderDetails();
      expect(screen.getByText('Pro Tip')).toBeInTheDocument();
    });

    it('sets the page title to "Reminder Details"', () => {
      renderReminderDetails();
      expect(mockSetPageTitle).toHaveBeenCalledWith('Reminder Details');
    });

    it('renders the placeholder for reminder title input', () => {
      renderReminderDetails();
      expect(screen.getByPlaceholderText('e.g. Review quarterly goals')).toBeInTheDocument();
    });

    it('renders the placeholder for description', () => {
      renderReminderDetails();
      expect(screen.getByPlaceholderText('Provide additional context or instructions for this reminder...')).toBeInTheDocument();
    });
  });

  describe('creating a new reminder', () => {
    it('displays "Create Reminder" button when in create mode', () => {
      renderReminderDetails('/reminders/new');
      expect(screen.getByRole('button', { name: /Create Reminder/i })).toBeInTheDocument();
    });

    it('displays "Cancel" button when in create mode', () => {
      renderReminderDetails('/reminders/new');
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('displays action card with "Ready to create?" title', () => {
      renderReminderDetails('/reminders/new');
      expect(screen.getByText('Ready to create?')).toBeInTheDocument();
    });

    it('allows typing in the reminder title input', async () => {
      renderReminderDetails('/reminders/new');

      const titleInput = screen.getByLabelText('Reminder Title');
      await userEvent.type(titleInput, 'My New Reminder');

      expect(titleInput).toHaveValue('My New Reminder');
    });

    it('allows typing in the description', async () => {
      renderReminderDetails('/reminders/new');

      const descriptionInput = screen.getByLabelText('Description');
      await userEvent.type(descriptionInput, 'This is a test reminder');

      expect(descriptionInput).toHaveValue('This is a test reminder');
    });

    it('disables submit button when reminder title is empty', () => {
      renderReminderDetails('/reminders/new');
      
      const createButton = screen.getByRole('button', { name: /Create Reminder/i });
      expect(createButton).toBeDisabled();
    });

    it('disables submit button when recipient is not set', async () => {
      renderReminderDetails('/reminders/new');

      const titleInput = screen.getByLabelText('Reminder Title');
      await userEvent.type(titleInput, 'Valid Title');

      const createButton = screen.getByRole('button', { name: /Create Reminder/i });
      expect(createButton).toBeDisabled();
    });

    it('enables submit button when reminder title and recipient are provided', async () => {
      mockSearchUser.mockResolvedValue({ id: 'user-1', name: 'John Doe', login: 'jdoe' });
      renderReminderDetails('/reminders/new');

      const titleInput = screen.getByLabelText('Reminder Title');
      await userEvent.type(titleInput, 'Valid Title');

      // Simulate selecting a user
      const searchInput = screen.getAllByPlaceholderText('Find users by name or email...')[0];
      await userEvent.type(searchInput, 'jdoe{enter}');

      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /Create Reminder/i });
        expect(createButton).not.toBeDisabled();
      });
    });

    it('calls writeEntity when create button is clicked with valid data', async () => {
      mockSearchUser.mockResolvedValue({ id: 'user-1', name: 'John Doe', login: 'jdoe' });
      renderReminderDetails('/reminders/new');

      const titleInput = screen.getByLabelText('Reminder Title');
      await userEvent.type(titleInput, 'New Reminder');

      const descriptionInput = screen.getByLabelText('Description');
      await userEvent.type(descriptionInput, 'Reminder description');

      // Simulate selecting a user
      const searchInput = screen.getAllByPlaceholderText('Find users by name or email...')[0];
      await userEvent.type(searchInput, 'jdoe{enter}');

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const createButton = screen.getByRole('button', { name: /Create Reminder/i });
      await userEvent.click(createButton);

      await waitFor(() => {
        expect(mockWriteEntity).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'New Reminder',
            description: 'Reminder description',
          })
        );
      });
    });
  });

  describe('editing an existing reminder', () => {
    beforeEach(() => {
      mockFetchedEntity = {
        id: 'reminder-123',
        name: 'Existing Reminder',
        status: ReminderStatus.PENDING,
        description: 'Existing description',
        to_user: { id: 'user-1', name: 'John Doe', login: 'jdoe' },
        related_user: null,
        related_team: null,
      };
      mockFetchEntity.mockResolvedValue(mockFetchedEntity);
    });

    it('fetches the reminder data when editing', async () => {
      renderReminderDetails('/reminders/reminder-123');

      await waitFor(() => {
        expect(mockFetchEntity).toHaveBeenCalledWith('reminder-123');
      });
    });

    it('displays "Update Reminder" button when in edit mode', async () => {
      renderReminderDetails('/reminders/reminder-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Update Reminder/i })).toBeInTheDocument();
      });
    });

    it('displays "Return" button when in edit mode', async () => {
      renderReminderDetails('/reminders/reminder-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Return' })).toBeInTheDocument();
      });
    });

    it('does not display "Ready to create?" card when in edit mode', async () => {
      renderReminderDetails('/reminders/reminder-123');

      await waitFor(() => {
        expect(screen.queryByText('Ready to create?')).not.toBeInTheDocument();
      });
    });

    it('populates form fields with existing reminder data', async () => {
      renderReminderDetails('/reminders/reminder-123');

      await waitFor(() => {
        expect(screen.getByDisplayValue('Existing Reminder')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Existing description')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });

    it('calls writeEntity with updated data when update button is clicked', async () => {
      renderReminderDetails('/reminders/reminder-123');

      await waitFor(() => {
        expect(screen.getByDisplayValue('Existing Reminder')).toBeInTheDocument();
      });

      const titleInput = screen.getByLabelText('Reminder Title');
      await userEvent.clear(titleInput);
      await userEvent.type(titleInput, 'Updated Reminder Title');

      const updateButton = screen.getByRole('button', { name: /Update Reminder/i });
      await userEvent.click(updateButton);

      await waitFor(() => {
        expect(mockWriteEntity).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'reminder-123',
            name: 'Updated Reminder Title',
          })
        );
      });
    });
  });

  describe('deleting a reminder', () => {
    beforeEach(() => {
      mockFetchedEntity = {
        id: 'reminder-123',
        name: 'Reminder to Delete',
        status: ReminderStatus.PENDING,
        description: 'Description',
        to_user: { id: 'user-1', name: 'John Doe', login: 'jdoe' },
        related_user: null,
        related_team: null,
      };
      mockFetchEntity.mockResolvedValue(mockFetchedEntity);
    });

    it('displays delete button when in edit mode', async () => {
      renderReminderDetails('/reminders/reminder-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete reminder/i })).toBeInTheDocument();
      });
    });

    it('does not show delete button when creating a new reminder', () => {
      renderReminderDetails('/reminders/new');
      
      expect(screen.queryByRole('button', { name: /Delete reminder/i })).not.toBeInTheDocument();
    });

    it('shows delete confirmation dialog when delete button is clicked', async () => {
      renderReminderDetails('/reminders/reminder-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete reminder/i })).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: /Delete reminder/i });
      await userEvent.click(deleteButton);

      expect(screen.getByText('Delete Reminder')).toBeInTheDocument();
      expect(screen.getByText(/Are you sure you want to delete this entity/i)).toBeInTheDocument();
    });

    it('shows cancel and confirm buttons in delete dialog', async () => {
      renderReminderDetails('/reminders/reminder-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete reminder/i })).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: /Delete reminder/i });
      await userEvent.click(deleteButton);

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('closes delete dialog when cancel is clicked', async () => {
      renderReminderDetails('/reminders/reminder-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete reminder/i })).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: /Delete reminder/i });
      await userEvent.click(deleteButton);

      expect(screen.getByText(/Are you sure you want to delete this entity/i)).toBeInTheDocument();

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      await userEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText(/Are you sure you want to delete this entity/i)).not.toBeInTheDocument();
      });
    });

    it('calls writeEntity for delete when confirmed', async () => {
      renderReminderDetails('/reminders/reminder-123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Delete reminder/i })).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: /Delete reminder/i });
      await userEvent.click(deleteButton);

      const confirmDeleteButton = screen.getByRole('button', { name: 'Delete' });
      await userEvent.click(confirmDeleteButton);

      await waitFor(() => {
        expect(mockWriteEntity).toHaveBeenCalled();
      });
    });
  });

  describe('form validation', () => {
    it('requires reminder title to be non-empty', async () => {
      renderReminderDetails('/reminders/new');

      const titleInput = screen.getByLabelText('Reminder Title');
      await userEvent.type(titleInput, '   ');

      const createButton = screen.getByRole('button', { name: /Create Reminder/i });
      expect(createButton).toBeDisabled();
    });

    it('requires recipient to be selected', async () => {
      renderReminderDetails('/reminders/new');

      const titleInput = screen.getByLabelText('Reminder Title');
      await userEvent.type(titleInput, 'Valid Title');

      const createButton = screen.getByRole('button', { name: /Create Reminder/i });
      expect(createButton).toBeDisabled();
    });
  });

  describe('navigation', () => {
    it('has a cancel/return button to go back', () => {
      renderReminderDetails('/reminders/new');
      
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });
  });

  describe('loading states', () => {
    it('shows loading state when submitting', async () => {
      mockIsWriting = true;
      mockSearchUser.mockResolvedValue({ id: 'user-1', name: 'John Doe', login: 'jdoe' });
      renderReminderDetails('/reminders/new');

      const titleInput = screen.getByLabelText('Reminder Title');
      await userEvent.type(titleInput, 'Test Reminder');

      // Simulate selecting a user
      const searchInput = screen.getAllByPlaceholderText('Find users by name or email...')[0];
      await userEvent.type(searchInput, 'jdoe{enter}');

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // The button should show loading state
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
});

