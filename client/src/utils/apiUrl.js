const DEFAULT_LOCAL_SERVER_ORIGIN = "http://localhost:5000";
const DEFAULT_PRODUCTION_SERVER_ORIGIN = "https://server-x989.onrender.com";

export const getApiBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_SERVER_URL;

  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/$/, "");
  }

  if (typeof window === "undefined") {
    return DEFAULT_PRODUCTION_SERVER_ORIGIN;
  }

  const { origin } = window.location;

  if (/localhost:5173|127\.0\.0\.1:5173/.test(origin)) {
    return DEFAULT_LOCAL_SERVER_ORIGIN;
  }

  return DEFAULT_PRODUCTION_SERVER_ORIGIN;
};

export const getApiUrl = (path) => new URL(path, getApiBaseUrl()).toString();