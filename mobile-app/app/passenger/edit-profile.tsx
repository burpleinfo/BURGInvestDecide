import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppHeader } from '@/components/common/AppHeader';
import { Screen } from '@/components/common/Screen';
import { useToast } from '@/components/common/Toast';
import { AppColors, Fonts } from '@/constants/theme';
import { usePassenger } from '@/contexts/PassengerContext';

export default function PassengerEditProfileScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { passenger, updatePassengerProfile, isLoading } = usePassenger();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    parentPhone: '',
    pickupStop: '',
    dropoffStop: '',
    busNumber: '',
  });

  useEffect(() => {
    setForm({
      name: passenger?.name || '',
      phone: passenger?.phone || '',
      email: passenger?.email || '',
      parentPhone: passenger?.parentPhone || '',
      pickupStop: passenger?.pickupStop || '',
      dropoffStop: passenger?.dropoffStop || '',
      busNumber: passenger?.busNumber || '',
    });
  }, [passenger]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updatePassengerProfile(passenger?.uid || passenger?.id || '', {
        ...form,
      });
      showToast('Passenger profile updated.', 'success');
      router.back();
    } catch {
      showToast('Unable to update passenger profile.', 'error');
    }
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      <AppHeader title="Edit Passenger Profile" subtitle="Update Firestore-backed profile data" />
      <AppCard>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput value={form.name} onChangeText={(value) => handleChange('name', value)} style={styles.input} placeholderTextColor={AppColors.muted} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Phone</Text>
            <TextInput value={form.phone} onChangeText={(value) => handleChange('phone', value)} style={styles.input} placeholderTextColor={AppColors.muted} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput value={form.email} editable={false} style={styles.input} placeholderTextColor={AppColors.muted} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Parent Phone</Text>
            <TextInput value={form.parentPhone} onChangeText={(value) => handleChange('parentPhone', value)} style={styles.input} placeholderTextColor={AppColors.muted} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Pickup Stop</Text>
            <TextInput value={form.pickupStop} onChangeText={(value) => handleChange('pickupStop', value)} style={styles.input} placeholderTextColor={AppColors.muted} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Dropoff Stop</Text>
            <TextInput value={form.dropoffStop} onChangeText={(value) => handleChange('dropoffStop', value)} style={styles.input} placeholderTextColor={AppColors.muted} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Bus Number</Text>
            <TextInput value={form.busNumber} onChangeText={(value) => handleChange('busNumber', value)} style={styles.input} placeholderTextColor={AppColors.muted} />
          </View>
          <AppButton title={isLoading ? 'Saving...' : 'Save Changes'} onPress={handleSubmit} disabled={isLoading} />
          <AppButton title="Cancel" variant="outline" onPress={() => router.back()} />
        </ScrollView>
      </AppCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 90,
    gap: 16,
  },
  form: {
    gap: 14,
  },
  field: {
    gap: 6,
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