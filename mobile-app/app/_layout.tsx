import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ToastProvider } from '@/components/common/Toast';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
    </ThemeProvider>
  );
}
