import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { AppColors, Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    if (user.role === 'driver') {
      router.replace('/driver');
      return;
    }

    if (user.role === 'passenger') {
      router.replace('/passenger');
      return;
    }

    router.replace('/driver');
  }, [router, user]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.card}>
        <Text style={styles.title}>BURG RideSafe</Text>
        <Text style={styles.subtitle}>Choose your role to continue</Text>

        <View style={styles.actions}>
          <AppButton
            title="Sign in as Driver"
            onPress={() => router.push('/auth/driver/login')}
            icon={<Ionicons name="bus" size={20} color={AppColors.card} />}
          />
          <AppButton
            title="Sign in as Passenger"
            variant="outline"
            onPress={() => router.push('/auth/passenger/login')}
            icon={<Ionicons name="person" size={20} color={AppColors.teal} />}
          />
        </View>

        <Text style={styles.support}>Need help? Contact support</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  card: {
    backgroundColor: AppColors.card,
    padding: 24,
    borderRadius: 20,
    gap: 10,
    shadowColor: AppColors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 26,
    fontWeight: '700',
    color: AppColors.teal,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: AppColors.muted,
  },
  actions: {
    marginTop: 14,
    gap: 12,
  },
  support: {
    marginTop: 8,
    textAlign: 'center',
    color: AppColors.muted,
    fontSize: 12,
  },
});
