import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import 'react-native-reanimated';

import { SplashScreen } from '@/components/SplashScreen';
import { ToastProvider } from '@/components/common/Toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { DriverProvider } from '@/contexts/DriverContext';
import { PassengerProvider } from '@/contexts/PassengerContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {showSplash && <SplashScreen onAnimationComplete={() => setShowSplash(false)} duration={3000} />}
      <AuthProvider>
        <DriverProvider>
          <PassengerProvider>
            <ToastProvider>
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
