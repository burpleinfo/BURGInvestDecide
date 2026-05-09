import { getRidesafeApiUrl, getRidesafeWsUrl } from "../utils/apiUrl";

const STORAGE_KEY = "ridesafeAdminToken";

export const getStoredAdminToken = () => {
  if (typeof window === "undefined") {
    return "";
  }
  return window.localStorage.getItem(STORAGE_KEY) || "";
};

export const setStoredAdminToken = (token) => {
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
  const stored = getStoredAdminToken();
  if (stored) {
    return stored;
  }
  return (import.meta.env.VITE_RIDESAFE_ADMIN_TOKEN || "").trim();
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

// Simple in-memory cache to avoid redundant network requests during rapid UI navigation.
const cache = new Map();

const makeCacheKey = (key, token) => `${key}::${token || ""}`;

export const getAdminProfile = async (token) => {
  const key = makeCacheKey("adminProfile", token);
  const TTL = 10000; // 10s
  const now = Date.now();
  const entry = cache.get(key);
  if (entry && now - entry.ts < TTL) {
    return entry.value;
  }

  const data = await request("/auth/me", {}, token);
  cache.set(key, { ts: now, value: data });
  return data;
};

export const fetchAdminSnapshot = async (token) => {
  const key = makeCacheKey("adminSnapshot", token);
  const TTL = 5000; // 5s
  const now = Date.now();
  const entry = cache.get(key);
  if (entry && now - entry.ts < TTL) {
    return entry.value;
  }

  const requests = {
    buses: request("/admin/all-buses", {}, token),
    routes: request("/admin/all-routes", {}, token),
    drivers: request("/admin/all-drivers", {}, token),
    passengers: request("/admin/all-passengers", {}, token),
    locations: request("/admin/all-locations", {}, token),
    alerts: request("/admin/sos-alerts", {}, token),
    revenue: request("/admin/revenue", {}, token)
  };

  const results = await Promise.allSettled(Object.values(requests));
  const keys = Object.keys(requests);

  const mapResult = {};
  results.forEach((res, idx) => {
    mapResult[keys[idx]] = res.status === "fulfilled" ? res.value : null;
  });

  const snapshot = {
    buses: (mapResult.buses && mapResult.buses.buses) || [],
    routes: (mapResult.routes && mapResult.routes.routes) || [],
    drivers: (mapResult.drivers && mapResult.drivers.drivers) || [],
    passengers: (mapResult.passengers && mapResult.passengers.passengers) || [],
    liveLocations: (mapResult.locations && mapResult.locations.locations) || {},
    sosAlerts: (mapResult.alerts && mapResult.alerts.alerts) || [],
    revenue: mapResult.revenue || { totalRevenue: "0.00", totalPayments: 0 }
  };

  cache.set(key, { ts: now, value: snapshot });
  return snapshot;
};

export const fetchLiveLocations = (token) => request("/admin/all-locations", {}, token);

export const createDriver = (payload, token) =>
  request("/admin/create-driver", { method: "POST", body: payload }, token);

export const createPassenger = (payload, token) =>
  request("/admin/create-passenger", { method: "POST", body: payload }, token);

export const broadcastAlert = (payload, token) =>
  request("/admin/broadcast", { method: "POST", body: payload }, token);

export const notifyDelay = (payload, token) =>
  request("/admin/notify-delay", { method: "POST", body: payload }, token);

// ── Bus Operations ────────────────────────────────
export const addBus = (payload, token) =>
  request("/admin/add-bus", { method: "POST", body: payload }, token);

export const updateBus = (busId, payload, token) =>
  request(`/admin/update-bus/${busId}`, { method: "PUT", body: payload }, token);

export const deleteBus = (busId, token) =>
  request(`/admin/delete-bus/${busId}`, { method: "DELETE" }, token);

// ── Route Operations ──────────────────────────────
export const addRoute = (payload, token) =>
  request("/admin/add-route", { method: "POST", body: payload }, token);

export const updateRoute = (routeId, payload, token) =>
  request(`/admin/update-route/${routeId}`, { method: "PUT", body: payload }, token);

export const deleteRoute = (routeId, token) =>
  request(`/admin/delete-route/${routeId}`, { method: "DELETE" }, token);

// ── Trip Operations ───────────────────────────────
export const startTrip = (payload, token) =>
  request("/admin/start-trip", { method: "POST", body: payload }, token);

export const getTripReport = (tripId, token) =>
  request(`/admin/trip-report/${tripId}`, {}, token);

export const adminSignup = (payload) =>
  request("/auth/admin-signup", { method: "POST", body: payload });

export const startAdminSession = (token) =>
  request("/auth/session-login", { method: "POST" }, token);

export const endAdminSession = (token) =>
  request("/auth/session-logout", { method: "POST" }, token);

export const createLiveLocationsSocket = ({ onOpen, onClose, onError, onMessage } = {}) => {
  if (typeof window === "undefined") {
    return null;
  }

  const socket = new WebSocket(getRidesafeWsUrl("/ws/live-locations"));

  if (onOpen) {
    socket.addEventListener("open", onOpen);
  }
  if (onClose) {
    socket.addEventListener("close", onClose);
  }
  if (onError) {
    socket.addEventListener("error", onError);
  }
  if (onMessage) {
    socket.addEventListener("message", (event) => {
      try {
        const payload = JSON.parse(event.data);
        onMessage(payload);
      } catch (error) {
        console.warn("[LiveLocations] Invalid payload", error);
      }
    });
  }

  return socket;
};
