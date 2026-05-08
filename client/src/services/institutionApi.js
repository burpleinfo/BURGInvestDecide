// services/institutionApi.js

import { getRidesafeApiUrl } from "../utils/apiUrl";

const INSTITUTION_TOKEN_KEY = "institutionAdminToken";

export const getStoredInstitutionToken = () => {
  if (typeof window === "undefined") {
    return "";
  }
  return window.localStorage.getItem(INSTITUTION_TOKEN_KEY) || "";
};

export const setStoredInstitutionToken = (token) => {
  if (typeof window === "undefined") {
    return;
  }
  const trimmed = token.trim();
  if (!trimmed) {
    window.localStorage.removeItem(INSTITUTION_TOKEN_KEY);
    return;
  }
  window.localStorage.setItem(INSTITUTION_TOKEN_KEY, trimmed);
};

const resolveToken = (tokenOverride) => {
  if (tokenOverride) {
    return tokenOverride.trim();
  }
  const stored = getStoredInstitutionToken();
  if (stored) {
    return stored;
  }
  return (import.meta.env.VITE_INSTITUTION_ADMIN_TOKEN || "").trim();
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

// ── Institution Operations ───────────────────────
export const getInstitution = (institutionId, token) =>
  request(`/institution/institution/${institutionId}`, {}, token);

export const getInstitutionSnapshot = async (institutionId, token) => {
  const [institution, drivers, passengers, routes] = await Promise.all([
    request(`/institution/institution/${institutionId}`, {}, token),
    request(`/institution/institution/${institutionId}/drivers`, {}, token),
    request(`/institution/institution/${institutionId}/passengers`, {}, token),
    request(`/institution/institution/${institutionId}/routes`, {}, token)
  ]);

  return {
    institution,
    drivers: drivers.drivers || [],
    passengers: passengers.passengers || [],
    routes: routes.routes || []
  };
};

// ── Driver Operations ────────────────────────────
export const getInstitutionDrivers = (institutionId, token) =>
  request(`/institution/institution/${institutionId}/drivers`, {}, token);

export const createInstitutionDriver = (institutionId, driverData, token) =>
  request(`/institution/institution/${institutionId}/drivers`, 
    { method: "POST", body: driverData }, token);

export const updateInstitutionDriver = (institutionId, driverId, updateData, token) =>
  request(`/institution/institution/${institutionId}/drivers/${driverId}`, 
    { method: "PUT", body: updateData }, token);

export const deleteInstitutionDriver = (institutionId, driverId, token) =>
  request(`/institution/institution/${institutionId}/drivers/${driverId}`, 
    { method: "DELETE" }, token);

// ── Passenger Operations ─────────────────────────
export const getInstitutionPassengers = (institutionId, token) =>
  request(`/institution/institution/${institutionId}/passengers`, {}, token);

export const createInstitutionPassenger = (institutionId, passengerData, token) =>
  request(`/institution/institution/${institutionId}/passengers`, 
    { method: "POST", body: passengerData }, token);

export const updateInstitutionPassenger = (institutionId, passengerId, updateData, token) =>
  request(`/institution/institution/${institutionId}/passengers/${passengerId}`, 
    { method: "PUT", body: updateData }, token);

export const deleteInstitutionPassenger = (institutionId, passengerId, token) =>
  request(`/institution/institution/${institutionId}/passengers/${passengerId}`, 
    { method: "DELETE" }, token);

// ── Route Operations ────────────────────────────
export const getInstitutionRoutes = (institutionId, token) =>
  request(`/institution/institution/${institutionId}/routes`, {}, token);

export const createInstitutionRoute = (institutionId, routeData, token) =>
  request(`/institution/institution/${institutionId}/routes`, 
    { method: "POST", body: routeData }, token);

// ── Batch Operations ────────────────────────────
export const createMultipleDrivers = async (institutionId, drivers, token) => {
  const results = await Promise.allSettled(
    drivers.map(driverData => createInstitutionDriver(institutionId, driverData, token))
  );
  return results;
};

export const createMultiplePassengers = async (institutionId, passengers, token) => {
  const results = await Promise.allSettled(
    passengers.map(passengerData => createInstitutionPassenger(institutionId, passengerData, token))
  );
  return results;
};

// ── Token Export ────────────────────────────────
export const generateAdminInstitutionToken = async (adminData) => {
  // This would be called after director approves the admin request
  // The token is returned from the backend when the institution is created
  return adminData.adminToken || null;
};
