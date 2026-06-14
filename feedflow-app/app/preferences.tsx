import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT, TOPICS_LIKE, TOPICS_AVOID } from '../src/constants/theme';
import { useAppStore } from '../src/store/appStore';
import { preferencesService } from '../src/services/api';

const { width } = Dimensions.get('window');

export default function PreferencesScreen() {
  const [step, setStep] = useState<'like' | 'avoid'>('like');
  const [loading, setLoading] = useState(false);
  const { preferences, toggleLikedTopic, toggleAvoidedTopic, userId, setPreferences } = useAppStore();

  const handleNext = async () => {
    if (step === 'like') {
      if (preferences.likedTopics.length === 0) {
        Toast.show({ type: 'error', text1: 'Select at least 1 topic you like' });
        return;
      }
      setStep('avoid');
    } else {
      setLoading(true);
      try {
        if (userId) {
          await preferencesService.save(userId, preferences.likedTopics, preferences.avoidedTopics);
        }
        Toast.show({ type: 'success', text1: 'Preferences saved! 🎯' });
        setTimeout(() => router.replace('/connect'), 600);
      } catch (e) {
        // Still continue even if API fails
        setTimeout(() => router.replace('/connect'), 600);
      } finally {
        setLoading(false);
      }
    }
  };

  const topics = step === 'like' ? TOPICS_LIKE : TOPICS_AVOID;
  const selectedIds = step === 'like' ? preferences.likedTopics : preferences.avoidedTopics;
  const toggle = step === 'like' ? toggleLikedTopic : toggleAvoidedTopic;

  return (
    <View style={styles.container}>
      <View style={[styles.blob, styles.blob1]} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.stepRow}>
            <View style={[styles.stepDot, step === 'like' && styles.stepActive]}>
              <Text style={[styles.stepNum, step === 'like' && styles.stepNumActive]}>1</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={[styles.stepDot, step === 'avoid' && styles.stepActive]}>
              <Text style={[styles.stepNum, step === 'avoid' && styles.stepNumActive]}>2</Text>
            </View>
          </View>

          <Text style={styles.title}>
            {step === 'like' ? '✨ What do you\nlove seeing?' : '🚫 What do you\nwant less of?'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 'like'
              ? 'FeedFlow will push more of these topics to your Instagram feed.'
              : 'We\'ll work to reduce these from your recommendations.'}
          </Text>
        </View>

        {/* Topic Grid */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.grid}
        >
          {topics.map((topic) => {
            const selected = selectedIds.includes(topic.id);
            return (
              <TouchableOpacity
                key={topic.id}
                onPress={() => toggle(topic.id)}
                activeOpacity={0.75}
                style={styles.chipWrap}
              >
                <LinearGradient
                  colors={
                    selected
                      ? step === 'like'
                        ? [COLORS.primary, COLORS.primaryDark]
                        : [COLORS.error, '#B91C1C']
                      : [COLORS.bg3, COLORS.bg4]
                  }
                  style={[styles.chip, selected && styles.chipSelected]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.chipEmoji}>{topic.emoji}</Text>
                  <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                    {topic.label}
                  </Text>
                  {selected && (
                    <Ionicons
                      name={step === 'like' ? 'checkmark-circle' : 'close-circle'}
                      size={16}
                      color="#fff"
                      style={{ marginLeft: 4 }}
                    />
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Count badge */}
        <View style={styles.countBar}>
          <Text style={styles.countText}>
            {selectedIds.length} selected
            {step === 'like' && selectedIds.length > 0 && ' ✓'}
          </Text>
        </View>

        {/* CTA */}
        <View style={styles.bottom}>
          {step === 'avoid' && (
            <TouchableOpacity style={styles.skipBtn} onPress={() => router.replace('/connect')}>
              <Text style={styles.skipText}>Skip this step</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleNext} activeOpacity={0.85} disabled={loading}>
            <LinearGradient
              colors={
                step === 'like'
                  ? [COLORS.primary, COLORS.primaryDark]
                  : [COLORS.error, '#B91C1C']
              }
              style={styles.cta}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.ctaText}>
                  {step === 'like' ? 'Next: Reduce Topics →' : 'Save & Continue →'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg0 },
  blob: { position: 'absolute', borderRadius: 999, opacity: 0.08 },
  blob1: { width: 300, height: 300, backgroundColor: COLORS.primary, top: -60, right: -80 },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.md },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xl },
  stepDot: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.bg4, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  stepActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  stepNum: { color: COLORS.textMuted, fontSize: FONT.sizes.sm, fontWeight: FONT.weights.bold },
  stepNumActive: { color: '#fff' },
  stepLine: { flex: 1, height: 2, backgroundColor: COLORS.bg4, marginHorizontal: 8 },
  title: {
    fontSize: FONT.sizes.xxl, fontWeight: FONT.weights.extrabold,
    color: COLORS.textPrimary, lineHeight: 38, marginBottom: SPACING.sm, letterSpacing: -0.5,
  },
  subtitle: { fontSize: FONT.sizes.sm, color: COLORS.textSecondary, lineHeight: 20 },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg, gap: 10, paddingBottom: SPACING.lg,
  },
  chipWrap: {},
  chip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1, borderColor: COLORS.borderLight,
  },
  chipSelected: { borderColor: 'transparent' },
  chipEmoji: { fontSize: 16, marginRight: 6 },
  chipLabel: { fontSize: FONT.sizes.sm, color: COLORS.textSecondary, fontWeight: FONT.weights.medium },
  chipLabelSelected: { color: '#fff', fontWeight: FONT.weights.bold },
  countBar: { alignItems: 'center', paddingVertical: 10 },
  countText: { color: COLORS.textMuted, fontSize: FONT.sizes.sm },
  bottom: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl, gap: SPACING.sm },
  skipBtn: { alignItems: 'center', paddingVertical: 8 },
  skipText: { color: COLORS.textMuted, fontSize: FONT.sizes.sm },
  cta: {
    height: 58, borderRadius: RADIUS.lg,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 16, elevation: 12,
  },
  ctaText: { color: '#fff', fontSize: FONT.sizes.lg, fontWeight: FONT.weights.bold },
});
