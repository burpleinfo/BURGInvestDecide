const DEFAULT_LOCAL_SERVER_ORIGIN = "http://localhost:5000";
const DEFAULT_PRODUCTION_SERVER_ORIGIN = "https://server-x989.onrender.com";
const DEFAULT_RIDESAFE_LOCAL_ORIGIN = "http://localhost:8000";
const DEFAULT_RIDESAFE_PRODUCTION_ORIGIN = "https://server-x989.onrender.com";

export const getApiBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_SERVER_URL;

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
  const configuredBaseUrl = import.meta.env.VITE_RIDESAFE_SERVER_URL;

  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/$/, "");
  }

  if (import.meta.env.DEV) {
    return DEFAULT_RIDESAFE_LOCAL_ORIGIN;
  }

  return DEFAULT_RIDESAFE_PRODUCTION_ORIGIN;
};

export const getRidesafeApiUrl = (path) => new URL(path, getRidesafeBaseUrl()).toString();