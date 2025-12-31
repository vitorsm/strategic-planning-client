import React from 'react';
import { APIClient, APIClientError } from '../api/APIClient';

export const ACCESS_TOKEN_STORAGE_KEY = 'access_token';

export type AuthenticateParams = {
  username: string;
  password: string;
};

type AuthenticateResponse = {
  access_token?: unknown;
  error?: unknown;
  message?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function setAccessToken(accessToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
}

export function clearAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function useAuthenticate() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Keep base URL aligned with local dev backend by default.
  // Switch to '' to use same-origin proxying (e.g. CRA proxy) when needed.
  const client = React.useMemo(() => new APIClient({ baseUrl: 'http://localhost:5000' }), []);

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

      setAccessToken(accessToken);
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

  return { authenticate, isLoading, error };
}


