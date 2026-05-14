import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AppColors, Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

export default function SplashScreen() {
  const router = useRouter();
  const { user, isReady } = useAuth();
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();

    if (!isReady) {
      return;
    }

    const nextRoute = user
      ? user.role === 'driver'
        ? '/driver'
        : '/passenger'
      : '/login';

    const timer = setTimeout(() => {
      router.replace(nextRoute);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isReady, opacity, router, scale, user]);

  return (
    <View style={styles.container}>
      <View style={styles.gradientTop} />
      <View style={styles.gradientBottom} />
      <Animated.View style={[styles.center, { opacity, transform: [{ scale }] }]}
      >
        <View style={styles.iconWrap}>
          <Ionicons name="bus" size={64} color={AppColors.teal} />
        </View>
        <Text style={styles.brand}>BURG RideSafe</Text>
        <View style={styles.dotsRow}>
          {[0, 1, 2].map((dot) => (
            <AnimatedDot key={dot} delay={dot * 180} />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

function AnimatedDot({ delay }: { delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: -8,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();

    return () => loop.stop();
  }, [anim, delay]);

  return <Animated.View style={[styles.dot, { transform: [{ translateY: anim }] }]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  gradientTop: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 220,
    height: 220,
    backgroundColor: AppColors.tealSoft,
    borderRadius: 120,
    opacity: 0.9,
  },
  gradientBottom: {
    position: 'absolute',
    bottom: -120,
    left: -60,
    width: 240,
    height: 240,
    backgroundColor: AppColors.surface,
    borderRadius: 120,
  },
  center: {
    alignItems: 'center',
    gap: 16,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: AppColors.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AppColors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  brand: {
    fontFamily: Fonts.rounded,
    fontSize: 22,
    fontWeight: '700',
    color: AppColors.text,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AppColors.teal,
  },
});
