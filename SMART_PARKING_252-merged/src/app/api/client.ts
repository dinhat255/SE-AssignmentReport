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

export interface LoginEventRecord {
  userId: string;
  role: ApiRole;
  userType?: string;
  timestamp: string;
}

type ApiEnvelope<T> =
  | { success: true; data: T }
  | { success: false; error?: { code?: string; message?: string } };

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const AUTH_COOKIE_NAME = 'smart_parking_auth';
const LOGIN_EVENTS_KEY = 'loginEvents';

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

function setCookie(name: string, value: string, days = 7) {
  if (!isBrowser()) return;

  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string) {
  if (!isBrowser()) return null;

  const prefix = `${encodeURIComponent(name)}=`;
  const entry = document.cookie.split('; ').find((item) => item.startsWith(prefix));
  if (!entry) return null;

  return decodeURIComponent(entry.slice(prefix.length));
}

function hydrateAuthFromCookie() {
  if (!isBrowser()) return;
  if (localStorage.getItem('accessToken') && localStorage.getItem('user')) return;

  const raw = getCookie(AUTH_COOKIE_NAME);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw) as { accessToken?: string; user?: ApiUser };
    if (!parsed.accessToken || !parsed.user) return;

    localStorage.setItem('accessToken', parsed.accessToken);
    localStorage.setItem('user', JSON.stringify(parsed.user));
    localStorage.setItem('accountRole', parsed.user.role);
    localStorage.setItem('userName', parsed.user.fullName);
    localStorage.setItem('userId', parsed.user.id);
    localStorage.setItem('userType', parsed.user.userType || (parsed.user.role === 'student' || parsed.user.role === 'lecturer' ? 'hcmut' : parsed.user.role));
  } catch {
    // Ignore malformed cookie payloads.
  }
}

function readLoginEvents() {
  if (!isBrowser()) return [] as LoginEventRecord[];

  const raw = localStorage.getItem(LOGIN_EVENTS_KEY);
  if (!raw) return [] as LoginEventRecord[];

  try {
    const parsed = JSON.parse(raw) as LoginEventRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as LoginEventRecord[];
  }
}

function writeLoginEvents(events: LoginEventRecord[]) {
  if (!isBrowser()) return;
  localStorage.setItem(LOGIN_EVENTS_KEY, JSON.stringify(events.slice(-200)));
}

hydrateAuthFromCookie();

function getAccessToken() {
  hydrateAuthFromCookie();
  return localStorage.getItem('accessToken');
}

export function getStoredUser(): ApiUser | null {
  hydrateAuthFromCookie();
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

export function recordLoginEvent(user: ApiUser) {
  if (!isBrowser()) return;

  const events = readLoginEvents();
  events.push({
    userId: user.id,
    role: user.role,
    userType: user.userType,
    timestamp: new Date().toISOString(),
  });
  writeLoginEvents(events);
}

export function getLoginFrequencyFromStoredLogins(role?: ApiRole) {
  const events = readLoginEvents().filter((event) => !role || event.role === role);
  if (!events.length) return [] as { month: string; count: number }[];

  const byMonth = new Map<string, number>();

  events.forEach((event) => {
    const date = new Date(event.timestamp);
    if (Number.isNaN(date.getTime())) return;

    const monthKey = `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    byMonth.set(monthKey, (byMonth.get(monthKey) || 0) + 1);
  });

  return [...byMonth.entries()]
    .sort((a, b) => {
      const [aMonth, aYear] = a[0].split('/').map(Number);
      const [bMonth, bYear] = b[0].split('/').map(Number);
      return aYear === bYear ? aMonth - bMonth : aYear - bYear;
    })
    .map(([month, count]) => ({ month, count }));
}

export function saveAuthSession(accessToken: string, user: ApiUser, options?: { rememberMe?: boolean }) {
  hydrateAuthFromCookie();
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('accountRole', user.role);
  localStorage.setItem('userName', user.fullName);
  localStorage.setItem('userId', user.id);
  localStorage.setItem('userType', user.userType || (user.role === 'student' || user.role === 'lecturer' ? 'hcmut' : user.role));

  setCookie(
    AUTH_COOKIE_NAME,
    JSON.stringify({ accessToken, user }),
    options?.rememberMe ? 30 : 7
  );

  recordLoginEvent(user);
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
