import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { ParticleEffect } from '@/components/ParticleEffect';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete?: () => void;
  duration?: number;
}

export function SplashScreen({ onAnimationComplete, duration = 3000 }: SplashScreenProps) {
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoRotation = useSharedValue(0);
  const shimmerOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const containerOpacity = useSharedValue(1);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(logoScale.value, [0, 1], [0.3, 1], Extrapolate.CLAMP);
    const rotZ = interpolate(logoRotation.value, [0, 1], [-45, 0], Extrapolate.CLAMP);

    return {
      transform: [
        { scale },
        {
          rotateZ: `${rotZ}deg`,
        },
      ],
      opacity: logoOpacity.value,
    };
  });

  const shimmerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: shimmerOpacity.value,
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  useEffect(() => {
    // Sequence of animations similar to Netflix splash
    logoOpacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });

    logoScale.value = withSequence(
      withTiming(1.2, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      }),
      withTiming(1, {
        duration: 300,
        easing: Easing.inOut(Easing.cubic),
      })
    );

    logoRotation.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });

    // Shimmer effect (subtle glow pulse)
    shimmerOpacity.value = withSequence(
      withDelay(300, withTiming(0.6, { duration: 400 })),
      withDelay(200, withTiming(0.2, { duration: 600 })),
      withDelay(200, withTiming(0.6, { duration: 400 })),
      withDelay(200, withTiming(0.2, { duration: 600 }))
    );

    // Glow animation
    glowOpacity.value = withSequence(
      withDelay(600, withTiming(0.8, { duration: 500 })),
      withTiming(0.3, { duration: 500 }),
      withTiming(0.8, { duration: 600 }),
      withTiming(0.3, { duration: 600 })
    );

    // Fade out the entire splash screen at the end
    containerOpacity.value = withDelay(
      duration - 300,
      withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.quad),
      })
    );

    // Call completion handler
    const timer = setTimeout(() => {
      onAnimationComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />

      {/* Particle effects */}
      <ParticleEffect />

      {/* Glow effect behind logo */}
      <Animated.View style={[styles.glow, glowAnimatedStyle]} />

      {/* Shimmer/shine effect */}
      <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />

      {/* Main logo */}
      <Animated.Image
        source={require('@/assets/images/burglogo.jpg')}
        style={[
          styles.logo,
          logoAnimatedStyle,
        ]}
        resizeMode="contain"
      />

      {/* Pulse rings effect */}
      <PulseRing delay={400} />
      <PulseRing delay={600} />
      <PulseRing delay={800} />
    </Animated.View>
  );
}

interface PulseRingProps {
  delay: number;
}

function PulseRing({ delay }: PulseRingProps) {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0.8);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1.5, {
          duration: 1200,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(0.6, {
          duration: 0,
        })
      )
    );

    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(0, {
          duration: 1200,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(0.8, {
          duration: 0,
        })
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.pulseRing, animatedStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    zIndex: 9999,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    zIndex: 10,
  },
  glow: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    backgroundColor: '#1e90ff',
    zIndex: 5,
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
  },
  shimmer: {
    position: 'absolute',
    width: width * 0.55,
    height: width * 0.55,
    borderRadius: (width * 0.55) / 2,
    backgroundColor: 'rgba(30, 144, 255, 0.3)',
    zIndex: 8,
    blur: 40,
  },
  pulseRing: {
    position: 'absolute',
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: (width * 0.35) / 2,
    borderWidth: 2,
    borderColor: 'rgba(30, 144, 255, 0.5)',
    zIndex: 7,
  },
});
