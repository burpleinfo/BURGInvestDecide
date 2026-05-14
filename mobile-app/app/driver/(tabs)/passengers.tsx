import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppHeader } from '@/components/common/AppHeader';
import { SkeletonScreen } from '@/components/common/Skeleton';
import { Screen } from '@/components/common/Screen';
import { AppColors, Fonts } from '@/constants/theme';
import { useToast } from '@/components/common/Toast';
import { useDriver } from '@/contexts/DriverContext';
import { driver as driverApi } from '@/services/api';

export default function DriverPassengersScreen() {
  const { showToast } = useToast();
  const { driver, isLoading } = useDriver();
  const [passengers, setPassengers] = useState([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [tripId, setTripId] = useState('');
  const [busId, setBusId] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    let mounted = true;

    const normalizePassenger = (raw) => ({
      ...raw,
      uid: raw?.uid || raw?.id,
      id: raw?.id || raw?.uid,
    });

    const loadPassengers = async () => {
      setIsFetching(true);
      try {
        const tripResponse = await driverApi.getMyTrip();
        const tripData = tripResponse?.data || {};

        if (mounted && tripData?.tripId) {
          setTripId(tripData.tripId);
          setBusId(tripData.busId || driver?.busId || '');
          const nextPassengers = Array.isArray(tripData.passengers)
            ? tripData.passengers.map(normalizePassenger)
            : [];
          setPassengers(nextPassengers);

          const nextChecked: Record<string, boolean> = {};
          (tripData.boardedPassengers || []).forEach((uid) => {
            nextChecked[uid] = true;
          });
          setChecked(nextChecked);
          return;
        }

        const passengersResponse = await driverApi.getPassengers();
        if (!mounted) return;
        setTripId('');
        const nextPassengers = Array.isArray(passengersResponse?.data?.passengers)
          ? passengersResponse.data.passengers.map(normalizePassenger)
          : [];
        setPassengers(nextPassengers);
        setChecked({});
        setBusId(driver?.busId || '');
      } catch (error) {
        if (!mounted) return;
        setPassengers([]);
        setChecked({});
        setTripId('');
        setBusId(driver?.busId || '');
        showToast(error?.message || 'Failed to load passengers', 'error');
      } finally {
        if (mounted) {
          setIsFetching(false);
        }
      }
    };

    loadPassengers();
    return () => { mounted = false; };
  }, [driver?.busId, showToast]);

  const togglePassenger = async (uid: string, stopName?: string) => {
    if (checked[uid]) {
      return;
    }

    if (!tripId) {
      showToast('Start a trip to mark passengers as boarded.', 'error');
      return;
    }

    try {
      await driverApi.markBoarded(uid, { tripId, stopName: stopName || 'the stop' });
      setChecked((prev) => ({ ...prev, [uid]: true }));
      showToast('Passenger marked as boarded.', 'success');
    } catch (error) {
      showToast(error?.message || 'Failed to mark passenger', 'error');
    }
  };

  const markAll = async () => {
    if (!tripId || !busId) {
      showToast('Start a trip to mark all passengers.', 'error');
      return;
    }

    try {
      await driverApi.markAllBoarded({ tripId, busId, stopName: 'the stop' });
      const next: Record<string, boolean> = {};
      passengers.forEach((passenger) => {
        next[passenger.uid] = true;
      });
      setChecked(next);
      showToast('All passengers marked as boarded.', 'success');
    } catch (error) {
      showToast(error?.message || 'Failed to mark all passengers', 'error');
    }
  };

  const boardedCount = passengers.filter((passenger) => checked[passenger.uid]).length;

  if (isLoading || isFetching) {
    return (
      <Screen scroll contentStyle={styles.content}>
        <SkeletonScreen cards={4} />
      </Screen>
    );
  }

  return (
    <Screen scroll contentStyle={styles.content}>
      <AppHeader
        title="Passengers on board"
        subtitle={`${boardedCount} boarded · ${passengers.length} total`}
      />

      {passengers.map((passenger) => (
        <AppCard key={passenger.uid}>
          <View style={styles.passengerHeader}>
            <View>
              <Text style={styles.passengerName}>{passenger.name}</Text>
              <Text style={styles.passengerMeta}>
                BURG ID {passenger.burgId || 'N/A'}
              </Text>
            </View>
            <View style={styles.statusGroup}>
              <View
                style={[
                  styles.statusBadge,
                  checked[passenger.uid] ? styles.statusBoarded : styles.statusAbsent,
                ]}>
                <Text
                  style={[
                    styles.statusText,
                    checked[passenger.uid] ? styles.statusTextBoarded : styles.statusTextAbsent,
                  ]}>
                  {checked[passenger.uid] ? 'Boarded' : 'Absent'}
                </Text>
              </View>
              <Pressable onPress={() => togglePassenger(passenger.uid, passenger.pickupStop)}>
                <Ionicons
                  name={checked[passenger.uid] ? 'checkbox' : 'square-outline'}
                  size={26}
                  color={checked[passenger.uid] ? AppColors.teal : AppColors.muted}
                />
              </Pressable>
            </View>
          </View>

          {passenger.pickupStop ? (
            <View style={styles.medicalBadge}>
              <Ionicons name="location" size={14} color={AppColors.red} />
              <Text style={styles.medicalText}>Pickup: {passenger.pickupStop}</Text>
            </View>
          ) : null}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Dropoff:</Text>
            <Text style={styles.infoValue}>{passenger.dropoffStop || 'Not assigned'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Parent:</Text>
            <Text style={styles.infoValue}>{passenger.parentPhone || 'Not assigned'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Contact:</Text>
            <Text style={styles.infoValue}>{passenger.phone || 'Not specified'}</Text>
          </View>
        </AppCard>
      ))}

      <AppButton title="Mark all boarded" onPress={markAll} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 90,
    gap: 16,
  },
  passengerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusBoarded: {
    backgroundColor: '#DCFCE7',
  },
  statusAbsent: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextBoarded: {
    color: AppColors.green,
  },
  statusTextAbsent: {
    color: AppColors.red,
  },
  passengerName: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.text,
  },
  passengerMeta: {
    fontSize: 12,
    color: AppColors.muted,
    marginTop: 4,
  },
  medicalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 10,
  },
  medicalText: {
    fontSize: 12,
    color: AppColors.red,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: AppColors.muted,
  },
  infoValue: {
    fontSize: 12,
    color: AppColors.text,
  },
});
