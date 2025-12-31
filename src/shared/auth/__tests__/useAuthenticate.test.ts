import { renderHook, act, waitFor } from '@testing-library/react';
import {
  useAuthenticate,
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  ACCESS_TOKEN_STORAGE_KEY,
} from '../useAuthenticate';
import { APIClientError } from '../../api';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock localStorage
const localStorageStore: Record<string, string> = {};

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

function setupLocalStorageMock() {
  mockLocalStorage.getItem.mockImplementation((key: string) => localStorageStore[key] ?? null);
  mockLocalStorage.setItem.mockImplementation((key: string, value: string) => {
    localStorageStore[key] = value;
  });
  mockLocalStorage.removeItem.mockImplementation((key: string) => {
    delete localStorageStore[key];
  });
  mockLocalStorage.clear.mockImplementation(() => {
    Object.keys(localStorageStore).forEach(key => delete localStorageStore[key]);
  });
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

beforeEach(() => {
  setupLocalStorageMock();
});

const createMockResponse = (
  body: unknown,
  status = 200,
  contentType = 'application/json'
): Response => {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: {
      get: (name: string) => (name === 'content-type' ? contentType : null),
    },
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(typeof body === 'string' ? body : JSON.stringify(body)),
  } as unknown as Response;
};

describe('ACCESS_TOKEN_STORAGE_KEY', () => {
  it('has the expected value', () => {
    expect(ACCESS_TOKEN_STORAGE_KEY).toBe('access_token');
  });
});

describe('getAccessToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(localStorageStore).forEach(key => delete localStorageStore[key]);
  });

  it('returns the access token from localStorage', () => {
    localStorageStore['access_token'] = 'my-token';

    const result = getAccessToken();

    expect(result).toBe('my-token');
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('access_token');
  });

  it('returns null when no token is stored', () => {
    const result = getAccessToken();

    expect(result).toBeNull();
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('access_token');
  });
});

describe('setAccessToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(localStorageStore).forEach(key => delete localStorageStore[key]);
  });

  it('stores the access token in localStorage', () => {
    setAccessToken('new-token');

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('access_token', 'new-token');
    expect(localStorageStore['access_token']).toBe('new-token');
  });

  it('overwrites existing token', () => {
    localStorageStore['access_token'] = 'old-token';

    setAccessToken('new-token');

    expect(localStorageStore['access_token']).toBe('new-token');
  });
});

describe('clearAccessToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(localStorageStore).forEach(key => delete localStorageStore[key]);
  });

  it('removes the access token from localStorage', () => {
    localStorageStore['access_token'] = 'my-token';

    clearAccessToken();

    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('access_token');
    expect(localStorageStore['access_token']).toBeUndefined();
  });

  it('does not throw when no token exists', () => {
    expect(() => clearAccessToken()).not.toThrow();
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('access_token');
  });
});

