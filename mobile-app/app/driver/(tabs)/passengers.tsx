import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppHeader } from '@/components/common/AppHeader';
import { Screen } from '@/components/common/Screen';
import { AppColors, Fonts } from '@/constants/theme';
import { useDriver } from '@/contexts/DriverContext';

export default function DriverPassengersScreen() {
  const { passengers } = useDriver();
  const [checked, setChecked] = useState<Record<string, boolean>>(
    passengers.reduce((acc, passenger) => {
      acc[passenger.uid] = false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  useEffect(() => {
    setChecked((prev) => {
      const next: Record<string, boolean> = {};
      passengers.forEach((passenger) => {
        next[passenger.uid] = prev[passenger.uid] || false;
      });
      return next;
    });
  }, [passengers]);

  const togglePassenger = (uid: string) => {
    setChecked((prev) => ({ ...prev, [uid]: !prev[uid] }));
  };

  const markAll = () => {
    const next: Record<string, boolean> = {};
    passengers.forEach((passenger) => {
      next[passenger.uid] = true;
    });
    setChecked(next);
  };

  const boardedCount = passengers.filter((passenger) => checked[passenger.uid]).length;

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
              <Pressable onPress={() => togglePassenger(passenger.uid)}>
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
