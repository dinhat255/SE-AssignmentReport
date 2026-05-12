export type ApiRole = 'student' | 'lecturer' | 'admin' | 'employee';

export interface ApiUser {
  id: string;
  fullName: string;
  email: string;
  role: ApiRole;
  cardId?: string;
  vehiclePlate?: string;
  phone?: string;
  department?: string;
  userType?: string;
}

type ApiEnvelope<T> =
  | { success: true; data: T }
  | { success: false; error?: { code?: string; message?: string } };

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function getAccessToken() {
  return localStorage.getItem('accessToken');
}

export function getStoredUser(): ApiUser | null {
  const raw = localStorage.getItem('user');
  if (!raw) return null;

  try {
    return JSON.parse(raw) as ApiUser;
  } catch {
    return null;
  }
}

export function getStoredRole(defaultRole: ApiRole = 'student'): ApiRole {
  return getStoredUser()?.role || (localStorage.getItem('accountRole') as ApiRole | null) || defaultRole;
}

export function getStoredUserId() {
  return getStoredUser()?.id || localStorage.getItem('userId') || undefined;
}

export function saveAuthSession(accessToken: string, user: ApiUser) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('accountRole', user.role);
  localStorage.setItem('userName', user.fullName);
  localStorage.setItem('userId', user.id);
  localStorage.setItem('userType', user.userType || (user.role === 'student' || user.role === 'lecturer' ? 'hcmut' : user.role));
}

function buildUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  const token = getAccessToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as ApiEnvelope<T> | T) : null;

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'error' in payload
        ? payload.error?.message
        : undefined;
    throw new Error(message || `HTTP ${response.status}`);
  }

  if (payload && typeof payload === 'object' && 'success' in payload) {
    if (payload.success === false) {
      throw new Error(payload.error?.message || payload.error?.code || 'API request failed');
    }
    return payload.data;
  }

  return payload as T;
}

export function apiGet<T>(path: string) {
  return request<T>(path, { method: 'GET' });
}

export function apiPost<T, B = unknown>(path: string, body?: B) {
  return request<T>(path, {
    method: 'POST',
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export function apiPatch<T, B = unknown>(path: string, body?: B) {
  return request<T>(path, {
    method: 'PATCH',
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