describe('useAuthenticate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(localStorageStore).forEach(key => delete localStorageStore[key]);
  });

  describe('initial state', () => {
    it('returns isLoading as false initially', () => {
      const { result } = renderHook(() => useAuthenticate());

      expect(result.current.isLoading).toBe(false);
    });

    it('returns error as null initially', () => {
      const { result } = renderHook(() => useAuthenticate());

      expect(result.current.error).toBeNull();
    });

    it('returns an authenticate function', () => {
      const { result } = renderHook(() => useAuthenticate());

      expect(typeof result.current.authenticate).toBe('function');
    });
  });

  describe('successful authentication', () => {
    it('makes a POST request to /api/authenticate', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ access_token: 'valid-token' })
      );
      const { result } = renderHook(() => useAuthenticate());

      await act(async () => {
        await result.current.authenticate({ username: 'user', password: 'pass' });
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/authenticate',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ username: 'user', password: 'pass' }),
        })
      );
    });

    it('stores the access token in localStorage on success', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ access_token: 'valid-token' })
      );
      const { result } = renderHook(() => useAuthenticate());

      await act(async () => {
        await result.current.authenticate({ username: 'user', password: 'pass' });
      });

      expect(localStorageStore['access_token']).toBe('valid-token');
    });

    it('returns the access token on success', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ access_token: 'valid-token' })
      );
      const { result } = renderHook(() => useAuthenticate());

      let returnedToken: string | undefined;
      await act(async () => {
        returnedToken = await result.current.authenticate({ username: 'user', password: 'pass' });
      });

      expect(returnedToken).toBe('valid-token');
    });

    it('sets isLoading to true during request', async () => {
      let resolvePromise: (value: Response) => void;
      const fetchPromise = new Promise<Response>((resolve) => {
        resolvePromise = resolve;
      });
      mockFetch.mockReturnValueOnce(fetchPromise);

      const { result } = renderHook(() => useAuthenticate());

      act(() => {
        result.current.authenticate({ username: 'user', password: 'pass' });
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolvePromise!(createMockResponse({ access_token: 'token' }));
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('clears previous error on new authentication attempt', async () => {
      // First, cause an error
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ error: 'Unauthorized' }, 401)
      );
      const { result } = renderHook(() => useAuthenticate());

      await act(async () => {
        try {
          await result.current.authenticate({ username: 'bad', password: 'bad' });
        } catch {
          // Expected
        }
      });

      expect(result.current.error).not.toBeNull();

      // Now try a successful authentication
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ access_token: 'valid-token' })
      );

      await act(async () => {
        await result.current.authenticate({ username: 'user', password: 'pass' });
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('error handling', () => {
    it('sets error message for 401 response', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ error: 'Unauthorized' }, 401)
      );
      const { result } = renderHook(() => useAuthenticate());

      await act(async () => {
        try {
          await result.current.authenticate({ username: 'user', password: 'wrong' });
        } catch {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Invalid username or password');
    });

    it('throws APIClientError for 401 response', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ error: 'Unauthorized' }, 401)
      );
      const { result } = renderHook(() => useAuthenticate());

      await act(async () => {
        await expect(
          result.current.authenticate({ username: 'user', password: 'wrong' })
        ).rejects.toThrow(APIClientError);
      });
    });

    it('sets error message when access_token is missing', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ some_other_field: 'value' })
      );
      const { result } = renderHook(() => useAuthenticate());

      await act(async () => {
        try {
          await result.current.authenticate({ username: 'user', password: 'pass' });
        } catch {
          // Expected
        }
      });

      expect(result.current.error).toBe('Authentication response missing access_token');
    });

    it('sets error message when access_token is empty string', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ access_token: '' })
      );
      const { result } = renderHook(() => useAuthenticate());

      await act(async () => {
        try {
          await result.current.authenticate({ username: 'user', password: 'pass' });
        } catch {
          // Expected
        }
      });

      expect(result.current.error).toBe('Authentication response missing access_token');
    });

    it('sets error message when access_token is whitespace only', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ access_token: '   ' })
      );
      const { result } = renderHook(() => useAuthenticate());

      await act(async () => {
        try {
          await result.current.authenticate({ username: 'user', password: 'pass' });
        } catch {
          // Expected
        }
      });

      expect(result.current.error).toBe('Authentication response missing access_token');
    });

    it('sets error message from Error instance', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      const { result } = renderHook(() => useAuthenticate());

      await act(async () => {
        try {
          await result.current.authenticate({ username: 'user', password: 'pass' });
        } catch {
          // Expected
        }
      });

      expect(result.current.error).toBe('Network error');
    });

    it('sets generic error message for non-Error exceptions', async () => {
      mockFetch.mockRejectedValueOnce('some string error');
      const { result } = renderHook(() => useAuthenticate());

      await act(async () => {
        try {
          await result.current.authenticate({ username: 'user', password: 'pass' });
        } catch {
          // Expected
        }
      });

      expect(result.current.error).toBe('Authentication failed');
    });

    it('sets isLoading to false after error', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ error: 'Unauthorized' }, 401)
      );
      const { result } = renderHook(() => useAuthenticate());

      await act(async () => {
        try {
          await result.current.authenticate({ username: 'user', password: 'pass' });
        } catch {
          // Expected
        }
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('does not store token when authentication fails', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ error: 'Unauthorized' }, 401)
      );
      const { result } = renderHook(() => useAuthenticate());

      await act(async () => {
        try {
          await result.current.authenticate({ username: 'user', password: 'pass' });
        } catch {
          // Expected
        }
      });

      expect(localStorageStore['access_token']).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('handles non-object response body', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse('string response', 200, 'text/plain')
      );
      const { result } = renderHook(() => useAuthenticate());

      await act(async () => {
        try {
          await result.current.authenticate({ username: 'user', password: 'pass' });
        } catch {
          // Expected - no access_token in string response
        }
      });

      expect(result.current.error).toBe('Authentication response missing access_token');
    });

    it('handles null response body', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null));
      const { result } = renderHook(() => useAuthenticate());

      await act(async () => {
        try {
          await result.current.authenticate({ username: 'user', password: 'pass' });
        } catch {
          // Expected - no access_token in null response
        }
      });

      expect(result.current.error).toBe('Authentication response missing access_token');
    });

    it('authenticate function is stable across renders', () => {
      const { result, rerender } = renderHook(() => useAuthenticate());
      const firstAuthenticate = result.current.authenticate;

      rerender();

      expect(result.current.authenticate).toBe(firstAuthenticate);
    });
  });
});

