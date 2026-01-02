import { getAccessToken } from './useAuthenticate';

/**
 * Hook to check if the current user is authenticated.
 * Returns true if an access token exists in localStorage.
 */
export function useIsAuthenticated(): boolean {
  const accessToken = getAccessToken();
  return accessToken !== null && accessToken.trim().length > 0;
}

