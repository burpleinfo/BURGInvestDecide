import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';

import { useToast } from '@/components/common/Toast';
import { useAuth } from '@/contexts/AuthContext';

const getRouteForNotification = (role?: string, type?: string) => {
  if (role === 'driver') {
    return '/driver/(tabs)';
  }

  if (role === 'passenger') {
    if (type === 'boarded' || type === 'dropped' || type === 'eta' || type === 'delay' || type === 'assignment') {
      return '/passenger/tracking';
    }
    return '/passenger/(tabs)';
  }

  return '/login';
};

const formatNotificationMessage = (title?: string, body?: string) => {
  if (title && body) return `${title}: ${body}`;
  return title || body || 'You have a new notification';
};

export function NotificationBridge() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const receivedSubscription = Notifications.addNotificationReceivedListener((notification) => {
      const title = notification.request.content.title || undefined;
      const body = notification.request.content.body || undefined;
      const data = notification.request.content.data as Record<string, any> | undefined;

      showToast(formatNotificationMessage(title, body), 'info');

      if (data?.type === 'assignment' && data?.assignedBusNumber) {
        showToast(`Assigned to bus ${data.assignedBusNumber}`, 'success');
      }
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, any> | undefined;
      const route = getRouteForNotification(user?.role, data?.type);

      if (route) {
        router.push(route as never);
      }
    });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, [router, showToast, user?.role]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.getPresentedNotificationsAsync().catch(() => undefined);
    }
  }, []);

  return null;
}