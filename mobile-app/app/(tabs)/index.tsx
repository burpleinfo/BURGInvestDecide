import { Image } from 'expo-image';
import { Pressable, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const tint = useThemeColor({}, 'tint');
  const background = useThemeColor({}, 'background');

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: Colors.light.tint, dark: Colors.dark.background }}
      headerImage={
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.headerIcon}
        />
      }>
      <ThemedView style={styles.hero}>
        <ThemedText type="title" style={styles.brandTitle}>
          BURG RideSafe
        </ThemedText>
        <ThemedText style={styles.subhead}>
          Safer rides, smarter routing, and real-time peace of mind — built for drivers and riders.
        </ThemedText>

        <ThemedView style={styles.ctaRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/explore')}
            style={[styles.primaryButton, { backgroundColor: tint }]}>
            <ThemedText style={[styles.primaryButtonText, { color: background }]}>Explore</ThemedText>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/modal')}
            style={[styles.secondaryButton, { borderColor: tint }]}>
            <ThemedText style={[styles.secondaryButtonText, { color: tint }]}>Learn more</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    height: 150,
    width: 150,
    position: 'absolute',
    bottom: 18,
    left: 24,
  },
  hero: {
    gap: 12,
  },
  brandTitle: {
    fontFamily: Fonts.rounded,
  },
  subhead: {
    opacity: 0.9,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexGrow: 1,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexGrow: 1,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
