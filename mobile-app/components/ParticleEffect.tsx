import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

/**
 * Advanced splash screen component with multiple animated particles
 * Creates a premium Netflix/YouTube-like entry experience
 */
export function ParticleEffect() {
  const particles = Array.from({ length: 8 }).map((_, i) => (
    <Particle key={i} index={i} />
  ));

  return <View style={styles.container}>{particles}</View>;
}

interface ParticleProps {
  index: number;
}

function Particle({ index }: ParticleProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const angle = (index / 8) * Math.PI * 2;
  const distance = width * 0.25;
  const finalX = Math.cos(angle) * distance;
  const finalY = Math.sin(angle) * distance;

  React.useEffect(() => {
    opacity.value = withSequence(
      withDelay(
        600 + index * 100,
        withTiming(0.6, {
          duration: 400,
          easing: Easing.out(Easing.cubic),
        })
      ),
      withDelay(800, withTiming(0, { duration: 400 }))
    );

    scale.value = withSequence(
      withDelay(
        600 + index * 100,
        withTiming(1, {
          duration: 400,
          easing: Easing.out(Easing.cubic),
        })
      ),
      withDelay(800, withTiming(0, { duration: 400 }))
    );

    translateX.value = withSequence(
      withDelay(600 + index * 100, withTiming(finalX, { duration: 800 })),
      withTiming(0, { duration: 0 })
    );

    translateY.value = withSequence(
      withDelay(600 + index * 100, withTiming(finalY, { duration: 800 })),
      withTiming(0, { duration: 0 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1e90ff',
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
});
