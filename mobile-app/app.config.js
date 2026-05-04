const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env.local') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const appConfig = require('./app.json');
const expoConfig = appConfig.expo || {};
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

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
  },
};
