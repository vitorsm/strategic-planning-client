
export type User = {
    id: string;
    name: string;
    login: string;
  };

export const ACCESS_TOKEN_STORAGE_KEY = 'access_token';
export const CURRENT_USER_STORAGE_KEY = 'current_user';

export function getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  }
  
  export function setAccessToken(accessToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
  }
  
  export function setCurrentUser(user: User): void {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
  }
  
  export function getCurrentUser(): User | null {
    const stored = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  }
  
  export function clearAccessToken(): void {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  }
