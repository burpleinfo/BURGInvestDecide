import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppHeader } from '@/components/common/AppHeader';
import { Screen } from '@/components/common/Screen';
import { useToast } from '@/components/common/Toast';
import { AppColors, Fonts } from '@/constants/theme';
import { driverStops } from '@/data/appData';

const DRIVER_REGION = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

const DRIVER_ROUTE = [
  { latitude: 37.7820, longitude: -122.4325 },
  { latitude: 37.7764, longitude: -122.4250 },
  { latitude: 37.7710, longitude: -122.4172 },
  { latitude: 37.7685, longitude: -122.4098 },
];

const DRIVER_BUS = DRIVER_ROUTE[2];
const DRIVER_START = DRIVER_ROUTE[0];

export default function DriverDashboardScreen() {
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);

  return (
    <Screen scroll contentStyle={styles.content}>
      <AppHeader
        title="Good morning, Mike"
        subtitle="BUS-342 · School Bus"
        rightSlot={<View style={styles.avatar}><Text style={styles.avatarText}>MA</Text></View>}
      />

      <AppCard>
        <View style={styles.routeHeader}>
          <Text style={styles.routeTitle}>Route A – North District</Text>
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>Live</Text>
          </View>
        </View>

        <View style={styles.mapCard}>
          <MapView style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={DRIVER_REGION}>
            <Polyline coordinates={DRIVER_ROUTE} strokeColor={AppColors.teal} strokeWidth={4} />
            <Marker coordinate={DRIVER_START} title="Route start" pinColor={AppColors.teal} />
            <Marker coordinate={DRIVER_BUS} title="Bus" pinColor={AppColors.orange} />
          </MapView>
          <View style={styles.speedBadge}>
            <Ionicons name="speedometer" size={14} color={AppColors.teal} />
            <Text style={styles.speedText}>28 mph</Text>
          </View>
        </View>

        <View style={styles.gpsRow}>
          <Ionicons name="checkmark-circle" size={16} color={AppColors.green} />
          <Text style={styles.gpsText}>GPS shared with passengers</Text>
        </View>
      </AppCard>

      <AppCard>
        <Text style={styles.sectionTitle}>Next Stops</Text>
        {driverStops.map((stop) => (
          <View key={stop.name} style={styles.stopCard}>
            <View style={styles.stopInfo}>
              <Text style={styles.stopTitle}>{stop.name}</Text>
              <Text style={styles.stopMeta}>
                {stop.time} · pickup · {stop.passengers} passengers
              </Text>
            </View>
            <Text style={styles.stopDistance}>{stop.distance} away</Text>
          </View>
        ))}
      </AppCard>

      <AppCard>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>Completed 2 of 4 stops</Text>
          <Text style={styles.progressMeta}>Total distance 12.5 mi</Text>
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
