import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppHeader } from '@/components/common/AppHeader';
import { Screen } from '@/components/common/Screen';
import { useToast } from '@/components/common/Toast';
import { AppColors, Fonts } from '@/constants/theme';
import {
  passengerAfternoonTimes,
  passengerDays,
  passengerMorningTimes,
} from '@/data/appData';

export default function PassengerHomeScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedDay, setSelectedDay] = useState(passengerDays[0]);
  const [morning, setMorning] = useState(passengerMorningTimes[0]);
  const [afternoon, setAfternoon] = useState(passengerAfternoonTimes[0]);

  return (
    <Screen scroll contentStyle={styles.content}>
      <AppHeader
        title="Hello, Emma"
        subtitle="Your route updates are live"
        rightSlot={<View style={styles.avatar}><Text style={styles.avatarText}>EJ</Text></View>}
      />

      <AppCard style={styles.burgCard}>
        <Text style={styles.burgLabel}>Your BURG ID</Text>
        <View style={styles.burgRow}>
          <Text style={styles.burgId}>BURG-8823</Text>
          <Pressable onPress={() => showToast('BURG ID copied', 'success')}>
            <Ionicons name="copy" size={18} color={AppColors.card} />
          </Pressable>
        </View>
      </AppCard>

      <AppButton
        title="Scan bus QR to board"
        onPress={() => router.push('/passenger/scan')}
        icon={<Ionicons name="qr-code" size={20} color={AppColors.card} />}
      />

      <AppCard>
        <Text style={styles.sectionTitle}>Schedule Manager</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
          {passengerDays.map((day) => (
            <Pressable
              key={day}
              onPress={() => setSelectedDay(day)}
              style={[styles.dayChip, selectedDay === day && styles.dayChipActive]}>
              <Text style={[styles.dayText, selectedDay === day && styles.dayTextActive]}>{day}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.field}>
          <Text style={styles.label}>Pickup from home</Text>
          <View style={styles.selectWrap}>
            {passengerMorningTimes.map((time) => (
              <Pressable
                key={time}
                style={[styles.selectOption, morning === time && styles.selectActive]}
                onPress={() => setMorning(time)}>
                <Text style={[styles.selectText, morning === time && styles.selectTextActive]}>
                  {time}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Pickup from college</Text>
          <View style={styles.selectWrap}>
            {passengerAfternoonTimes.map((time) => (
              <Pressable
                key={time}
                style={[styles.selectOption, afternoon === time && styles.selectActive]}
                onPress={() => setAfternoon(time)}>
                <Text style={[styles.selectText, afternoon === time && styles.selectTextActive]}>
                  {time}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.note}>Pickup point is fixed by route.</Text>
        </View>

        <AppButton title="Save schedule" onPress={() => showToast('Schedule saved', 'success')} />
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
  dayChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: AppColors.surface,
    marginRight: 8,
  },
  dayChipActive: {
    backgroundColor: AppColors.teal,
  },
  dayText: {
    color: AppColors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  dayTextActive: {
    color: AppColors.card,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: AppColors.muted,
    marginBottom: 8,
  },
  selectWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.card,
  },
  selectActive: {
    borderColor: AppColors.teal,
    backgroundColor: AppColors.tealSoft,
  },
  selectText: {
    fontSize: 12,
    color: AppColors.text,
  },
  selectTextActive: {
    color: AppColors.teal,
    fontWeight: '600',
  },
  note: {
    fontSize: 11,
    color: AppColors.muted,
    marginTop: 6,
  },
});
