import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { AppColors, Fonts } from '@/constants/theme';

export default function PassengerScanScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.cameraMock}>
        <Ionicons name="camera" size={56} color={AppColors.card} />
        <Text style={styles.cameraText}>Camera preview</Text>
      </View>
      <Text style={styles.title}>Scan bus QR</Text>
      <Text style={styles.subtitle}>
        Align the QR inside the frame to check in with your bus.
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
  cameraMock: {
    height: 320,
    borderRadius: 24,
    backgroundColor: AppColors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cameraText: {
    color: AppColors.card,
    opacity: 0.7,
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
