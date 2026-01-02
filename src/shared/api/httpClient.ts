
import * as authStorage from '../auth/authStorage';

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

  let message = '';

  if (body.code) {
    message = `[${body.code}] `;
  }

  if (body.title) {
    message += `${body.title} - `;
  }

  if (body.details) {
    message += body.details;
  }

  return message;
}

export type APIClientConfig = {
  baseUrl?: string;
  onUnauthorized?: () => void;
};

const ACCESS_TOKEN_STORAGE_KEY = 'access_token';

// function defaultGetAccessToken(): string | null {
//   return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
// }

// function defaultClearAccessToken(): void {
//   localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
// }

export class APIClient {
  private baseUrl: string;
  private getToken: () => string | null;
  private onUnauthorized: () => void;

  constructor(config: APIClientConfig = {}) {
    this.baseUrl = config.baseUrl ?? '';
    this.getToken = authStorage.getAccessToken;
    this.onUnauthorized = config.onUnauthorized ?? authStorage.clearAccessToken;
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

    headers.Authorization = `Bearer ${token}`;
    headers['Content-Type'] = 'application/json';

    const hasBody = options.body !== undefined && method !== 'GET';

    const response = await fetch(url, {
      method,
      headers,
      signal: options.signal,
      body: hasBody ? JSON.stringify(options.body) : undefined,
    });

    if (!response) {
      console.log("no response");
    }

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
