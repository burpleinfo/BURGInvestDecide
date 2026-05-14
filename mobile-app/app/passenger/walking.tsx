import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { AppColors, Fonts } from '@/constants/theme';
import { usePassenger } from '@/contexts/PassengerContext';

export default function PassengerWalkingScreen() {
  const router = useRouter();
  const { passenger, route } = usePassenger();
  const pickupStop = route?.stops?.find((stop) => stop.name === passenger?.pickupStop || stop.id === passenger?.pickupStop);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Walking directions</Text>
      <Text style={styles.subtitle}>
        {pickupStop
          ? `Walk to ${pickupStop.name} to board your bus.`
          : 'Enable location to receive walking directions to your pickup point.'}
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
