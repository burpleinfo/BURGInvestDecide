import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { AppColors, Fonts } from '@/constants/theme';

export default function PassengerWalkingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.mapMock}>
        <View style={styles.routeLine} />
        <View style={styles.startDot} />
        <View style={styles.endDot} />
      </View>
      <Text style={styles.title}>Walking directions</Text>
      <Text style={styles.subtitle}>
        Walk 0.4 mi (8 minutes) to Elm Street & 5th Avenue pickup point.
      </Text>
      <AppButton title="Back to Tracking" onPress={() => router.back()} />
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
  mapMock: {
    height: 240,
    borderRadius: 24,
    backgroundColor: AppColors.border,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  routeLine: {
    height: 4,
    backgroundColor: AppColors.teal,
    marginHorizontal: 30,
    borderRadius: 4,
  },
  startDot: {
    position: 'absolute',
    left: 30,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: AppColors.teal,
  },
  endDot: {
    position: 'absolute',
    right: 30,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: AppColors.orange,
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
