import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Create a mock authenticate function that we can configure
const mockAuthenticate = jest.fn();

// Mock the useAuthenticate hook
jest.mock('./shared/auth/useAuthenticate', () => {
  const actual = jest.requireActual('./shared/auth/useAuthenticate');
  return {
    ...actual,
    useAuthenticate: () => ({
      authenticate: mockAuthenticate,
      isLoading: false,
      error: null,
    }),
  };
});

describe('App', () => {
  beforeEach(() => {
    // Clear any stored tokens before each test
    localStorage.removeItem('access_token');
    // Reset URL to login page
    window.history.pushState({}, '', '/login');
    // Configure the mock to set the access token when called
    mockAuthenticate.mockImplementation(async () => {
      localStorage.setItem('access_token', 'mock-token-123');
      return 'mock-token-123';
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
      expect(screen.getByText('dashbord')).toBeInTheDocument();
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
