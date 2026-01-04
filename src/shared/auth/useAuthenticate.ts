import React from 'react';
import { APIClient, APIClientError } from '../api';
import { User } from './authStorage';
import * as authStorage from './authStorage';

export type AuthenticateParams = {
  username: string;
  password: string;
};

export type AuthenticateResponse = {
  access_token?: string;
  code?: string;
  title?: string | null;
  details?: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function useAuthenticate() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);

  // Keep base URL aligned with local dev backend by default.
  // Switch to '' to use same-origin proxying (e.g. CRA proxy) when needed.
  const client = React.useMemo(() => new APIClient({ baseUrl: 'http://192.168.0.8:5000' }), []);

  const authenticate = React.useCallback(async ({ username, password }: AuthenticateParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const responseBody = await client.post<AuthenticateResponse>('/api/authenticate', { username, password });
      const body = (isRecord(responseBody) ? responseBody : {}) as AuthenticateResponse;
      const accessToken = body.access_token;

      if (typeof accessToken !== 'string' || accessToken.trim().length === 0) {
        throw new Error('Authentication response missing access_token');
      }

      authStorage.setAccessToken(accessToken);
      getCurrentUser();
      return accessToken;
    } catch (e) {
      const message =
        e instanceof APIClientError && e.status === 401
          ? 'Invalid username or password'
          : e instanceof Error
            ? e.message
            : 'Authentication failed';
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  const logout = React.useCallback(async () => {
    authStorage.clearAccessToken();
  }, []);

  const getCurrentUser = React.useCallback(async () => {
    const fromStorage = authStorage.getCurrentUser();
    if (fromStorage) {
      setCurrentUser(fromStorage);
      return fromStorage;
    }
    return fetchCurrentUser();
  }, []);

  const fetchCurrentUser = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const responseBody = await client.get<User>('/api/users/me');

      if (!responseBody || typeof responseBody !== 'object') {
        throw new Error('Invalid user response');
      }

      authStorage.setCurrentUser(responseBody);
      setCurrentUser(responseBody);
      return responseBody;
    } catch (e) {
      const message =
        e instanceof APIClientError && e.status === 401
          ? 'Unauthorized'
          : e instanceof Error
            ? e.message
            : 'Failed to fetch user';
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  const isAuthenticated = (): boolean => {
    const accessToken = authStorage.getAccessToken();
    return accessToken !== null && accessToken.trim().length > 0;
  }

  return { authenticate, isAuthenticated, currentUser, getCurrentUser, logout, isLoading, error };
}

