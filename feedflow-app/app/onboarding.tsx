import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, FONT } from '../src/constants/theme';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'sparkles',
    title: 'Your Feed,\nYour Rules.',
    subtitle: 'Stop seeing content you don\'t care about. FeedFlow learns what you love and shapes your Instagram — automatically.',
    gradient: [COLORS.primaryDark, COLORS.primary],
  },
  {
    id: '2',
    icon: 'options',
    title: 'Pick What\nMatters.',
    subtitle: 'Select topics you want more of and content you want less of. FeedFlow does the heavy lifting from there.',
    gradient: [COLORS.bg2, COLORS.accent],
  },
  {
    id: '3',
    icon: 'logo-instagram',
    title: 'Connect\nInstagram.',
    subtitle: 'Securely link your Instagram account. FeedFlow works quietly in the background — no constant babysitting needed.',
    gradient: [COLORS.instagramGrad3, COLORS.instagram],
  },
  {
    id: '4',
    icon: 'trending-up',
    title: 'Watch It\nImprove.',
    subtitle: 'Track actions, sessions, and personalization progress. Your feed gets better every single day.',
    gradient: [COLORS.bg2, COLORS.success],
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
      const next = currentIndex + 1;
      setCurrentIndex(next);
      flatRef.current?.scrollToIndex({ index: next });
    } else {
      router.push('/auth');
    }
  };

  const skip = () => router.push('/auth');

  const slide = SLIDES[currentIndex];

  return (
    <View style={styles.container}>
      {/* Background gradient blobs */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <SafeAreaView style={styles.safe}>
        {/* Skip */}
        {currentIndex < SLIDES.length - 1 && (
          <TouchableOpacity style={styles.skipBtn} onPress={skip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Icon orb */}
          <LinearGradient
            colors={slide.gradient as [string, string]}
            style={styles.iconOrb}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name={slide.icon as any} size={52} color="#fff" />
          </LinearGradient>

          {/* Text */}
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.subtitle}>{slide.subtitle}</Text>
        </Animated.View>

        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity onPress={goNext} activeOpacity={0.85}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={styles.cta}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.ctaText}>
              {currentIndex === SLIDES.length - 1 ? 'Get Started →' : 'Continue →'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: SPACING.xl }} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg0,
  },
  safe: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.12,
  },
  blob1: {
    width: 300,
    height: 300,
    backgroundColor: COLORS.primary,
    top: -80,
    left: -80,
  },
  blob2: {
    width: 250,
    height: 250,
    backgroundColor: COLORS.accent,
    bottom: -60,
    right: -60,
  },
  skipBtn: {
    alignSelf: 'flex-end',
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  skipText: {
    color: COLORS.textSecondary,
    fontSize: FONT.sizes.md,
    fontWeight: FONT.weights.medium,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
  },
  iconOrb: {
    width: 120,
    height: 120,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 20,
  },
  title: {
    fontSize: FONT.sizes.hero,
    fontWeight: FONT.weights.extrabold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 50,
    marginBottom: SPACING.lg,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: FONT.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.bg4,
  },
  dotActive: {
    width: 28,
    backgroundColor: COLORS.primary,
  },
  cta: {
    width: width - SPACING.lg * 2,
    height: 58,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
  },
  ctaText: {
    color: '#fff',
    fontSize: FONT.sizes.lg,
    fontWeight: FONT.weights.bold,
    letterSpacing: 0.3,
  },
});
