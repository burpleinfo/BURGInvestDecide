import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Allow runtime override of Firebase config via window.__RIDE_SAFE_CONFIG
const runtimeConfig = typeof window !== 'undefined' ? window.__RIDE_SAFE_CONFIG || {} : {};

const firebaseConfig = {
  apiKey: runtimeConfig.FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: runtimeConfig.FIREBASE_AUTH_DOMAIN || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: runtimeConfig.FIREBASE_DATABASE_URL || import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: runtimeConfig.FIREBASE_PROJECT_ID || import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: runtimeConfig.FIREBASE_STORAGE_BUCKET || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: runtimeConfig.FIREBASE_MESSAGING_SENDER_ID || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: runtimeConfig.FIREBASE_APP_ID || import.meta.env.VITE_FIREBASE_APP_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

export { firebaseApp, firebaseAuth };
