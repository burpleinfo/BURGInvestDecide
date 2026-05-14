import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppHeader } from '@/components/common/AppHeader';
import { SkeletonScreen } from '@/components/common/Skeleton';
import { Screen } from '@/components/common/Screen';
import { useToast } from '@/components/common/Toast';
import { AppColors, Fonts } from '@/constants/theme';
import { useDriver } from '@/contexts/DriverContext';

export default function DriverDashboardScreen() {
  const { showToast } = useToast();
  const { driver, route, passengers, isLoading } = useDriver();
  const [showModal, setShowModal] = useState(false);

  // Get driver initials for avatar
  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'DR';
  };

  if (isLoading) {
    return (
      <Screen scroll contentStyle={styles.content}>
        <SkeletonScreen cards={4} />
      </Screen>
    );
  }

  const driverName = driver?.name || 'Driver';
  const busInfo = `${driver?.busNumber || 'BUS-000'} · ${driver?.busType || 'School Bus'}`;
  const initials = getInitials(driverName);
  const routeStops = route?.stops || [];
  const mapCoordinates = routeStops
    .filter((stop) => typeof stop.lat === 'number' && typeof stop.lng === 'number')
    .map((stop) => ({ latitude: stop.lat as number, longitude: stop.lng as number }));
  const mapPath = mapCoordinates.length >= 2 ? mapCoordinates : [];
  const mapRegion = mapCoordinates.length
    ? {
        latitude: mapCoordinates[0].latitude,
        longitude: mapCoordinates[0].longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }
    : null;

  return (
    <Screen scroll contentStyle={styles.content}>
      <AppHeader
        title={`Good morning, ${driverName}`}
        subtitle={`${busInfo}${driver?.institutionName ? ` · ${driver.institutionName}` : ''}`}
        rightSlot={<View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>}
      />

      <AppCard>
        <Text style={styles.sectionTitle}>Driver Profile</Text>
        <View style={styles.profileRow}>
          <Text style={styles.profileLabel}>Email</Text>
          <Text style={styles.profileValue}>{driver?.email || 'Not specified'}</Text>
        </View>
        <View style={styles.profileRow}>
          <Text style={styles.profileLabel}>Phone</Text>
          <Text style={styles.profileValue}>{driver?.phone || 'Not specified'}</Text>
        </View>
        <View style={styles.profileRow}>
          <Text style={styles.profileLabel}>Institution</Text>
          <Text style={styles.profileValue}>{driver?.institutionName || driver?.institutionId || 'Not assigned'}</Text>
        </View>
        <View style={styles.profileRow}>
          <Text style={styles.profileLabel}>License</Text>
          <Text style={styles.profileValue}>{driver?.licenseNumber || 'N/A'} · {driver?.licenseExpiry || 'N/A'}</Text>
        </View>
      </AppCard>

      <AppCard>
        <View style={styles.routeHeader}>
          <Text style={styles.routeTitle}>{route?.name || driver?.route || 'Assigned Route'}</Text>
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>{driver?.status === 'active' ? 'Live' : 'Offline'}</Text>
          </View>
        </View>

        <View style={styles.mapCard}>
          {mapRegion ? (
            <MapView style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={mapRegion}>
              {mapPath.length >= 2 ? (
                <Polyline coordinates={mapPath} strokeColor={AppColors.teal} strokeWidth={4} />
              ) : null}
              {mapCoordinates.map((point, index) => (
                <Marker key={`${point.latitude}-${point.longitude}-${index}`} coordinate={point} title="Stop" pinColor={AppColors.teal} />
              ))}
            </MapView>
          ) : (
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>Route coordinates not available yet.</Text>
            </View>
          )}
        </View>

        <View style={styles.gpsRow}>
          <Ionicons name={driver?.status === 'active' ? 'checkmark-circle' : 'alert-circle'} size={16} color={driver?.status === 'active' ? AppColors.green : AppColors.orange} />
          <Text style={styles.gpsText}>{driver?.status === 'active' ? 'GPS shared with passengers' : 'GPS updates paused'}</Text>
        </View>
      </AppCard>

      <AppCard>
        <Text style={styles.sectionTitle}>Next Stops</Text>
        {(routeStops.length > 0 ? routeStops : []).map((stop, index) => (
          <View key={stop.name} style={styles.stopCard}>
            <View style={styles.stopInfo}>
              <Text style={styles.stopTitle}>{stop.name}</Text>
              <Text style={styles.stopMeta}>
                {stop.time || `Stop ${index + 1}`} · {typeof stop.passengers === 'number' ? `${stop.passengers} passengers` : `${passengers.length} passengers`}
              </Text>
            </View>
            <Text style={styles.stopDistance}>{stop.distance || 'In route'}</Text>
          </View>
        ))}
        {routeStops.length === 0 ? <Text style={styles.emptyText}>No Firestore route assigned yet.</Text> : null}
      </AppCard>

      <AppCard>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>Passengers: {passengers.length}</Text>
          <Text style={styles.progressMeta}>{routeStops.length} stops on route</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
      </AppCard>

      <View style={styles.actionsRow}>
        <Pressable style={[styles.actionChip, styles.actionPrimary]} onPress={() => showToast('Stop marked complete', 'success')}>
          <Ionicons name="checkmark-circle" size={20} color={AppColors.card} />
          <Text style={styles.actionTextLight}>Mark stop</Text>
        </Pressable>
        <Pressable style={styles.actionChip} onPress={() => showToast('Calling office...', 'info')}>
          <Ionicons name="call" size={20} color={AppColors.text} />
          <Text style={styles.actionText}>Call office</Text>
        </Pressable>
        <Pressable style={[styles.actionChip, styles.actionAlert]} onPress={() => setShowModal(true)}>
          <Ionicons name="alert-circle" size={20} color={AppColors.card} />
          <Text style={styles.actionTextLight}>SOS</Text>
        </Pressable>
        <Pressable style={styles.actionChip} onPress={() => showToast('ETA shared', 'success')}>
          <Ionicons name="share" size={20} color={AppColors.text} />
          <Text style={styles.actionText}>Share ETA</Text>
        </Pressable>
      </View>

      <AppButton title="Start Navigation" variant="secondary" onPress={() => showToast('Navigation started', 'info')} />

      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name="alert" size={32} color={AppColors.orange} />
            <Text style={styles.modalTitle}>Alert sent</Text>
            <Text style={styles.modalText}>Admin and parents have been notified.</Text>
            <AppButton title="Close" onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 90,
    gap: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppColors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: AppColors.card,
    fontWeight: '700',
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.text,
  },
  liveBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: AppColors.tealSoft,
    borderRadius: 999,
  },
  liveText: {
    fontSize: 11,
    color: AppColors.green,
    fontWeight: '600',
  },
  mapCard: {
    marginTop: 12,
    height: 200,
    borderRadius: 16,
    backgroundColor: AppColors.surface,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  speedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: AppColors.card,
    borderRadius: 12,
    shadowColor: AppColors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  speedText: {
    fontSize: 12,
    color: AppColors.text,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.surface,
  },
  mapPlaceholderText: {
    color: AppColors.muted,
    fontSize: 12,
  },
  gpsRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gpsText: {
    color: AppColors.green,
    fontSize: 13,
  },
  sectionTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: 8,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.border,
  },
  profileLabel: {
    fontSize: 12,
    color: AppColors.muted,
  },
  profileValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 13,
    color: AppColors.text,
    fontWeight: '600',
  },
  stopCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stopInfo: {
    flex: 1,
  },
  stopTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.text,
  },
  stopMeta: {
    fontSize: 12,
    color: AppColors.muted,
    marginTop: 4,
  },
  stopDistance: {
    fontSize: 12,
    color: AppColors.teal,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 12,
    color: AppColors.muted,
    marginTop: 8,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 13,
    color: AppColors.text,
  },
  progressMeta: {
    fontSize: 12,
    color: AppColors.muted,
  },
  progressBar: {
    height: 8,
    borderRadius: 8,
    backgroundColor: AppColors.border,
  },
  progressFill: {
    height: '100%',
    width: '50%',
    backgroundColor: AppColors.teal,
    borderRadius: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionChip: {
    flexBasis: '48%',
    minHeight: 60,
    borderRadius: 16,
    backgroundColor: AppColors.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: AppColors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  actionPrimary: {
    backgroundColor: AppColors.teal,
  },
  actionAlert: {
    backgroundColor: AppColors.orange,
  },
  actionText: {
    fontSize: 12,
    color: AppColors.text,
  },
  actionTextLight: {
    fontSize: 12,
    color: AppColors.card,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 27, 62, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: AppColors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  modalTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.text,
  },
  modalText: {
    textAlign: 'center',
    color: AppColors.muted,
    fontSize: 13,
  },
});
