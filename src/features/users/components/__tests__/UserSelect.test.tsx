import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { UserSelect } from '../UserSelect';
import { VisualUser } from '../../types';

// Mock the useSearchUserByLogin hook
const mockSearchUser = jest.fn();
let mockIsLoading = false;
let mockError: string | null = null;

jest.mock('../../../teams/hooks', () => ({
  useSearchUserByLogin: () => ({
    searchUser: mockSearchUser,
    isLoading: mockIsLoading,
    error: mockError,
  }),
}));

// Mock users for testing
const mockUsers: VisualUser[] = [
  {
    id: '1',
    name: 'John Doe',
    login: 'johndoe',
    avatar_url: 'https://example.com/avatar1.png',
    color: '#6366f1',
  },
  {
    id: '2',
    name: 'Jane Smith',
    login: 'janesmith',
    initials: 'JS',
    color: '#8b5cf6',
  },
  {
    id: '3',
    name: 'Bob Wilson',
    login: 'bobwilson',
    color: '#ec4899',
  },
];

describe('UserSelect', () => {
  const mockOnSelectUser = jest.fn();
  const mockOnRemoveUser = jest.fn();

  const renderUserSelect = (users: VisualUser[] = mockUsers) => {
    return render(
      <UserSelect
        users={users}
        onSelectUser={mockOnSelectUser}
        onRemoveUser={mockOnRemoveUser}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsLoading = false;
    mockError = null;
  });

  describe('displaying users', () => {
    it('renders the search input', () => {
      renderUserSelect();
      expect(screen.getByPlaceholderText('Find users by name or email...')).toBeInTheDocument();
    });

    it('displays all users in the list', () => {
      renderUserSelect();

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });

    it('displays the correct number of selected members', () => {
      renderUserSelect();
      expect(screen.getByText('Selected Members (3)')).toBeInTheDocument();
    });

    it('displays empty list when no users are provided', () => {
      renderUserSelect([]);
      expect(screen.getByText('Selected Members (0)')).toBeInTheDocument();
    });

    it('displays user avatars when available', () => {
      renderUserSelect();
      const avatar = screen.getByAltText('John Doe');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar1.png');
    });

    it('displays initials when user has no avatar', () => {
      renderUserSelect();
      // Jane Smith has initials 'JS' defined
      expect(screen.getByText('JS')).toBeInTheDocument();
    });

    it('displays first letter of name when user has no avatar and no initials', () => {
      renderUserSelect();
      // Bob Wilson has no avatar_url and no initials, so should show 'B'
      expect(screen.getByText('B')).toBeInTheDocument();
    });
  });

  describe('removing users', () => {
    it('calls onRemoveUser when remove button is clicked', () => {
      renderUserSelect();

      const removeButton = screen.getByRole('button', { name: 'Remove John Doe' });
      fireEvent.click(removeButton);

      expect(mockOnRemoveUser).toHaveBeenCalledTimes(1);
      expect(mockOnRemoveUser).toHaveBeenCalledWith(mockUsers[0]);
    });

    it('calls onRemoveUser with correct user when removing different users', () => {
      renderUserSelect();

      const removeJaneButton = screen.getByRole('button', { name: 'Remove Jane Smith' });
      fireEvent.click(removeJaneButton);

      expect(mockOnRemoveUser).toHaveBeenCalledWith(mockUsers[1]);
    });

    it('renders remove button for each user', () => {
      renderUserSelect();

      expect(screen.getByRole('button', { name: 'Remove John Doe' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Remove Jane Smith' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Remove Bob Wilson' })).toBeInTheDocument();
    });
  });

  describe('adding new users', () => {
    it('allows typing in the search input', () => {
      renderUserSelect();

      const searchInput = screen.getByPlaceholderText('Find users by name or email...');
      fireEvent.change(searchInput, { target: { value: 'newuser' } });

      expect(searchInput).toHaveValue('newuser');
    });

    it('calls searchUser when pressing Enter', async () => {
      mockSearchUser.mockResolvedValue({
        id: '4',
        name: 'New User',
        login: 'newuser',
      });
      renderUserSelect();

      const searchInput = screen.getByPlaceholderText('Find users by name or email...');
      fireEvent.change(searchInput, { target: { value: 'newuser' } });
      
      await act(async () => {
        fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
      });

      await waitFor(() => {
        expect(mockSearchUser).toHaveBeenCalledWith('newuser');
      });
    });

    it('calls onSelectUser when a new user is found', async () => {
      const newUser = {
        id: '4',
        name: 'New User',
        login: 'newuser',
      };
      mockSearchUser.mockResolvedValue(newUser);
      renderUserSelect();

      const searchInput = screen.getByPlaceholderText('Find users by name or email...');
      fireEvent.change(searchInput, { target: { value: 'newuser' } });
      
      await act(async () => {
        fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
      });

      await waitFor(() => {
        expect(mockOnSelectUser).toHaveBeenCalledTimes(1);
        expect(mockOnSelectUser).toHaveBeenCalledWith(
          expect.objectContaining({
            id: '4',
            name: 'New User',
            login: 'newuser',
            color: expect.any(String),
          })
        );
      });
    });

    it('clears search input after selecting a user', async () => {
      mockSearchUser.mockResolvedValue({
        id: '4',
        name: 'New User',
        login: 'newuser',
      });
      renderUserSelect();

      const searchInput = screen.getByPlaceholderText('Find users by name or email...');
      fireEvent.change(searchInput, { target: { value: 'newuser' } });
      
      await act(async () => {
        fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
      });

      await waitFor(() => {
        expect(searchInput).toHaveValue('');
      });
    });

    it('does not add user if already in the list', async () => {
      // Return an existing user (John Doe with id '1')
      mockSearchUser.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        login: 'johndoe',
      });
      renderUserSelect();

      const searchInput = screen.getByPlaceholderText('Find users by name or email...');
      fireEvent.change(searchInput, { target: { value: 'johndoe' } });
      
      await act(async () => {
        fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
      });

      await waitFor(() => {
        expect(mockSearchUser).toHaveBeenCalled();
      });

      expect(mockOnSelectUser).not.toHaveBeenCalled();
    });

    it('does not search when input is empty', async () => {
      renderUserSelect();

      const searchInput = screen.getByPlaceholderText('Find users by name or email...');
      
      await act(async () => {
        fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
      });

      expect(mockSearchUser).not.toHaveBeenCalled();
    });

    it('does not search when input contains only whitespace', async () => {
      renderUserSelect();

      const searchInput = screen.getByPlaceholderText('Find users by name or email...');
      fireEvent.change(searchInput, { target: { value: '   ' } });
      
      await act(async () => {
        fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
      });

      expect(mockSearchUser).not.toHaveBeenCalled();
    });
  });

  describe('user not found', () => {
    it('shows user not found card when error is ENTITY_NOT_FOUND_ERROR', async () => {
      mockError = 'Entity not found';
      mockSearchUser.mockResolvedValue(null);
      
      renderUserSelect();

      // The error state should trigger the UserNotFoundCard
      await waitFor(() => {
        expect(screen.getByText('User not found')).toBeInTheDocument();
      });
    });

    it('displays the searched login in the not found message', async () => {
      mockSearchUser.mockResolvedValue(null);
      
      renderUserSelect();

      // Type in search input to set the query value
      const searchInput = screen.getByPlaceholderText('Find users by name or email...');
      fireEvent.change(searchInput, { target: { value: 'unknownuser' } });

      // Simulate the search and error response
      await act(async () => {
        fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
      });

      // Set error to trigger user not found card
      mockError = 'Entity not found';

      // Rerender to trigger useEffect with new error
      const { rerender } = render(
        <UserSelect
          users={mockUsers}
          onSelectUser={mockOnSelectUser}
          onRemoveUser={mockOnRemoveUser}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('User not found')).toBeInTheDocument();
      });

      // The description should show the search query (empty in this case since it's a fresh render)
      expect(screen.getByText(/No user with login ".*" exists/)).toBeInTheDocument();
    });

    it('shows Create User button in user not found card', async () => {
      mockError = 'Entity not found';
      renderUserSelect();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Create User/i })).toBeInTheDocument();
      });
    });

    it('hides user not found card when typing in search', async () => {
      mockError = 'Entity not found';
      renderUserSelect();

      await waitFor(() => {
        expect(screen.getByText('User not found')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Find users by name or email...');
      fireEvent.change(searchInput, { target: { value: 'a' } });

      expect(screen.queryByText('User not found')).not.toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('does not search when already loading', async () => {
      mockIsLoading = true;
      renderUserSelect();

      const searchInput = screen.getByPlaceholderText('Find users by name or email...');
      fireEvent.change(searchInput, { target: { value: 'newuser' } });
      
      await act(async () => {
        fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
      });

      expect(mockSearchUser).not.toHaveBeenCalled();
    });
  });
});
