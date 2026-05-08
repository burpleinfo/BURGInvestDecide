const DEFAULT_LOCAL_SERVER_ORIGIN = "http://localhost:5000";
const DEFAULT_PRODUCTION_SERVER_ORIGIN = "https://server-x989.onrender.com";
const DEFAULT_RIDESAFE_LOCAL_ORIGIN = "http://localhost:8000";
const DEFAULT_RIDESAFE_PRODUCTION_ORIGIN = "https://server-x989.onrender.com";

// Allow runtime override via a global config object injected on the page
// e.g. <script>window.__RIDE_SAFE_CONFIG = { SERVER_URL: 'https://api.example.com', RIDESAFE_SERVER_URL: 'https://ridesafe.example.com' }</script>
const getRuntimeConfig = () => {
  if (typeof window === 'undefined') return {};
  // Use a namespaced object to avoid collisions
  return window.__RIDE_SAFE_CONFIG || {};
};

export const getApiBaseUrl = () => {
  const runtime = getRuntimeConfig();
  const configuredBaseUrl = runtime.SERVER_URL || import.meta.env.VITE_SERVER_URL;

  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/$/, "");
  }

  if (import.meta.env.DEV) {
    return DEFAULT_LOCAL_SERVER_ORIGIN;
  }

  return DEFAULT_PRODUCTION_SERVER_ORIGIN;
};

export const getApiUrl = (path) => new URL(path, getApiBaseUrl()).toString();

export const getRidesafeBaseUrl = () => {
  const runtime = getRuntimeConfig();
  const configuredBaseUrl = runtime.RIDESAFE_SERVER_URL || import.meta.env.VITE_RIDESAFE_SERVER_URL;

  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/$/, "");
  }

  if (import.meta.env.DEV) {
    return DEFAULT_RIDESAFE_LOCAL_ORIGIN;
  }

  return DEFAULT_RIDESAFE_PRODUCTION_ORIGIN;
};

export const getRidesafeApiUrl = (path) => new URL(path, getRidesafeBaseUrl()).toString();

export const getRidesafeWsUrl = (path) => {
  const baseUrl = getRidesafeBaseUrl();
  const wsBase = baseUrl.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:');
  return new URL(path, wsBase).toString();
};