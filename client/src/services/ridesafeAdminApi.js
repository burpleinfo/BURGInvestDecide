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

export const getAdminProfile = (token) => request("/auth/me", {}, token);

export const fetchAdminSnapshot = async (token) => {
  const [buses, routes, drivers, passengers, locations, alerts, revenue] = await Promise.all([
    request("/admin/all-buses", {}, token),
    request("/admin/all-routes", {}, token),
    request("/admin/all-drivers", {}, token),
    request("/admin/all-passengers", {}, token),
    request("/admin/all-locations", {}, token),
    request("/admin/sos-alerts", {}, token),
    request("/admin/revenue", {}, token)
  ]);

  return {
    buses: buses.buses || [],
    routes: routes.routes || [],
    drivers: drivers.drivers || [],
    passengers: passengers.passengers || [],
    liveLocations: locations.locations || {},
    sosAlerts: alerts.alerts || [],
    revenue: revenue || { totalRevenue: "0.00", totalPayments: 0 }
  };
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
