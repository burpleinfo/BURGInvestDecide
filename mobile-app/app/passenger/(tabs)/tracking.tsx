import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppHeader } from '@/components/common/AppHeader';
import { SkeletonScreen } from '@/components/common/Skeleton';
import { Screen } from '@/components/common/Screen';
import { AppColors, Fonts } from '@/constants/theme';
import { usePassenger } from '@/contexts/PassengerContext';
import { passenger as passengerApi } from '@/services/api';

export default function PassengerTrackingScreen() {
  const router = useRouter();
  const { passenger, route, isLoading } = usePassenger();
  const [liveLocation, setLiveLocation] = useState(null);
  const [etaInfo, setEtaInfo] = useState(null);
  const [driverInfo, setDriverInfo] = useState(null);
  const [trackingError, setTrackingError] = useState('');

  const pickupStop = useMemo(() => {
    if (!route?.stops?.length) return null;
    return route.stops.find((stop) => stop.name === passenger?.pickupStop || stop.id === passenger?.pickupStop) || null;
  }, [passenger?.pickupStop, route?.stops]);

  const dropCoords = useMemo(() => {
    if (!pickupStop || typeof pickupStop.lat !== 'number' || typeof pickupStop.lng !== 'number') {
      return null;
    }

    return { lat: pickupStop.lat, lng: pickupStop.lng };
  }, [pickupStop]);

  useEffect(() => {
    let mounted = true;

    const loadDriverInfo = async () => {
      if (!passenger?.busId) return;
      try {
        const response = await passengerApi.getDriverInfo(passenger.busId);
        if (mounted) {
          setDriverInfo(response?.data || null);
        }
      } catch (error) {
        if (mounted) {
          setDriverInfo(null);
        }
      }
    };

    loadDriverInfo();
    return () => { mounted = false; };
  }, [passenger?.busId]);

  useEffect(() => {
    let mounted = true;
    let intervalId;

    const loadTracking = async () => {
      if (!passenger?.busId) return;

      try {
        const locationResponse = await passengerApi.getLiveLocation(passenger.busId);
        if (!mounted) return;
        const locationData = locationResponse?.data?.location || null;
        setLiveLocation(locationData);
        setTrackingError('');

        if (dropCoords) {
          const etaResponse = await passengerApi.getEta(passenger.busId, {
            dropLat: dropCoords.lat,
            dropLng: dropCoords.lng,
          });
          if (mounted) {
            setEtaInfo(etaResponse?.data || null);
          }
        }
      } catch (error) {
        if (!mounted) return;
        setLiveLocation(null);
        setEtaInfo(null);
        setTrackingError(error?.message || 'Live location unavailable');
      }
    };

    loadTracking();
    intervalId = setInterval(loadTracking, 10000);

    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [passenger?.busId, dropCoords]);

  if (isLoading) {
    return (
      <Screen scroll contentStyle={styles.content}>
        <SkeletonScreen cards={3} />
      </Screen>
    );
  }

  const routeCoordinates = (route?.stops || [])
    .filter((stop) => typeof stop.lat === 'number' && typeof stop.lng === 'number')
    .map((stop) => ({ latitude: stop.lat as number, longitude: stop.lng as number }));
  const mapPath = routeCoordinates.length >= 2 ? routeCoordinates : [];
  const busPosition = liveLocation ? { latitude: liveLocation.lat, longitude: liveLocation.lng } : null;
  const pickupPoint = routeCoordinates[0] || null;
  const mapRegion = busPosition || pickupPoint || null;

  return (
    <Screen scroll contentStyle={styles.content}>
      <AppHeader title="Live Tracking" subtitle={route?.name || passenger?.route || 'Real-time bus location'} />

      <AppCard>
        <Text style={styles.sectionTitle}>{route?.name || passenger?.route || 'Real-time Map View'}</Text>
        <View style={styles.mapCard}>
          {mapRegion ? (
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: mapRegion.latitude,
                longitude: mapRegion.longitude,
                latitudeDelta: 0.012,
                longitudeDelta: 0.012,
              }}>
              {mapPath.length >= 2 ? (
                <Polyline coordinates={mapPath} strokeColor={AppColors.teal} strokeWidth={4} />
              ) : null}
              {pickupPoint ? <Marker coordinate={pickupPoint} title="Pickup" pinColor={AppColors.teal} /> : null}
              {busPosition ? <Marker coordinate={busPosition} title="Bus" pinColor={AppColors.orange} /> : null}
            </MapView>
          ) : (
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>Live map will appear once a route is assigned.</Text>
            </View>
          )}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Current Location</Text>
          <Text style={styles.infoValue}>
            {busPosition
              ? `${busPosition.latitude.toFixed(4)}, ${busPosition.longitude.toFixed(4)}`
              : trackingError || 'Location unavailable'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ETA</Text>
          <View style={styles.etaBadge}>
            <Text style={styles.etaText}>{etaInfo?.etaText || 'Unavailable'}</Text>
          </View>
        </View>
      </AppCard>

      <AppCard>
        <View style={styles.driverRow}>
          <View>
            <Text style={styles.driverName}>{driverInfo?.driver?.name || 'Driver unassigned'}</Text>
            <Text style={styles.driverMeta}>{driverInfo?.busNumber || passenger?.busNumber || 'Bus not assigned'}</Text>
          </View>
          <View style={styles.callButton}>
            <Ionicons name="call" size={18} color={AppColors.card} />
          </View>
        </View>
      </AppCard>

      <AppCard style={styles.alertCard}>
        <Text style={styles.alertTitle}>Missed the bus?</Text>
        <Text style={styles.alertText}>
          Enable location services to find your nearest alternative pickup point.
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
          <Text style={styles.infoValue}>{route?.stops?.[0]?.name || passenger?.pickupStop || 'Not assigned'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Passengers waiting</Text>
          <Text style={styles.infoValue}>{route?.stops?.[0]?.passengers ?? '—'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Stops completed</Text>
          <Text style={styles.infoValue}>{Math.max(mapPath.length - 1, 0)} of {mapPath.length}</Text>
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
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.surface,
    paddingHorizontal: 16,
  },
  mapPlaceholderText: {
    fontSize: 12,
    color: AppColors.muted,
    textAlign: 'center',
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
