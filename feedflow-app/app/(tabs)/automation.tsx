import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Animated, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { COLORS, SPACING, RADIUS, FONT, TOPICS_LIKE } from '../../src/constants/theme';
import { useAppStore } from '../../src/store/appStore';
import { automationService } from '../../src/services/api';

const ACTION_TYPES = [
  { id: 'like', label: 'Like relevant posts', icon: 'heart', color: COLORS.error, desc: 'Hearts posts matching your topics' },
  { id: 'follow', label: 'Follow creators', icon: 'person-add', color: COLORS.primary, desc: 'Follows accounts in your niche' },
  { id: 'hashtag', label: 'Explore hashtags', icon: 'search', color: COLORS.accent, desc: 'Discovers content via hashtags' },
  { id: 'unfollow', label: 'Unfollow irrelevant', icon: 'person-remove', color: COLORS.warning, desc: 'Removes off-topic accounts' },
];

export default function AutomationScreen() {
  const { automation, automationRunning, setAutomationRunning, setAutomation, incrementActions, userId, preferences } = useAppStore();
  const [enabledActions, setEnabledActions] = useState<string[]>(['like', 'follow', 'hashtag']);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (automationRunning) {
      startRotation();
      startActionLoop();
    } else {
      rotateAnim.setValue(0);
      clearInterval(intervalRef.current);
      setCurrentAction(null);
    }
    return () => clearInterval(intervalRef.current);
  }, [automationRunning]);

  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 3000, useNativeDriver: true })
    ).start();
  };

  const buildLog = (topicId: string) => {
    const topic = TOPICS_LIKE.find((t) => t.id === topicId);
    const name = topic?.label || 'relevant';
    const actions = [
      `❤️ Liked a ${name} post`,
      `👤 Followed a ${name} creator`,
      `🔍 Searched #${name.replace(/ /g, '')}`,
      `📌 Saved a ${name} post`,
      `💬 Engaged with ${name} content`,
    ];
    return actions[Math.floor(Math.random() * actions.length)];
  };

  const startActionLoop = () => {
    const topics = preferences.likedTopics.length > 0 ? preferences.likedTopics : ['tech'];

    intervalRef.current = setInterval(async () => {
      const topic = topics[Math.floor(Math.random() * topics.length)];
      const action = enabledActions[Math.floor(Math.random() * enabledActions.length)];

      setCurrentAction(action);
      incrementActions();

      const logEntry = buildLog(topic);
      setLogs((prev) => [logEntry, ...prev.slice(0, 19)]);

      try {
        await automationService.runSession(userId || 'guest', {
          liked: preferences.likedTopics,
          avoided: preferences.avoidedTopics,
        });
      } catch (_) {}
    }, 6000);
  };

  const handleToggle = async () => {
    if (!automationRunning) {
      if (preferences.likedTopics.length === 0) {
        Alert.alert('No topics selected', 'Please set your preferences first from the Profile tab.');
        return;
      }
      setAutomationRunning(true);
      setAutomation({ isActive: true, sessionsRun: automation.sessionsRun + 1 });
      Toast.show({ type: 'success', text1: '🚀 Automation started!' });

      try {
        await automationService.start(userId || 'guest');
      } catch (_) {}
    } else {
      setAutomationRunning(false);
      setAutomation({ isActive: false, lastActivity: new Date().toISOString() });
      Toast.show({ type: 'info', text1: '⏸️ Automation paused' });

      try {
        await automationService.stop(userId || 'guest');
      } catch (_) {}
    }
  };

  const toggleAction = (id: string) => {
    setEnabledActions((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressPct = Math.min(100, (automation.todayActions / automation.dailyTarget) * 100);

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Automation</Text>
            <Text style={styles.sub}>Control how FeedFlow personalizes your feed</Text>
          </View>

          {/* Main Toggle */}
          <View style={styles.mainCard}>
            <LinearGradient
              colors={automationRunning
                ? [COLORS.primary + '30', COLORS.accent + '15']
                : [COLORS.bg3, COLORS.bg2]}
              style={styles.mainCardInner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Animated orb */}
              <Animated.View style={[styles.orbWrap, automationRunning && { transform: [{ rotate }] }]}>
                <LinearGradient
                  colors={automationRunning
                    ? [COLORS.primary, COLORS.accent]
                    : [COLORS.bg4, COLORS.bg3]}
                  style={styles.orb}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons
                    name={automationRunning ? 'flash' : 'flash-outline'}
                    size={40}
                    color={automationRunning ? '#fff' : COLORS.textMuted}
                  />
                </LinearGradient>
              </Animated.View>

              <Text style={[styles.engineStatus, automationRunning && styles.engineStatusActive]}>
                {automationRunning ? 'Engine Running' : 'Engine Stopped'}
              </Text>

              {automationRunning && currentAction && (
                <View style={styles.currentActionBadge}>
                  <Ionicons name="flash" size={12} color={COLORS.primary} />
                  <Text style={styles.currentActionText}>
                    Running: {ACTION_TYPES.find((a) => a.id === currentAction)?.label}
                  </Text>
                </View>
              )}

              <TouchableOpacity onPress={handleToggle} activeOpacity={0.85}>
                <LinearGradient
                  colors={automationRunning
                    ? [COLORS.error, '#B91C1C']
                    : [COLORS.primary, COLORS.primaryDark]}
                  style={styles.toggleBtn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons
                    name={automationRunning ? 'pause' : 'play'}
                    size={18}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.toggleBtnText}>
                    {automationRunning ? 'Pause Automation' : 'Start Automation'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Daily Progress */}
          <View style={styles.section}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>Daily Progress</Text>
              <Text style={styles.progressCount}>
                {automation.todayActions} / {automation.dailyTarget} actions
              </Text>
            </View>
            <View style={styles.progressBg}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.accent]}
                style={[styles.progressFill, { width: `${progressPct}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
          </View>

          {/* Action Types */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Action Types</Text>
            {ACTION_TYPES.map((action) => {
              const enabled = enabledActions.includes(action.id);
              return (
                <TouchableOpacity key={action.id} onPress={() => toggleAction(action.id)}>
                  <View style={[styles.actionRow, enabled && styles.actionRowActive]}>
                    <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                      <Ionicons name={action.icon as any} size={18} color={action.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.actionLabel}>{action.label}</Text>
                      <Text style={styles.actionDesc}>{action.desc}</Text>
                    </View>
                    <View style={[styles.checkBox, enabled && styles.checkBoxActive]}>
                      {enabled && <Ionicons name="checkmark" size={14} color="#fff" />}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* How it works */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            <View style={styles.howCard}>
              {[
                { step: '1', text: 'FeedFlow reads your selected topics', icon: 'list' },
                { step: '2', text: 'Finds relevant posts and creators', icon: 'search' },
                { step: '3', text: 'Engages with matching content', icon: 'heart' },
                { step: '4', text: 'Instagram learns your preferences', icon: 'trending-up' },
                { step: '5', text: 'Your feed becomes more relevant', icon: 'sparkles' },
              ].map((item, i) => (
                <View key={i} style={styles.howRow}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryDark]}
                    style={styles.howStep}
                  >
                    <Text style={styles.howStepText}>{item.step}</Text>
                  </LinearGradient>
                  <Ionicons name={item.icon as any} size={14} color={COLORS.textMuted} style={{ marginRight: 8 }} />
                  <Text style={styles.howText}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Live Logs */}
          {logs.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Live Activity Log</Text>
              <View style={styles.logCard}>
                {logs.map((log, i) => (
                  <Text key={i} style={[styles.logLine, i === 0 && styles.logLineNew]}>
                    {log}
                  </Text>
                ))}
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
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.md },
  title: { fontSize: FONT.sizes.xxl, fontWeight: FONT.weights.extrabold, color: COLORS.textPrimary },
  sub: { fontSize: FONT.sizes.sm, color: COLORS.textSecondary, marginTop: 4 },

  mainCard: { marginHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  mainCardInner: {
    borderRadius: RADIUS.xl, padding: SPACING.xl,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  orbWrap: { marginBottom: SPACING.lg },
  orb: {
    width: 100, height: 100, borderRadius: 30,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5, shadowRadius: 24, elevation: 20,
  },
  engineStatus: {
    fontSize: FONT.sizes.xl, fontWeight: FONT.weights.bold,
    color: COLORS.textMuted, marginBottom: SPACING.sm,
  },
  engineStatusActive: { color: COLORS.textPrimary },
  currentActionBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.primaryGlow, borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 6, marginBottom: SPACING.lg,
  },
  currentActionText: { fontSize: FONT.sizes.xs, color: COLORS.primary, fontWeight: FONT.weights.medium },
  toggleBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.xl, paddingVertical: 14,
    borderRadius: RADIUS.lg,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 10,
  },
  toggleBtnText: { color: '#fff', fontSize: FONT.sizes.md, fontWeight: FONT.weights.bold },

  section: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.xl },
  sectionTitle: { fontSize: FONT.sizes.md, fontWeight: FONT.weights.bold, color: COLORS.textSecondary, marginBottom: SPACING.md },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  progressCount: { fontSize: FONT.sizes.sm, color: COLORS.primary, fontWeight: FONT.weights.bold },
  progressBg: { height: 10, backgroundColor: COLORS.bg3, borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5, minWidth: 10 },

  actionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.bg2, borderRadius: RADIUS.md,
    padding: SPACING.md, marginBottom: 8,
    borderWidth: 1, borderColor: COLORS.borderLight,
  },
  actionRowActive: { borderColor: COLORS.primary + '40', backgroundColor: COLORS.primaryGlow },
  actionIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: FONT.sizes.sm, color: COLORS.textPrimary, fontWeight: FONT.weights.semibold },
  actionDesc: { fontSize: FONT.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  checkBox: {
    width: 24, height: 24, borderRadius: 7,
    borderWidth: 1.5, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkBoxActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },

  howCard: { backgroundColor: COLORS.bg2, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.borderLight },
  howRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8 },
  howStep: { width: 24, height: 24, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  howStepText: { color: '#fff', fontSize: 11, fontWeight: FONT.weights.bold },
  howText: { flex: 1, fontSize: FONT.sizes.sm, color: COLORS.textSecondary },

  logCard: { backgroundColor: COLORS.bg2, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.borderLight },
  logLine: { fontSize: FONT.sizes.xs, color: COLORS.textMuted, paddingVertical: 4, lineHeight: 18 },
  logLineNew: { color: COLORS.textSecondary },
});
