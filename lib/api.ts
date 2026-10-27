import { BASE_URL } from './config';

const REQUEST_TIMEOUT_MS = 30_000;

export type ApiResult = {
  ok: boolean;
  status: number;
  data: any;
};

function buildUrl(endpoint: string): string {
  const normalizedBase = BASE_URL.replace(/\/+$/, '');
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${normalizedBase}${normalizedEndpoint}`;
}

export function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = REQUEST_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timer));
}

export async function apiFetch(
  token: string,
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResult> {
  const url = buildUrl(endpoint);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  };

  try {
    const response = await fetchWithTimeout(url, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string> | undefined),
      },
    });

    const text = await response.text();
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return { ok: response.ok, status: response.status, data };
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      return { ok: false, status: 408, data: { msg: 'Request timed out. Please try again.' } };
    }
    return { ok: false, status: 0, data: { msg: error?.message ?? 'Network error. Check your connection.' } };
  }
}

export async function apiPost(
  token: string,
  endpoint: string,
  body: Record<string, any>
): Promise<ApiResult> {
  return apiFetch(token, endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function apiGet(token: string, endpoint: string): Promise<ApiResult> {
  return apiFetch(token, endpoint, { method: 'GET' });
}

export function buildAbsoluteUrl(path: string): string {
  return buildUrl(path);
}
