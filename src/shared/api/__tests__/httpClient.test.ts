import { APIClient, APIClientError, APIClientConfig } from '../httpClient';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

const DEFAULT_ACCESS_TOKEN = 'test-token';

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
    localStorageStore['access_token'] = DEFAULT_ACCESS_TOKEN;
});

describe('APIClientError', () => {
  it('creates an error with the correct properties', () => {
    const error = new APIClientError('Test error', 404, { detail: 'Not found' });

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('APIClientError');
    expect(error.message).toBe('Test error');
    expect(error.status).toBe(404);
    expect(error.body).toEqual({ detail: 'Not found' });
  });

  it('inherits from Error', () => {
    const error = new APIClientError('Test', 500, null);
    expect(error instanceof Error).toBe(true);
  });
});

describe('APIClient', () => {
  let client: APIClient;

  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(localStorageStore).forEach(key => delete localStorageStore[key]);
    localStorageStore['access_token'] = 'test-token';
    client = new APIClient({ baseUrl: 'https://api.example.com' });
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

  describe('constructor', () => {
    it('uses default config when none provided', () => {
      const defaultClient = new APIClient();
      expect(defaultClient).toBeDefined();
    });

    it('uses custom baseUrl from config', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ data: 'test' }));

      await client.get('/users');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.any(Object)
      );
    });
  });

  describe('get', () => {
    it('makes a GET request with correct URL and headers', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ id: 1, name: 'Test' }));

      const result = await client.get('/users/1');

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users/1', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${DEFAULT_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        signal: undefined,
        body: undefined,
      });
      expect(result).toEqual({ id: 1, name: 'Test' });
    });

    it('includes custom headers', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ data: 'test' }));

      await client.get('/users', { headers: { 'X-Custom': 'value' } });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom': 'value',
          }),
        })
      );
    });

    it('passes signal for request cancellation', async () => {
      const controller = new AbortController();
      mockFetch.mockResolvedValueOnce(createMockResponse({ data: 'test' }));

      await client.get('/users', { signal: controller.signal });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          signal: controller.signal,
        })
      );
    });
  });

  describe('post', () => {
    it('makes a POST request with body', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ id: 1 }, 201));

      const result = await client.post('/users', { name: 'New User' });

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        signal: undefined,
        body: JSON.stringify({ name: 'New User' }),
      });
      expect(result).toEqual({ id: 1 });
    });

    it('makes a POST request without body', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ success: true }));

      await client.post('/action');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/action',
        expect.objectContaining({
          method: 'POST',
          body: undefined,
        })
      );
    });
  });

  describe('put', () => {
    it('makes a PUT request with body', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ id: 1, name: 'Updated' }));

      const result = await client.put('/users/1', { name: 'Updated' });

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users/1', {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        signal: undefined,
        body: JSON.stringify({ name: 'Updated' }),
      });
      expect(result).toEqual({ id: 1, name: 'Updated' });
    });
  });

  describe('delete', () => {
    it('makes a DELETE request', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, 204));

      await client.delete('/users/1');

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users/1', {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        signal: undefined,
        body: undefined,
      });
    });

    it('makes a DELETE request with body', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, 204));

      await client.delete('/items', { body: { ids: [1, 2, 3] } });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/items',
        expect.objectContaining({
          method: 'DELETE',
          body: JSON.stringify({ ids: [1, 2, 3] }),
        })
      );
    });
  });

  describe('URL joining', () => {
    it('handles baseUrl with trailing slash', async () => {
      const clientWithSlash = new APIClient({ baseUrl: 'https://api.example.com/' });
      mockFetch.mockResolvedValueOnce(createMockResponse({}));

      await clientWithSlash.get('/users');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.any(Object)
      );
    });

    it('handles path without leading slash', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({}));

      await client.get('users');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.any(Object)
      );
    });

    it('handles empty baseUrl', async () => {
      const clientNoBase = new APIClient();
      mockFetch.mockResolvedValueOnce(createMockResponse({}));

      await clientNoBase.get('/api/users');

      expect(mockFetch).toHaveBeenCalledWith('/api/users', expect.any(Object));
    });

    it('handles empty path', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({}));

      await client.get('');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com',
        expect.any(Object)
      );
    });
  });

  describe('error handling', () => {
    it('throws APIClientError for non-ok responses', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ detail: 'Not found' }, 404)
      );

      await expect(client.get('/users/999')).rejects.toThrow(APIClientError);
    });

    it('includes status code in error', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ detail: 'Not found' }, 404)
      );

      try {
        await client.get('/users/999');
      } catch (error) {
        expect((error as APIClientError).status).toBe(404);
      }
    });

    it('includes response body in error', async () => {
      const errorBody = { detail: 'Validation failed' };
      mockFetch.mockResolvedValueOnce(createMockResponse(errorBody, 400));

      try {
        await client.get('/users');
      } catch (error) {
        expect((error as APIClientError).body).toEqual(errorBody);
      }
    });

    it('extracts error message from body with code, title, and details', async () => {
      const errorBody = { code: 'ERR001', title: 'Error', details: 'Something went wrong' };
      mockFetch.mockResolvedValueOnce(createMockResponse(errorBody, 500));

      try {
        await client.get('/users');
      } catch (error) {
        expect((error as APIClientError).message).toBe('[ERR001] Error - Something went wrong');
      }
    });

    it('extracts error message from body with only code', async () => {
      const errorBody = { code: 'ERR002' };
      mockFetch.mockResolvedValueOnce(createMockResponse(errorBody, 500));

      try {
        await client.get('/users');
      } catch (error) {
        expect((error as APIClientError).message).toBe('[ERR002] ');
      }
    });

    it('extracts error message from body with only title', async () => {
      const errorBody = { title: 'Bad Request' };
      mockFetch.mockResolvedValueOnce(createMockResponse(errorBody, 400));

      try {
        await client.get('/users');
      } catch (error) {
        expect((error as APIClientError).message).toBe('Bad Request - ');
      }
    });

    it('uses default message when body has no recognizable format', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse('Internal Server Error', 500, 'text/plain')
      );

      try {
        await client.get('/users');
      } catch (error) {
        expect((error as APIClientError).message).toBe('Request failed (HTTP 500)');
      }
    });

    it('uses default message when body is null', async () => {
      const response = {
        ok: false,
        status: 500,
        headers: {
          get: () => 'application/json',
        },
        json: () => Promise.reject(new Error('Invalid JSON')),
        text: () => Promise.resolve(''),
      } as unknown as Response;
      mockFetch.mockResolvedValueOnce(response);

      try {
        await client.get('/users');
      } catch (error) {
        expect((error as APIClientError).message).toBe('Request failed (HTTP 500)');
      }
    });
  });

  describe('authentication', () => {
    it('includes Bearer token from localStorage', async () => {
      localStorageStore['access_token'] = 'my-auth-token';
      const freshClient = new APIClient({ baseUrl: 'https://api.example.com' });
      mockFetch.mockResolvedValueOnce(createMockResponse({}));

      await freshClient.get('/protected');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer my-auth-token',
          }),
        })
      );
    });

    it('handles null token', async () => {
      Object.keys(localStorageStore).forEach(key => delete localStorageStore[key]);
      const freshClient = new APIClient({ baseUrl: 'https://api.example.com' });
      mockFetch.mockResolvedValueOnce(createMockResponse({}));

      await freshClient.get('/protected');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer null',
          }),
        })
      );
    });
  });

  describe('401 Unauthorized handling', () => {
    it('calls onUnauthorized callback on 401 response', async () => {
      const onUnauthorized = jest.fn();
      const clientWithCallback = new APIClient({
        baseUrl: 'https://api.example.com',
        onUnauthorized,
      });
      mockFetch.mockResolvedValueOnce(createMockResponse({ error: 'Unauthorized' }, 401));

      try {
        await clientWithCallback.get('/protected');
      } catch {
        // Expected to throw
      }

      expect(onUnauthorized).toHaveBeenCalled();
    });

    it('clears access token by default on 401', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ error: 'Unauthorized' }, 401));

      try {
        await client.get('/protected');
      } catch {
        // Expected to throw
      }

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('access_token');
    });

    it('still throws APIClientError after onUnauthorized', async () => {
      const onUnauthorized = jest.fn();
      const clientWithCallback = new APIClient({
        baseUrl: 'https://api.example.com',
        onUnauthorized,
      });
      mockFetch.mockResolvedValueOnce(createMockResponse({ error: 'Unauthorized' }, 401));

      await expect(clientWithCallback.get('/protected')).rejects.toThrow(APIClientError);
    });
  });

  describe('response parsing', () => {
    it('parses JSON response', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ users: [{ id: 1 }] }, 200, 'application/json')
      );

      const result = await client.get('/users');

      expect(result).toEqual({ users: [{ id: 1 }] });
    });

    it('parses JSON response with charset', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ data: 'test' }, 200, 'application/json; charset=utf-8')
      );

      const result = await client.get('/data');

      expect(result).toEqual({ data: 'test' });
    });

    it('returns text for non-JSON response', async () => {
      const response = {
        ok: true,
        status: 200,
        headers: {
          get: () => 'text/plain',
        },
        json: () => Promise.reject(new Error('Not JSON')),
        text: () => Promise.resolve('Plain text response'),
      } as unknown as Response;
      mockFetch.mockResolvedValueOnce(response);

      const result = await client.get('/text');

      expect(result).toBe('Plain text response');
    });

    it('handles missing content-type header', async () => {
      const response = {
        ok: true,
        status: 200,
        headers: {
          get: () => null,
        },
        json: () => Promise.reject(new Error('Not JSON')),
        text: () => Promise.resolve('Some text'),
      } as unknown as Response;
      mockFetch.mockResolvedValueOnce(response);

      const result = await client.get('/unknown');

      expect(result).toBe('Some text');
    });
  });
});

