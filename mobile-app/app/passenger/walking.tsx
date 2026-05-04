import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { AppColors, Fonts } from '@/constants/theme';

const WALK_REGION = {
  latitude: 37.7728,
  longitude: -122.4185,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const WALK_ROUTE = [
  { latitude: 37.7738, longitude: -122.4225 },
  { latitude: 37.7710, longitude: -122.4142 },
];

export default function PassengerWalkingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.mapMock}>
        <MapView style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={WALK_REGION}>
          <Polyline coordinates={WALK_ROUTE} strokeColor={AppColors.teal} strokeWidth={4} />
          <Marker coordinate={WALK_ROUTE[0]} title="Start" pinColor={AppColors.teal} />
          <Marker coordinate={WALK_ROUTE[1]} title="Pickup" pinColor={AppColors.orange} />
        </MapView>
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
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
