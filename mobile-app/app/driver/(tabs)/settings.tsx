import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppHeader } from '@/components/common/AppHeader';
import { Screen } from '@/components/common/Screen';
import { AppColors, Fonts } from '@/constants/theme';

export default function DriverSettingsScreen() {
  const router = useRouter();
  const [shareLocation, setShareLocation] = useState(true);
  const [notifications, setNotifications] = useState({
    routes: true,
    passenger: true,
    schedule: false,
  });

  return (
    <Screen scroll contentStyle={styles.content}>
      <AppHeader title="Settings" subtitle="Manage your preferences" />

      <AppCard>
        <Text style={styles.sectionTitle}>Live Location</Text>
        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>Share Live Location</Text>
            <Text style={styles.toggleHint}>Allow passengers to track your bus</Text>
          </View>
          <Switch
            value={shareLocation}
            onValueChange={setShareLocation}
            trackColor={{ true: AppColors.teal, false: '#CBD5F5' }}
          />
        </View>
      </AppCard>

      <AppCard>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>New route assignments</Text>
          <Switch
            value={notifications.routes}
            onValueChange={(value) => setNotifications((prev) => ({ ...prev, routes: value }))}
            trackColor={{ true: AppColors.teal, false: '#CBD5F5' }}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Passenger updates</Text>
          <Switch
            value={notifications.passenger}
            onValueChange={(value) => setNotifications((prev) => ({ ...prev, passenger: value }))}
            trackColor={{ true: AppColors.teal, false: '#CBD5F5' }}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Schedule changes</Text>
          <Switch
            value={notifications.schedule}
            onValueChange={(value) => setNotifications((prev) => ({ ...prev, schedule: value }))}
            trackColor={{ true: AppColors.teal, false: '#CBD5F5' }}
          />
        </View>
      </AppCard>

      <AppCard>
        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Driver Name</Text>
          <TextInput value="Mike Anderson" editable={false} style={styles.input} />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput value="+1-555-0199" editable={false} style={styles.input} />
        </View>
        <AppButton title="Change PIN" variant="outline" />
      </AppCard>

      <AppButton
        title="Logout"
        variant="outline"
        icon={<Ionicons name="log-out" size={18} color={AppColors.red} />}
        style={{ borderColor: AppColors.red }}
        textStyle={{ color: AppColors.red }}
        onPress={() => router.replace('/login')}
      />
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
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleLabel: {
    fontSize: 13,
    color: AppColors.text,
  },
  toggleHint: {
    fontSize: 11,
    color: AppColors.muted,
    marginTop: 2,
  },
  field: {
    gap: 6,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: AppColors.muted,
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: AppColors.text,
    backgroundColor: '#F8FAFC',
  },
});
