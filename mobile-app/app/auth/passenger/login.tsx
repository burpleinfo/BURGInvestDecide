import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { useToast } from '@/components/common/Toast';
import { AppColors, Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

export default function PassengerLoginScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      showToast('Please enter your email and password.', 'error');
      return;
    }

    try {
      const authUser = await login(email, password);
      if (authUser.role !== 'passenger') {
        showToast('This account is not registered as a passenger.', 'error');
        return;
      }

      showToast('Welcome back, passenger!', 'success');
      router.replace('/passenger');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Login failed. Please try again.';
      showToast(errorMessage, 'error');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="person" size={28} color={AppColors.card} />
        </View>
        <Text style={styles.title}>Passenger Login</Text>
        <Text style={styles.subtitle}>Sign in to manage your ride.</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="emma@burg.com"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor={AppColors.muted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrap}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              style={[styles.input, styles.passwordInput]}
              placeholderTextColor={AppColors.muted}
            />
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={AppColors.muted}
              onPress={() => setShowPassword((prev) => !prev)}
            />
          </View>
        </View>

        <AppButton title={isLoading ? 'Signing in...' : 'Sign In'} onPress={handleSubmit} disabled={isLoading} />

        <Text style={styles.switchText}>
          Need an account?{' '}
          <Text style={styles.switchLink} onPress={() => router.push('/auth/passenger/signup')}>
            Sign up
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
  passwordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
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
