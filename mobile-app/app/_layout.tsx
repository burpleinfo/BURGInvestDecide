import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import 'react-native-reanimated';

import { SplashScreen } from '@/components/SplashScreen';
import { NotificationPermissionPrompt } from '@/components/NotificationPermissionPrompt';
import { NotificationBridge } from '@/components/NotificationBridge';
import { ToastProvider } from '@/components/common/Toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { DriverProvider } from '@/contexts/DriverContext';
import { PassengerProvider } from '@/contexts/PassengerContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (Notifications.setNotificationChannelAsync) {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4FD1C5',
      }).catch((error) => {
        console.warn('[RootLayout] Failed to create notification channel', error);
      });
    }
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {showSplash && <SplashScreen onAnimationComplete={() => setShowSplash(false)} duration={3000} />}
      <AuthProvider>
        <DriverProvider>
          <PassengerProvider>
            <ToastProvider>
              <NotificationBridge />
              <NotificationPermissionPrompt />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="login" />
                <Stack.Screen name="auth/driver/login" />
                <Stack.Screen name="auth/driver/signup" />
                <Stack.Screen name="auth/passenger/login" />
                <Stack.Screen name="auth/passenger/signup" />
                <Stack.Screen name="driver/(tabs)" />
                <Stack.Screen name="passenger/(tabs)" />
                <Stack.Screen name="passenger/scan" />
                <Stack.Screen name="passenger/walking" />
              </Stack>
              <StatusBar style="auto" />
            </ToastProvider>
          </PassengerProvider>
        </DriverProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
