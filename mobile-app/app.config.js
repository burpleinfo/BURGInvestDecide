const path = require('path');
const dotenv = require('dotenv');

// Load env files in order: .env → .env.production → .env.local
// Each file overrides the previous, so .env.local has highest priority
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '.env.production') });
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const serverUrl = process.env.EXPO_PUBLIC_SERVER_URL || process.env.VITE_SERVER_URL || 'http://localhost:8000';
const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL || 'http://localhost:8000';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || process.env.VITE_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID,
};

const iosConfig = { supportsTablet: true };
const androidConfig = {
  adaptiveIcon: {
    backgroundColor: '#EBF0F6',
    foregroundImage: './assets/images/android-icon-foreground.png',
    backgroundImage: './assets/images/android-icon-background.png',
    monochromeImage: './assets/images/android-icon-monochrome.png',
  },
  edgeToEdgeEnabled: true,
  predictiveBackGestureEnabled: false,
  package: 'com.kandakatlasatwik.mobileapp',
};

if (googleMapsApiKey) {
  iosConfig.config = {
    googleMapsApiKey,
  };

  androidConfig.config = {
    googleMaps: {
      apiKey: googleMapsApiKey,
    },
  };
}

module.exports = {
  expo: {
    name: 'mobile-app',
    slug: 'mobile-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'mobileapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: iosConfig,
    android: androidConfig,
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#EBF0F6',
          dark: {
            backgroundColor: '#0F1726',
          },
        },
      ],
      'expo-secure-store',
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    updates: {
      enabled: false,
    },
    extra: {
      router: {},
      eas: {
        projectId: '652b1fa6-d064-48a2-8f80-0ffdedf4ea13',
      },
      serverUrl,
      apiBaseUrl,
      googleMapsApiKey,
      firebaseConfig,
    },
  },
};
