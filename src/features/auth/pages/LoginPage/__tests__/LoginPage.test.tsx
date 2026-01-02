import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import { LoginPage } from '../LoginPage';

// Mock the useAuthenticate hook
const mockAuthenticate = jest.fn();
const mockIsAuthenticated = jest.fn(() => false);
jest.mock('../../../../../shared/auth/useAuthenticate', () => {
  const actual = jest.requireActual('../../../../../shared/auth/useAuthenticate');
  return {
    ...actual,
    useAuthenticate: () => ({
      authenticate: mockAuthenticate,
      isAuthenticated: mockIsAuthenticated,
      isLoading: mockIsLoading,
      error: mockError,
    }),
  };
});

let mockIsLoading = false;
let mockError: string | null = null;

const renderLoginPage = () => {
  return render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsLoading = false;
    mockError = null;
  });

  describe('rendering', () => {
    it('renders the welcome title', () => {
      renderLoginPage();
      expect(screen.getByText('Welcome back')).toBeInTheDocument();
    });

    it('renders the welcome subtitle', () => {
      renderLoginPage();
      expect(screen.getByText('Please enter your details to sign in.')).toBeInTheDocument();
    });

    it('renders the email input', () => {
      renderLoginPage();
      expect(screen.getByLabelText('Work Email')).toBeInTheDocument();
    });

    it('renders the password input', () => {
      renderLoginPage();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('renders the remember me checkbox', () => {
      renderLoginPage();
      expect(screen.getByLabelText('Remember me')).toBeInTheDocument();
    });

    it('renders the login button', () => {
      renderLoginPage();
      expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
    });

    it('renders the forgot password link', () => {
      renderLoginPage();
      expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    });

    it('renders SSO buttons', () => {
      renderLoginPage();
      expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /github/i })).toBeInTheDocument();
    });

    it('renders the sign up link', () => {
      renderLoginPage();
      expect(screen.getByText('Sign up')).toBeInTheDocument();
    });
  });

  describe('form interactions', () => {
    it('allows typing in the email input', async () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText('Work Email');
      await userEvent.type(emailInput, 'user@example.com');

      expect(emailInput).toHaveValue('user@example.com');
    });

    it('allows typing in the password input', async () => {
      renderLoginPage();

      const passwordInput = screen.getByLabelText('Password');
      await userEvent.type(passwordInput, 'secretpassword');

      expect(passwordInput).toHaveValue('secretpassword');
    });

    it('allows toggling the remember me checkbox', async () => {
      renderLoginPage();

      const checkbox = screen.getByLabelText('Remember me');
      expect(checkbox).not.toBeChecked();

      await userEvent.click(checkbox);
      expect(checkbox).toBeChecked();

      await userEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('form submission', () => {
    it('calls authenticate with username and password on submit', async () => {
      mockAuthenticate.mockResolvedValue('token');
      renderLoginPage();

      await userEvent.type(screen.getByLabelText('Work Email'), 'user@example.com');
      await userEvent.type(screen.getByLabelText('Password'), 'mypassword');
      await act(async () => {
        await userEvent.click(screen.getByRole('button', { name: 'Log In' }));
      });

      expect(mockAuthenticate).toHaveBeenCalledWith({
        username: 'user@example.com',
        password: 'mypassword',
      });
    });

    it('does not display success message when authentication fails', async () => {
      mockAuthenticate.mockRejectedValue(new Error('Auth failed'));
      renderLoginPage();

      await userEvent.type(screen.getByLabelText('Work Email'), 'user@example.com');
      await userEvent.type(screen.getByLabelText('Password'), 'wrongpassword');
      await act(async () => { 
        await userEvent.click(screen.getByRole('button', { name: 'Log In' }));
      });

      await waitFor(() => {
        expect(mockAuthenticate).toHaveBeenCalled();
      });

      expect(screen.queryByText('Logged in.')).not.toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('disables the login button while loading', () => {
      mockIsLoading = true;
      renderLoginPage();

      const button = screen.getByRole('button', { name: 'Logging in…' });
      expect(button).toBeDisabled();
    });

    it('shows loading text on the button while loading', () => {
      mockIsLoading = true;
      renderLoginPage();

      expect(screen.getByRole('button', { name: 'Logging in…' })).toBeInTheDocument();
    });

    it('sets aria-busy on the button while loading', () => {
      mockIsLoading = true;
      renderLoginPage();

      const button = screen.getByRole('button', { name: 'Logging in…' });
      expect(button).toHaveAttribute('aria-busy', 'true');
    });
  });

  describe('error handling', () => {
    it('displays error message when authentication fails', () => {
      mockError = 'Invalid username or password';
      renderLoginPage();

      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });

    it('does not display success message when there is an error', () => {
      mockError = 'Invalid username or password';
      renderLoginPage();

      expect(screen.queryByText('Logged in.')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has required attributes on email input', () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText('Work Email');
      expect(emailInput).toHaveAttribute('type', 'text');
      expect(emailInput).toHaveAttribute('autocomplete', 'username');
      expect(emailInput).toBeRequired();
    });

    it('has required attributes on password input', () => {
      renderLoginPage();

      const passwordInput = screen.getByLabelText('Password');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
      expect(passwordInput).toBeRequired();
    });

    it('has proper placeholder text on inputs', () => {
      renderLoginPage();

      expect(screen.getByPlaceholderText('name@company.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });
  });
});

