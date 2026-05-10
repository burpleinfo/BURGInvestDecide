import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { AppButton } from '@/components/common/AppButton';
import { AppColors, Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { registerAndSavePushToken } from '@/services/notifications';

const STORAGE_KEY = 'ridesafe_notification_prompt_seen_v1';

export function NotificationPermissionPrompt() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      if (!user) {
        if (active) {
          setVisible(false);
          setChecked(true);
        }
        return;
      }

      try {
        const seen = await SecureStore.getItemAsync(STORAGE_KEY);
        if (active && !seen) {
          setVisible(true);
        }
      } catch (error) {
        console.warn('[NotificationPermissionPrompt] failed to read prompt flag', error);
      } finally {
        if (active) {
          setChecked(true);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [user]);

  const dismissPrompt = async () => {
    try {
      await SecureStore.setItemAsync(STORAGE_KEY, 'dismissed');
    } catch (error) {
      console.warn('[NotificationPermissionPrompt] failed to persist prompt flag', error);
    }
    setVisible(false);
  };

  const handleAllow = async () => {
    setBusy(true);
    try {
      const result = await registerAndSavePushToken();
      if (result.ok) {
        await dismissPrompt();
      } else {
        console.warn('[NotificationPermissionPrompt] token registration failed:', result.reason);
      }
    } catch (error) {
      console.warn('[NotificationPermissionPrompt] token registration threw:', error);
    } finally {
      setBusy(false);
    }
  };

  const handleDeny = async () => {
    await dismissPrompt();
  };

  if (!user || !checked) {
    return null;
  }

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <Pressable style={styles.overlay} onPress={handleDeny} />
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>🔔</Text>
          </View>
          <Text style={styles.title}>Enable notifications?</Text>
          <Text style={styles.body}>
            BURG RideSafe can send trip updates, alerts, and safety messages to this device.
          </Text>
          <View style={styles.actions}>
            <AppButton
              title={busy ? 'Requesting...' : 'Allow notifications'}
              onPress={handleAllow}
              disabled={busy}
            />
            <AppButton
              title="Not now"
              variant="outline"
              onPress={handleDeny}
              disabled={busy}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    backgroundColor: AppColors.card,
    borderRadius: 24,
    padding: 22,
    gap: 14,
    shadowColor: AppColors.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: AppColors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 22,
    fontWeight: '700',
    color: AppColors.text,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: AppColors.muted,
  },
  actions: {
    gap: 10,
  },
});