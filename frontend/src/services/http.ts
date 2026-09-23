const STORAGE_KEY = "authHeader";

let authHeader: string | null = sessionStorage.getItem(STORAGE_KEY);

export function setAuthHeader(username: string, password: string) {
  authHeader = "Basic " + btoa(`${username}:${password}`);
  sessionStorage.setItem(STORAGE_KEY, authHeader);
}

export function clearAuthHeader() {
  authHeader = null;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function getAuthHeader(): string | null {
  return authHeader;
}

export function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers);
  if (authHeader) {
    headers.set("Authorization", authHeader);
  }
  return fetch(url, { ...options, headers });
}
