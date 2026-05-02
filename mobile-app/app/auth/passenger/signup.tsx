import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { useToast } from '@/components/common/Toast';
import { AppColors, Fonts } from '@/constants/theme';

export default function PassengerSignupScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.email || !form.password) {
      showToast('Please complete all fields.', 'error');
      return;
    }
    showToast('Passenger account created.', 'success');
    router.replace('/passenger');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="person" size={26} color={AppColors.card} />
        </View>
        <Text style={styles.title}>Passenger Signup</Text>
        <Text style={styles.subtitle}>Create your BURG account.</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={form.name}
            onChangeText={(value) => handleChange('name', value)}
            placeholder="Emma Johnson"
            style={styles.input}
            placeholderTextColor={AppColors.muted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            value={form.phone}
            onChangeText={(value) => handleChange('phone', value)}
            placeholder="+1 555-0123"
            keyboardType="phone-pad"
            style={styles.input}
            placeholderTextColor={AppColors.muted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={form.email}
            onChangeText={(value) => handleChange('email', value)}
            placeholder="emma@burg.com"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor={AppColors.muted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={form.password}
            onChangeText={(value) => handleChange('password', value)}
            placeholder="Create a password"
            secureTextEntry
            style={styles.input}
            placeholderTextColor={AppColors.muted}
          />
        </View>

        <AppButton title="Create Account" onPress={handleSubmit} />

        <Text style={styles.switchText}>
          Already registered?{' '}
          <Text style={styles.switchLink} onPress={() => router.push('/auth/passenger/login')}>
            Sign in
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: AppColors.background,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: AppColors.card,
    padding: 24,
    borderRadius: 20,
    gap: 16,
    shadowColor: AppColors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: AppColors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    fontFamily: Fonts.rounded,
    fontSize: 22,
    fontWeight: '700',
    color: AppColors.text,
  },
  subtitle: {
    textAlign: 'center',
    color: AppColors.muted,
    fontSize: 13,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: AppColors.muted,
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: AppColors.text,
    backgroundColor: AppColors.surface,
  },
  switchText: {
    textAlign: 'center',
    color: AppColors.muted,
    fontSize: 13,
  },
  switchLink: {
    color: AppColors.teal,
    fontWeight: '600',
  },
});
