import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { AppColors, Fonts } from '@/constants/theme';
import { passenger as passengerApi } from '@/services/api';

export default function PassengerScanScreen() {
  const router = useRouter();
  const [qrCode, setQrCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadQrCode = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await passengerApi.getQrCode();
        if (!mounted) return;
        setQrCode(response?.data?.qrCode || '');
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || 'Failed to load QR code');
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadQrCode();
    return () => { mounted = false; };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.qrCard}>
        {isLoading ? (
          <ActivityIndicator color={AppColors.teal} />
        ) : qrCode ? (
          <Image source={{ uri: qrCode }} style={styles.qrImage} />
        ) : (
          <Text style={styles.qrError}>{error || 'QR code unavailable'}</Text>
        )}
      </View>
      <Text style={styles.title}>Show this QR to your driver</Text>
      <Text style={styles.subtitle}>
        Your driver will scan this code to mark you onboarded.
      </Text>
      <AppButton title="Back to Home" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
    padding: 20,
    justifyContent: 'center',
    gap: 16,
  },
  qrCard: {
    height: 280,
    borderRadius: 24,
    backgroundColor: AppColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  qrImage: {
    width: 220,
    height: 220,
  },
  qrError: {
    color: AppColors.muted,
    fontSize: 12,
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.text,
  },
  subtitle: {
    color: AppColors.muted,
    fontSize: 13,
  },
});
