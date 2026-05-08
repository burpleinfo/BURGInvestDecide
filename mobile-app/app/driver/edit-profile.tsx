import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppHeader } from '@/components/common/AppHeader';
import { Screen } from '@/components/common/Screen';
import { useToast } from '@/components/common/Toast';
import { AppColors, Fonts } from '@/constants/theme';
import { useDriver } from '@/contexts/DriverContext';

export default function DriverEditProfileScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { driver, updateDriverProfile, isLoading } = useDriver();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    busNumber: '',
    busType: '',
    route: '',
    licenseNumber: '',
    licenseExpiry: '',
  });

  useEffect(() => {
    setForm({
      name: driver?.name || '',
      phone: driver?.phone || '',
      email: driver?.email || '',
      busNumber: driver?.busNumber || '',
      busType: driver?.busType || '',
      route: driver?.assignedRoute || driver?.route || '',
      licenseNumber: driver?.licenseNumber || '',
      licenseExpiry: driver?.licenseExpiry || '',
    });
  }, [driver]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateDriverProfile(driver?.uid || driver?.id || '', {
        ...form,
        assignedRoute: form.route,
        route: form.route,
      });
      showToast('Driver profile updated.', 'success');
      router.back();
    } catch {
      showToast('Unable to update driver profile.', 'error');
    }
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      <AppHeader title="Edit Driver Profile" subtitle="Update Firestore-backed profile data" />
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
            <Text style={styles.label}>Bus Number</Text>
            <TextInput value={form.busNumber} onChangeText={(value) => handleChange('busNumber', value)} style={styles.input} placeholderTextColor={AppColors.muted} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Bus Type</Text>
            <TextInput value={form.busType} onChangeText={(value) => handleChange('busType', value)} style={styles.input} placeholderTextColor={AppColors.muted} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Route</Text>
            <TextInput value={form.route} onChangeText={(value) => handleChange('route', value)} style={styles.input} placeholderTextColor={AppColors.muted} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>License Number</Text>
            <TextInput value={form.licenseNumber} onChangeText={(value) => handleChange('licenseNumber', value)} style={styles.input} placeholderTextColor={AppColors.muted} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>License Expiry</Text>
            <TextInput value={form.licenseExpiry} onChangeText={(value) => handleChange('licenseExpiry', value)} style={styles.input} placeholderTextColor={AppColors.muted} />
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