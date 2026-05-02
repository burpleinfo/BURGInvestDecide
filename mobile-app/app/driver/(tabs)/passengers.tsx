import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppHeader } from '@/components/common/AppHeader';
import { Screen } from '@/components/common/Screen';
import { AppColors, Fonts } from '@/constants/theme';
import { driverPassengers } from '@/data/appData';

export default function DriverPassengersScreen() {
  const [checked, setChecked] = useState<Record<string, boolean>>(
    driverPassengers.reduce((acc, passenger) => {
      acc[passenger.name] = false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const togglePassenger = (name: string) => {
    setChecked((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const markAll = () => {
    const next: Record<string, boolean> = {};
    driverPassengers.forEach((passenger) => {
      next[passenger.name] = true;
    });
    setChecked(next);
  };

  const boardedCount = driverPassengers.filter((passenger) => checked[passenger.name]).length;

  return (
    <Screen scroll contentStyle={styles.content}>
      <AppHeader
        title="Passengers on board"
        subtitle={`${boardedCount} boarded · ${driverPassengers.length} total`}
      />

      {driverPassengers.map((passenger) => (
        <AppCard key={passenger.name}>
          <View style={styles.passengerHeader}>
            <View>
              <Text style={styles.passengerName}>{passenger.name}</Text>
              <Text style={styles.passengerMeta}>
                Age {passenger.age} · {passenger.grade}
              </Text>
            </View>
            <View style={styles.statusGroup}>
              <View
                style={[
                  styles.statusBadge,
                  checked[passenger.name] ? styles.statusBoarded : styles.statusAbsent,
                ]}>
                <Text
                  style={[
                    styles.statusText,
                    checked[passenger.name] ? styles.statusTextBoarded : styles.statusTextAbsent,
                  ]}>
                  {checked[passenger.name] ? 'Boarded' : 'Absent'}
                </Text>
              </View>
              <Pressable onPress={() => togglePassenger(passenger.name)}>
                <Ionicons
                  name={checked[passenger.name] ? 'checkbox' : 'square-outline'}
                  size={26}
                  color={checked[passenger.name] ? AppColors.teal : AppColors.muted}
                />
              </Pressable>
            </View>
          </View>

          {passenger.medical ? (
            <View style={styles.medicalBadge}>
              <Ionicons name="alert" size={14} color={AppColors.red} />
              <Text style={styles.medicalText}>{passenger.medical}</Text>
            </View>
          ) : null}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pickup:</Text>
            <Text style={styles.infoValue}>{passenger.pickup}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Parent:</Text>
            <Text style={styles.infoValue}>{passenger.parent}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Emergency:</Text>
            <Text style={styles.infoValue}>{passenger.emergency}</Text>
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
