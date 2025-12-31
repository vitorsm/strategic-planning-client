import { clearAccessToken, getAccessToken } from '../hooks/useAuthenticate';

export class APIClientError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'APIClientError';
    this.status = status;
    this.body = body;
  }
}

type RequestOptions = {
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

type RequestOptionsWithBody = RequestOptions & {
  body?: unknown;
};

function joinUrl(baseUrl: string, path: string): string {
  if (!baseUrl) return path;
  if (!path) return baseUrl;
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getErrorMessageFromBody(body: unknown): string | null {
  if (!isRecord(body)) return null;
  const maybeMessage = body.message ?? body.error;
  return typeof maybeMessage === 'string' && maybeMessage.trim().length > 0 ? maybeMessage : null;
}

export type APIClientConfig = {
  /**
   * Base URL prefix used for all requests.
   * - Use '' to hit same-origin (e.g. '/api/...').
   * - Use 'http://localhost:5000' for local dev against a separate backend.
   */
  baseUrl?: string;

  /**
   * Override how we load the auth token (defaults to localStorage access_token).
   */
  getAccessToken?: () => string | null;

  /**
   * Called when any request receives a 401.
   * Defaults to clearing localStorage access_token.
   */
  onUnauthorized?: () => void;
};

export class APIClient {
  private baseUrl: string;
  private getToken: () => string | null;
  private onUnauthorized: () => void;

  constructor(config: APIClientConfig = {}) {
    this.baseUrl = config.baseUrl ?? '';
    this.getToken = config.getAccessToken ?? getAccessToken;
    this.onUnauthorized = config.onUnauthorized ?? clearAccessToken;
  }

  async get<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('GET', path, options);
  }

  async post<T = unknown>(path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('POST', path, { ...options, body });
  }

  async put<T = unknown>(path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('PUT', path, { ...options, body });
  }

  async delete<T = unknown>(path: string, options: RequestOptionsWithBody = {}): Promise<T> {
    return this.request<T>('DELETE', path, options);
  }

  private async request<T>(method: string, path: string, options: RequestOptionsWithBody): Promise<T> {
    const url = joinUrl(this.baseUrl, path);

    const token = this.getToken();
    const headers: Record<string, string> = {
      ...(options.headers ?? {}),
    };

    // Only set Authorization if caller didn't override it.
    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Only set content-type when we actually have a body (and caller didn't override).
    const hasBody = options.body !== undefined && method !== 'GET';
    if (hasBody && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      method,
      headers,
      signal: options.signal,
      body: hasBody ? JSON.stringify(options.body) : undefined,
    });

    const contentType = response.headers.get('content-type') ?? '';
    const parsedBody: unknown = contentType.includes('application/json')
      ? await response.json().catch(() => null)
      : await response.text().catch(() => null);

    if (response.status === 401) {
      this.onUnauthorized();
    }

    if (!response.ok) {
      const messageFromBody = getErrorMessageFromBody(parsedBody);
      const message = messageFromBody ?? `Request failed (HTTP ${response.status})`;
      throw new APIClientError(message, response.status, parsedBody);
    }

    return parsedBody as T;
  }
}


