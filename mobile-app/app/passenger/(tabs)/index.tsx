import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppHeader } from '@/components/common/AppHeader';
import { SkeletonScreen } from '@/components/common/Skeleton';
import { Screen } from '@/components/common/Screen';
import { useToast } from '@/components/common/Toast';
import { AppColors, Fonts } from '@/constants/theme';
import { usePassenger } from '@/contexts/PassengerContext';

export default function PassengerHomeScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { passenger, route, isLoading } = usePassenger();

  if (isLoading) {
    return (
      <Screen scroll contentStyle={styles.content}>
        <SkeletonScreen cards={4} />
      </Screen>
    );
  }

  const initials = (passenger?.name || 'Passenger')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'P';

  return (
    <Screen scroll contentStyle={styles.content}>
      <AppHeader
        title={`Hello, ${passenger?.name || 'Passenger'}`}
        subtitle={passenger?.route || route?.name || 'Your route updates are live'}
        rightSlot={<View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>}
      />

      <AppCard style={styles.burgCard}>
        <Text style={styles.burgLabel}>Your BURG ID</Text>
        <View style={styles.burgRow}>
          <Text style={styles.burgId}>{passenger?.burgId || 'Not assigned'}</Text>
          <Pressable onPress={() => showToast('BURG ID copied', 'success')}>
            <Ionicons name="copy" size={18} color={AppColors.card} />
          </Pressable>
        </View>
        <Text style={styles.burgMeta}>
          {passenger?.institutionName || passenger?.institutionId || 'Institution not assigned'}
        </Text>
      </AppCard>

      <AppButton
        title="Scan bus QR to board"
        onPress={() => router.push('/passenger/scan')}
        icon={<Ionicons name="qr-code" size={20} color={AppColors.card} />}
      />

      <AppCard>
        <Text style={styles.sectionTitle}>Trip Summary</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Pickup stop</Text>
          <Text style={styles.infoValue}>{passenger?.pickupStop || 'Not assigned'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Dropoff stop</Text>
          <Text style={styles.infoValue}>{passenger?.dropoffStop || 'Not assigned'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Bus number</Text>
          <Text style={styles.infoValue}>{passenger?.busNumber || 'BUS-000'}</Text>
        </View>
      </AppCard>

      <AppCard>
        <Text style={styles.sectionTitle}>Upcoming Route Stops</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
          {(route?.stops || []).length > 0 ? route!.stops.map((stop) => (
            <View key={stop.id || stop.name} style={styles.stopChip}>
              <Text style={styles.stopName}>{stop.name}</Text>
              <Text style={styles.stopMeta}>{stop.time || stop.distance || 'Scheduled stop'}</Text>
            </View>
          )) : (
            <View style={styles.stopChip}>
              <Text style={styles.stopName}>No route assigned</Text>
              <Text style={styles.stopMeta}>Ask admin to assign your route</Text>
            </View>
          )}
        </ScrollView>
        <AppButton title="Save route alert" onPress={() => showToast('Route alert saved', 'success')} />
      </AppCard>
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
  burgCard: {
    backgroundColor: AppColors.teal,
  },
  burgLabel: {
    color: AppColors.card,
    opacity: 0.85,
    fontSize: 12,
  },
  burgRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  burgId: {
    color: AppColors.card,
    fontSize: 20,
    fontFamily: Fonts.rounded,
    fontWeight: '700',
  },
  burgMeta: {
    marginTop: 8,
    color: AppColors.card,
    opacity: 0.9,
    fontSize: 12,
  },
  sectionTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: 10,
  },
  dayScroll: {
    marginBottom: 12,
  },
  stopChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: AppColors.surface,
    marginRight: 8,
    minWidth: 140,
  },
  stopName: {
    color: AppColors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  stopMeta: {
    marginTop: 4,
    color: AppColors.muted,
    fontSize: 11,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
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
});
