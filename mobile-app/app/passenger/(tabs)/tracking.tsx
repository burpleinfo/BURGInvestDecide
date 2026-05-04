import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppHeader } from '@/components/common/AppHeader';
import { Screen } from '@/components/common/Screen';
import { AppColors, Fonts } from '@/constants/theme';

const TRACKING_REGION = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.012,
  longitudeDelta: 0.012,
};

const BUS_ROUTE = [
  { latitude: 37.7762, longitude: -122.4240 },
  { latitude: 37.7742, longitude: -122.4194 },
  { latitude: 37.7723, longitude: -122.4148 },
];

const BUS_POSITION = BUS_ROUTE[1];
const PICKUP_POINT = BUS_ROUTE[0];

export default function PassengerTrackingScreen() {
  const router = useRouter();

  return (
    <Screen scroll contentStyle={styles.content}>
      <AppHeader title="Live Tracking" subtitle="Real-time bus location" />

      <AppCard>
        <Text style={styles.sectionTitle}>Real-time Map View</Text>
        <View style={styles.mapCard}>
          <MapView style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={TRACKING_REGION}>
            <Polyline coordinates={BUS_ROUTE} strokeColor={AppColors.teal} strokeWidth={4} />
            <Marker coordinate={PICKUP_POINT} title="Pickup" pinColor={AppColors.teal} />
            <Marker coordinate={BUS_POSITION} title="Bus" pinColor={AppColors.orange} />
          </MapView>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Current Location</Text>
          <Text style={styles.infoValue}>Main Street & 3rd Avenue</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ETA</Text>
          <View style={styles.etaBadge}>
            <Text style={styles.etaText}>8 minutes</Text>
          </View>
        </View>
      </AppCard>

      <AppCard>
        <View style={styles.driverRow}>
          <View>
            <Text style={styles.driverName}>Mike Anderson</Text>
            <Text style={styles.driverMeta}>BUS-342</Text>
          </View>
          <View style={styles.callButton}>
            <Ionicons name="call" size={18} color={AppColors.card} />
          </View>
        </View>
      </AppCard>

      <AppCard style={styles.alertCard}>
        <Text style={styles.alertTitle}>Missed the bus?</Text>
        <Text style={styles.alertText}>
          Closest alternative pickup point: Elm Street & 5th Avenue (0.4 mi walk – 8 minutes)
        </Text>
        <AppButton
          title="Get walking directions"
          onPress={() => router.push('/passenger/walking')}
          icon={<Ionicons name="navigate" size={18} color={AppColors.card} />}
        />
      </AppCard>

      <AppCard>
        <Text style={styles.sectionTitle}>Trip Info</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Next stop</Text>
          <Text style={styles.infoValue}>Oak Street</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Passengers waiting</Text>
          <Text style={styles.infoValue}>2</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Stops completed</Text>
          <Text style={styles.infoValue}>2 of 4</Text>
        </View>
      </AppCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 90,
    gap: 16,
  },
  sectionTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: 8,
  },
  mapCard: {
    height: 200,
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: AppColors.muted,
  },
  infoValue: {
    fontSize: 12,
    color: AppColors.text,
    fontWeight: '600',
  },
  etaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: AppColors.tealSoft,
    borderRadius: 999,
  },
  etaText: {
    color: AppColors.green,
    fontSize: 12,
    fontWeight: '600',
  },
  driverRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverName: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.text,
  },
  driverMeta: {
    fontSize: 12,
    color: AppColors.muted,
    marginTop: 4,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppColors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertCard: {
    backgroundColor: AppColors.orangeSoft,
  },
  alertTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: 6,
  },
  alertText: {
    fontSize: 12,
    color: AppColors.muted,
    marginBottom: 12,
  },
});
