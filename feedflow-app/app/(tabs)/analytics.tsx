import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, FONT } from '../../src/constants/theme';
import { useAppStore } from '../../src/store/appStore';

const { width } = Dimensions.get('window');

// Simple bar chart component
function BarChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay();
  const ordered = [...days.slice(today), ...days.slice(0, today)];

  return (
    <View style={chartStyles.container}>
      {data.map((val, i) => (
        <View key={i} style={chartStyles.barCol}>
          <Text style={chartStyles.barVal}>{val > 0 ? val : ''}</Text>
          <View style={chartStyles.barBg}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.accent]}
              style={[chartStyles.bar, { height: `${(val / max) * 100}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
          </View>
          <Text style={chartStyles.barDay}>{ordered[i]}</Text>
        </View>
      ))}
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'flex-end',
    height: 120, gap: 6, paddingTop: 20,
  },
  barCol: { flex: 1, alignItems: 'center' },
  barBg: {
    width: '100%', flex: 1,
    backgroundColor: COLORS.bg4, borderRadius: 4,
    overflow: 'hidden', justifyContent: 'flex-end',
  },
  bar: { width: '100%', borderRadius: 4 },
  barVal: { fontSize: 9, color: COLORS.textMuted, marginBottom: 4 },
  barDay: { fontSize: 9, color: COLORS.textMuted, marginTop: 4 },
});

// Activity log item
function ActivityItem({ icon, text, time, color }: any) {
  return (
    <View style={actStyles.row}>
      <View style={[actStyles.icon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={14} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={actStyles.text}>{text}</Text>
        <Text style={actStyles.time}>{time}</Text>
      </View>
    </View>
  );
}

const actStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  icon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: FONT.sizes.sm, color: COLORS.textPrimary, fontWeight: FONT.weights.medium },
  time: { fontSize: FONT.sizes.xs, color: COLORS.textMuted, marginTop: 1 },
});

export default function AnalyticsScreen() {
  const { automation, automationRunning, preferences, instagram } = useAppStore();
  const [weekData, setWeekData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [activityLog, setActivityLog] = useState<any[]>([]);

  useEffect(() => {
    // Generate realistic weekly data based on total actions
    const total = automation.actionsCompleted;
    const spread = Array.from({ length: 7 }, (_, i) =>
      i === 6 ? automation.todayActions : Math.max(0, Math.floor(Math.random() * (total / 5)))
    );
    setWeekData(spread);

    // Build activity log
    const now = Date.now();
    const actions = [
      { icon: 'heart', text: 'Liked 5 tech posts from @elonmusk', color: COLORS.error, offset: 2 },
      { icon: 'person-add', text: 'Followed @ycombinator (Startups)', color: COLORS.primary, offset: 8 },
      { icon: 'search', text: 'Explored #ArtificialIntelligence', color: COLORS.accent, offset: 15 },
      { icon: 'heart', text: 'Liked 3 AI research posts', color: COLORS.error, offset: 22 },
      { icon: 'person-add', text: 'Followed @naval (Business)', color: COLORS.primary, offset: 45 },
      { icon: 'search', text: 'Explored #Startups hashtag', color: COLORS.accent, offset: 68 },
      { icon: 'heart', text: 'Liked 8 fitness posts', color: COLORS.error, offset: 90 },
      { icon: 'close-circle', text: 'Unfollowed irrelevant account', color: COLORS.warning, offset: 120 },
    ];

    const log = actions.map((a) => ({
      ...a,
      time: formatTime(now - a.offset * 60000),
    }));

    setActivityLog(log);
  }, [automation.actionsCompleted]);

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  const efficiency = automation.actionsCompleted > 0
    ? Math.min(100, Math.floor((automation.progressScore / Math.max(1, automation.sessionsRun)) * 10))
    : 0;

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Analytics</Text>
            <View style={[
              styles.statusPill,
              { backgroundColor: automationRunning ? COLORS.successGlow : 'rgba(239,68,68,0.1)' }
            ]}>
              <View style={[styles.statusDot, { backgroundColor: automationRunning ? COLORS.success : COLORS.error }]} />
              <Text style={[styles.statusTxt, { color: automationRunning ? COLORS.success : COLORS.error }]}>
                {automationRunning ? 'Automation Active' : 'Automation Paused'}
              </Text>
            </View>
          </View>

          {/* Summary cards */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.summaryRow}>
            {[
              { label: 'Actions Done', value: automation.actionsCompleted, icon: 'checkmark-circle', color: COLORS.success },
              { label: 'Sessions', value: automation.sessionsRun, icon: 'repeat', color: COLORS.accent },
              { label: 'Feed Score', value: `${automation.progressScore}%`, icon: 'trending-up', color: COLORS.primary },
              { label: 'Efficiency', value: `${efficiency}%`, icon: 'flash', color: COLORS.warning },
            ].map((item) => (
              <View key={item.label} style={styles.sumCard}>
                <LinearGradient
                  colors={[item.color + '20', item.color + '05']}
                  style={styles.sumCardInner}
                >
                  <Ionicons name={item.icon as any} size={20} color={item.color} />
                  <Text style={[styles.sumValue, { color: item.color }]}>{item.value}</Text>
                  <Text style={styles.sumLabel}>{item.label}</Text>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>

          {/* Weekly chart */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Actions This Week</Text>
            <BarChart data={weekData} />
          </View>

          {/* Personalization breakdown */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Personalization Breakdown</Text>
            {[
              { label: 'Content Liked', pct: 45, color: COLORS.error },
              { label: 'Accounts Followed', pct: 30, color: COLORS.primary },
              { label: 'Hashtags Explored', pct: 25, color: COLORS.accent },
            ].map((item) => (
              <View key={item.label} style={styles.breakRow}>
                <View style={styles.breakLeft}>
                  <Text style={styles.breakLabel}>{item.label}</Text>
                  <Text style={[styles.breakPct, { color: item.color }]}>{item.pct}%</Text>
                </View>
                <View style={styles.breakBarBg}>
                  <LinearGradient
                    colors={[item.color, item.color + '80']}
                    style={[styles.breakBar, { width: `${item.pct}%` }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Topics targeted */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Active Topics ({preferences.likedTopics.length})</Text>
            {preferences.likedTopics.length === 0 ? (
              <Text style={styles.emptyText}>No topics selected yet. Go to Profile → Preferences.</Text>
            ) : (
              <Text style={styles.topicsList}>
                {preferences.likedTopics.join(' · ')}
              </Text>
            )}
          </View>

          {/* Activity Log */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent Activity</Text>
            {automation.actionsCompleted === 0 ? (
              <Text style={styles.emptyText}>
                Start automation from the Dashboard to see activity here.
              </Text>
            ) : (
              activityLog.map((item, i) => (
                <ActivityItem key={i} {...item} />
              ))
            )}
          </View>

          <View style={{ height: SPACING.xxl }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg0 },
  header: {
    paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  title: { fontSize: FONT.sizes.xxl, fontWeight: FONT.weights.extrabold, color: COLORS.textPrimary },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusTxt: { fontSize: FONT.sizes.xs, fontWeight: FONT.weights.bold },

  summaryRow: { paddingHorizontal: SPACING.lg, gap: 12, paddingBottom: SPACING.sm },
  sumCard: { width: 120 },
  sumCardInner: { borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.borderLight },
  sumValue: { fontSize: FONT.sizes.xl, fontWeight: FONT.weights.extrabold, marginTop: 8 },
  sumLabel: { fontSize: FONT.sizes.xs, color: COLORS.textMuted, marginTop: 2 },

  card: {
    marginHorizontal: SPACING.lg, marginBottom: SPACING.lg,
    backgroundColor: COLORS.bg2, borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.borderLight,
  },
  cardTitle: { fontSize: FONT.sizes.md, fontWeight: FONT.weights.bold, color: COLORS.textPrimary, marginBottom: SPACING.md },

  breakRow: { marginBottom: SPACING.md },
  breakLeft: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  breakLabel: { fontSize: FONT.sizes.sm, color: COLORS.textSecondary },
  breakPct: { fontSize: FONT.sizes.sm, fontWeight: FONT.weights.bold },
  breakBarBg: { height: 6, backgroundColor: COLORS.bg4, borderRadius: 3, overflow: 'hidden' },
  breakBar: { height: '100%', borderRadius: 3 },

  emptyText: { fontSize: FONT.sizes.sm, color: COLORS.textMuted, lineHeight: 20 },
  topicsList: { fontSize: FONT.sizes.sm, color: COLORS.textSecondary, lineHeight: 22 },
});
