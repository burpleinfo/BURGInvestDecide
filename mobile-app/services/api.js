import Constants from 'expo-constants';
import { auth as firebaseAuth } from '@/services/firebase';

/**
 * API Service - Handles all communication with the RIDESAFE backend server
 * without depending on third-party HTTP clients.
 */

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:8000';

console.log(`[API Service] Initialized with base URL: ${API_BASE_URL}`);

const buildUrl = (path, params) => {
  const normalizedBase = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${normalizedBase}${normalizedPath}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
};

const request = async (method, path, body, params) => {
  const currentUser = firebaseAuth.currentUser;
  let authorization;

  if (currentUser) {
    try {
      authorization = `Bearer ${await currentUser.getIdToken()}`;
    } catch (error) {
      console.warn('[API Service] Failed to resolve Firebase ID token', error);
    }
  }

  const response = await fetch(buildUrl(path, params), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authorization ? { Authorization: authorization } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const error = new Error((data && data.message) || `Request failed with status ${response.status}`);
    error.response = { status: response.status, data };
    throw error;
  }

  return {
    data,
    status: response.status,
    ok: response.ok,
  };
};

const apiClient = {
  get: (path, options = {}) => request('GET', path, undefined, options.params),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
};

export const auth = {
  driverLogin: (uid) => apiClient.post('/auth/driver-login', { uid }),
  passengerLogin: (uid) => apiClient.post('/auth/passenger-login', { uid }),
  getCurrentUser: () => apiClient.get('/auth/me'),
  saveFcmToken: (fcmToken) => apiClient.post('/auth/save-fcm-token', { fcmToken }),
};

export const driver = {
  getProfile: (driverId) => apiClient.get(`/driver/${driverId}`),
  updateProfile: (driverId, data) => apiClient.put(`/driver/${driverId}`, data),
  getActiveRides: (driverId) => apiClient.get(`/driver/${driverId}/rides/active`),
  completeRide: (rideId, data) => apiClient.post(`/rides/${rideId}/complete`, data),
  updateLocation: (driverId, coordinates) => apiClient.post(`/driver/${driverId}/location`, coordinates),
};

export const passenger = {
  getProfile: (passengerId) => apiClient.get(`/passenger/${passengerId}`),
  updateProfile: (passengerId, data) => apiClient.put(`/passenger/${passengerId}`, data),
  requestRide: (rideData) => apiClient.post('/rides/request', rideData),
  getRideHistory: (passengerId) => apiClient.get(`/passenger/${passengerId}/rides/history`),
  cancelRide: (rideId) => apiClient.post(`/rides/${rideId}/cancel`),
};

export const rides = {
  getRideDetails: (rideId) => apiClient.get(`/rides/${rideId}`),
  getNearbyDrivers: (location, radius = 5000) => apiClient.get('/rides/drivers/nearby', {
    params: { lat: location.latitude, lng: location.longitude, radius },
  }),
  updateRideStatus: (rideId, status) => apiClient.patch(`/rides/${rideId}/status`, { status }),
  trackRide: (rideId) => apiClient.get(`/rides/${rideId}/track`),
};

export const institutions = {
  getAll: () => apiClient.get('/institutions'),
  getById: (institutionId) => apiClient.get(`/institutions/${institutionId}`),
  getSafetyTips: () => apiClient.get('/institutions/safety-tips'),
  reportIssue: (issueData) => apiClient.post('/institutions/report', issueData),
};

export const health = {
  check: () => apiClient.get('/health'),
};

export default apiClient;
