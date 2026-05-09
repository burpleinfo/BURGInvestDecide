import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, type ViewStyle } from 'react-native';

import { AppColors } from '@/constants/theme';

type SkeletonBlockProps = {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: ViewStyle;
};

export function SkeletonBlock({ width = '100%', height = 14, radius = 10, style }: SkeletonBlockProps) {
  const shimmerX = useRef(new Animated.Value(-220)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmerX, {
        toValue: 420,
        duration: 1300,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    loop.start();
    return () => loop.stop();
  }, [shimmerX]);

  const animatedStyle = useMemo(
    () => ({ transform: [{ translateX: shimmerX }] }),
    [shimmerX]
  );

  return (
    <View
      style={[
        styles.base,
        {
          width: width as ViewStyle['width'],
          height,
          borderRadius: radius,
        },
        style,
      ]}
    >
      <Animated.View pointerEvents="none" style={[styles.shimmer, animatedStyle]} />
    </View>
  );
}

export function SkeletonCard({ lines = 4 }: { lines?: number }) {
  return (
    <View style={styles.card}>
      <SkeletonBlock width="45%" height={16} />
      {Array.from({ length: lines }).map((_, idx) => (
        <SkeletonBlock key={idx} width={idx === lines - 1 ? '62%' : '100%'} height={12} />
      ))}
    </View>
  );
}

export function SkeletonScreen({ cards = 3 }: { cards?: number }) {
  return (
    <View style={styles.screenWrap}>
      <SkeletonBlock width="58%" height={28} radius={12} />
      <SkeletonBlock width="74%" height={14} radius={10} />
      {Array.from({ length: cards }).map((_, idx) => (
        <SkeletonCard key={idx} lines={3 + (idx % 2)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  shimmer: {
    width: 160,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  card: {
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 16,
    backgroundColor: AppColors.card,
    padding: 14,
    gap: 10,
  },
  screenWrap: {
    gap: 14,
    paddingTop: 12,
  },
});
