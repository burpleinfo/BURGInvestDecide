const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env.local') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const appConfig = require('./app.json');
const expoConfig = appConfig.expo || {};
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const serverUrl = process.env.EXPO_PUBLIC_SERVER_URL || process.env.VITE_SERVER_URL || 'http://localhost:8000';
const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || process.env.VITE_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID,
};

const iosConfig = { ...(expoConfig.ios || {}) };
const androidConfig = { ...(expoConfig.android || {}) };

if (googleMapsApiKey) {
  iosConfig.config = {
    ...(iosConfig.config || {}),
    googleMapsApiKey,
  };

  androidConfig.config = {
    ...(androidConfig.config || {}),
    googleMaps: {
      ...(androidConfig.config?.googleMaps || {}),
      apiKey: googleMapsApiKey,
    },
  };
}

module.exports = {
  ...appConfig,
  expo: {
    ...expoConfig,
    ios: iosConfig,
    android: androidConfig,
    // Expose environment variables to the app
    extra: {
      ...expoConfig.extra,
      serverUrl,
      apiBaseUrl,
      firebaseConfig,
    },
  },
};
