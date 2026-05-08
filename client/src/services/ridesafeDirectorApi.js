import { getRidesafeApiUrl } from "../utils/apiUrl";

const STORAGE_KEY = "ridesafeDirectorToken";

export const getStoredDirectorToken = () => {
  if (typeof window === "undefined") {
    return "";
  }
  return window.localStorage.getItem(STORAGE_KEY) || "";
};

export const setStoredDirectorToken = (token) => {
  if (typeof window === "undefined") {
    return;
  }
  const trimmed = token.trim();
  if (!trimmed) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, trimmed);
};

const resolveToken = (tokenOverride) => {
  if (tokenOverride) {
    return tokenOverride.trim();
  }
  return getStoredDirectorToken();
};

const request = async (path, options = {}, tokenOverride) => {
  const token = resolveToken(tokenOverride);
  const { method = "GET", body } = options;
  const headers = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(getRidesafeApiUrl(path), {
    method,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : {};

  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed (${response.status})`);
  }

  return data;
};

export const fetchDirectorSnapshot = (token) => request("/director/snapshot", {}, token);

export const approveAdminRequest = (requestId, token) =>
  request(`/director/admin-requests/${requestId}/approve`, { method: "POST" }, token);
