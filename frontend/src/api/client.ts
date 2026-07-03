const BASE = '/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

function getToken(): string | null {
  try {
    const raw = localStorage.getItem('budget_auth');
    if (!raw) return null;
    return JSON.parse(raw).accessToken;
  } catch {
    return null;
  }
}

export async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${url}`, {
    headers,
    ...options,
  });

  if (!res.ok) {
    if (res.status === 401 && token) {
      localStorage.removeItem('budget_auth');
      window.location.href = '/';
    }
    const body = await res.json().catch(() => ({}));
    const detail = body.errors ? body.errors.map((e: { field: string; message: string }) => `${e.field}: ${e.message}`).join(', ') : '';
    throw new ApiError(`${body.message}${detail ? ` (${detail})` : ''}` || `Request failed: ${res.status}`, res.status);
  }

  if (res.status === 204) return undefined as T;

  const json = await res.json();
  return json.data as T;
}
