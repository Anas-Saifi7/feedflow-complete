import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONT, TOPICS_LIKE } from '../../src/constants/theme';
import { useAppStore } from '../../src/store/appStore';

const { width } = Dimensions.get('window');

function StatCard({ label, value, icon, color, sub }: any) {
  return (
    <View style={[styles.statCard, { borderColor: color + '30' }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {sub && <Text style={styles.statSub}>{sub}</Text>}
    </View>
  );
}

export default function DashboardScreen() {
  const { name, instagram, preferences, automation, automationRunning, setAutomationRunning, incrementActions } = useAppStore();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (automationRunning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();

      // Simulate automation actions
      const interval = setInterval(() => {
        incrementActions();
      }, 8000);
      return () => clearInterval(interval);
    } else {
      pulseAnim.setValue(1);
    }
  }, [automationRunning]);

  const likedLabels = preferences.likedTopics
    .map((id) => TOPICS_LIKE.find((t) => t.id === id))
    .filter(Boolean)
    .slice(0, 4);

  const timeAgo = (iso: string | null) => {
    if (!iso) return 'Never';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                Hey {name || 'there'} 👋
              </Text>
              <Text style={styles.headerSub}>Your feed is getting smarter</Text>
            </View>
            <TouchableOpacity
              style={styles.avatarBtn}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {(name || 'U').charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Instagram Status Card */}
          <View style={styles.igCard}>
            <LinearGradient
              colors={['rgba(168,85,247,0.12)', 'rgba(6,182,212,0.08)']}
              style={styles.igCardInner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.igRow}>
                <View style={styles.igLeft}>
                  <LinearGradient
                    colors={[COLORS.instagramGrad1, COLORS.instagram, COLORS.instagramGrad3]}
                    style={styles.igSmallIcon}
                  >
                    <Ionicons name="logo-instagram" size={16} color="#fff" />
                  </LinearGradient>
                  <View>
                    <Text style={styles.igUsername}>
                      @{instagram.username || 'not connected'}
                    </Text>
                    <Text style={styles.igSync}>
                      Last sync: {timeAgo(instagram.lastSync)}
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: instagram.connected ? COLORS.successGlow : 'rgba(239,68,68,0.15)' }
                ]}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: instagram.connected ? COLORS.success : COLORS.error }
                  ]} />
                  <Text style={[
                    styles.statusText,
                    { color: instagram.connected ? COLORS.success : COLORS.error }
                  ]}>
                    {instagram.connected ? 'Connected' : 'Disconnected'}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Automation Toggle */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personalization Engine</Text>

            <TouchableOpacity
              onPress={() => setAutomationRunning(!automationRunning)}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={
                  automationRunning
                    ? [COLORS.primary, COLORS.primaryDark]
                    : [COLORS.bg3, COLORS.bg4]
                }
                style={styles.automationCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.autoLeft}>
                  <Animated.View style={[styles.autoOrb, { transform: [{ scale: pulseAnim }] }]}>
                    <Ionicons
                      name={automationRunning ? 'flash' : 'flash-outline'}
                      size={28}
                      color={automationRunning ? '#fff' : COLORS.textMuted}
                    />
                  </Animated.View>
                  <View>
                    <Text style={[styles.autoTitle, automationRunning && styles.autoTitleActive]}>
                      {automationRunning ? 'Active — Working...' : 'Tap to Activate'}
                    </Text>
                    <Text style={[styles.autoSub, automationRunning && styles.autoSubActive]}>
                      {automationRunning
                        ? `${automation.todayActions} actions today`
                        : 'Start personalizing your feed'}
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.togglePill,
                  automationRunning && styles.togglePillActive
                ]}>
                  <View style={[styles.toggleThumb, automationRunning && styles.toggleThumbActive]} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsGrid}>
              <StatCard
                label="Total Actions"
                value={automation.actionsCompleted}
                icon="checkmark-circle"
                color={COLORS.success}
              />
              <StatCard
                label="Sessions Run"
                value={automation.sessionsRun}
                icon="repeat"
                color={COLORS.accent}
              />
              <StatCard
                label="Feed Score"
                value={`${automation.progressScore}%`}
                icon="trending-up"
                color={COLORS.primary}
                sub="personalized"
              />
              <StatCard
                label="Today"
                value={automation.todayActions}
                icon="today"
                color={COLORS.warning}
                sub={`of ${automation.dailyTarget} target`}
              />
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.section}>
            <View style={styles.progressHeader}>
              <Text style={styles.sectionTitle}>Personalization Progress</Text>
              <Text style={styles.progressPct}>{automation.progressScore}%</Text>
            </View>
            <View style={styles.progressBg}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.accent]}
                style={[styles.progressFill, { width: `${automation.progressScore}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
            <Text style={styles.progressNote}>
              {automation.progressScore < 20
                ? '🌱 Just getting started — keep running sessions!'
                : automation.progressScore < 50
                ? '📈 Good progress — your feed is improving'
                : automation.progressScore < 80
                ? '🚀 Great job — feed is becoming highly relevant'
                : '⭐ Excellent — your feed is finely tuned!'}
            </Text>
          </View>

          {/* Topics */}
          {likedLabels.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Targeting Topics</Text>
              <View style={styles.chipRow}>
                {likedLabels.map((t) => t && (
                  <View key={t.id} style={styles.topicChip}>
                    <Text>{t.emoji}</Text>
                    <Text style={styles.topicChipText}>{t.label}</Text>
                  </View>
                ))}
                {preferences.likedTopics.length > 4 && (
                  <View style={styles.topicChipMore}>
                    <Text style={styles.topicChipMoreText}>+{preferences.likedTopics.length - 4} more</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          <View style={{ height: SPACING.xxl }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg0 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.sm,
  },
  greeting: { fontSize: FONT.sizes.xl, fontWeight: FONT.weights.extrabold, color: COLORS.textPrimary },
  headerSub: { fontSize: FONT.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },
  avatarBtn: { padding: 2 },
  avatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: FONT.sizes.lg, fontWeight: FONT.weights.bold },

  igCard: { marginHorizontal: SPACING.lg, marginTop: SPACING.md, borderRadius: RADIUS.lg, overflow: 'hidden' },
  igCardInner: { padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.lg },
  igRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  igLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  igSmallIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  igUsername: { fontSize: FONT.sizes.md, fontWeight: FONT.weights.semibold, color: COLORS.textPrimary },
  igSync: { fontSize: FONT.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.full,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: FONT.sizes.xs, fontWeight: FONT.weights.bold },

  section: { paddingHorizontal: SPACING.lg, marginTop: SPACING.xl },
  sectionTitle: { fontSize: FONT.sizes.md, fontWeight: FONT.weights.bold, color: COLORS.textSecondary, marginBottom: SPACING.md },

  automationCard: {
    borderRadius: RADIUS.lg, padding: SPACING.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: COLORS.border,
  },
  autoLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  autoOrb: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  autoTitle: { fontSize: FONT.sizes.md, fontWeight: FONT.weights.bold, color: COLORS.textSecondary },
  autoTitleActive: { color: '#fff' },
  autoSub: { fontSize: FONT.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  autoSubActive: { color: 'rgba(255,255,255,0.7)' },
  togglePill: {
    width: 50, height: 28, borderRadius: 14,
    backgroundColor: COLORS.bg4, justifyContent: 'center', paddingHorizontal: 3,
  },
  togglePillActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  toggleThumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.textMuted },
  toggleThumbActive: { backgroundColor: '#fff', alignSelf: 'flex-end' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    width: (width - SPACING.lg * 2 - 12) / 2,
    backgroundColor: COLORS.bg2, borderRadius: RADIUS.md,
    padding: SPACING.md, borderWidth: 1,
  },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontSize: FONT.sizes.xl, fontWeight: FONT.weights.extrabold, color: COLORS.textPrimary },
  statLabel: { fontSize: FONT.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  statSub: { fontSize: 10, color: COLORS.textMuted, marginTop: 1 },

  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressPct: { fontSize: FONT.sizes.lg, fontWeight: FONT.weights.bold, color: COLORS.primary },
  progressBg: { height: 10, backgroundColor: COLORS.bg3, borderRadius: 5, overflow: 'hidden', marginBottom: SPACING.sm },
  progressFill: { height: '100%', borderRadius: 5, minWidth: 10 },
  progressNote: { fontSize: FONT.sizes.xs, color: COLORS.textSecondary, lineHeight: 18 },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  topicChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.bg3, borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: COLORS.border,
  },
  topicChipText: { fontSize: FONT.sizes.xs, color: COLORS.textSecondary, fontWeight: FONT.weights.medium },
  topicChipMore: {
    backgroundColor: COLORS.primaryGlow, borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 7,
  },
  topicChipMoreText: { fontSize: FONT.sizes.xs, color: COLORS.primary, fontWeight: FONT.weights.bold },
});
