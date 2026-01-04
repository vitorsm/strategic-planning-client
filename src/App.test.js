import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Create mock functions that we can configure
const mockAuthenticate = jest.fn();
const mockGetCurrentUser = jest.fn();
const mockLogout = jest.fn();
const mockIsAuthenticated = jest.fn();

// Track mock state in an object so we can access current values dynamically
const mockState = {
  currentUser: null,
};

// Mock the useAuthenticate hook
jest.mock('./shared/auth/useAuthenticate', () => {
  const actual = jest.requireActual('./shared/auth/useAuthenticate');
  return {
    ...actual,
    useAuthenticate: () => ({
      authenticate: mockAuthenticate,
      isLoading: false,
      error: null,
      isAuthenticated: mockIsAuthenticated,
      getCurrentUser: mockGetCurrentUser,
      logout: mockLogout,
      get currentUser() {
        return mockState.currentUser;
      },
    }),
  };
});

describe('App', () => {
  beforeEach(() => {
    // Clear any stored tokens before each test
    localStorage.removeItem('access_token');
    // Reset URL to login page
    window.history.pushState({}, '', '/login');
    // Reset mocks
    jest.clearAllMocks();
    // By default, user is not authenticated and no current user
    mockIsAuthenticated.mockReturnValue(false);
    mockState.currentUser = null;
    // Configure getCurrentUser to set the mock user
    mockGetCurrentUser.mockImplementation(async () => {
      mockState.currentUser = { id: 1, name: 'John Doe', login: 'Admin' };
      return mockState.currentUser;
    });
    // Configure the mock to set the access token when called
    mockAuthenticate.mockImplementation(async () => {
      localStorage.setItem('access_token', 'mock-token-123');
      mockIsAuthenticated.mockReturnValue(true);
      mockState.currentUser = { id: 1, name: 'John Doe', login: 'Admin' };
      return 'mock-token-123';
    });
    // Configure logout to clear the token
    mockLogout.mockImplementation(async () => {
      localStorage.removeItem('access_token');
      mockIsAuthenticated.mockReturnValue(false);
      mockState.currentUser = null;
    });
  });

  test('renders login heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
  });

  test('login, open dashboard, logout and go to login page again', async () => {
    render(<App />);

    // Step 1: Verify we're on the login page
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();

    // Step 2: Fill in the login form
    const emailInput = screen.getByLabelText('Work Email');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: /log in/i });

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(loginButton);

    // Step 3: Wait for redirect to dashboard
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    // Verify we see the authenticated page elements (sidebar with user info)
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();

    // Step 4: Click the Sign Out button
    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    await userEvent.click(signOutButton);

    // Step 5: Verify we're redirected back to the login page
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    });

    // Verify login form is visible again
    expect(screen.getByLabelText('Work Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });
});
