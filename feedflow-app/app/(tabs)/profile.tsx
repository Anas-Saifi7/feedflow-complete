import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { COLORS, SPACING, RADIUS, FONT, TOPICS_LIKE, TOPICS_AVOID } from '../../src/constants/theme';
import { useAppStore } from '../../src/store/appStore';
import { authService, instagramService } from '../../src/services/api';

function SettingRow({ icon, label, value, onPress, color, showArrow = true, rightComponent }: any) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} disabled={!onPress}>
      <View style={[styles.settingIcon, { backgroundColor: (color || COLORS.primary) + '20' }]}>
        <Ionicons name={icon} size={16} color={color || COLORS.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.settingLabel}>{label}</Text>
        {value && <Text style={styles.settingValue}>{value}</Text>}
      </View>
      {rightComponent || (showArrow && <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />)}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { name, email, instagram, preferences, automation, reset, setInstagram, userId } = useAppStore();
  const [notifs, setNotifs] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect Instagram',
      'This will stop all automation. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            try {
              await instagramService.disconnect(userId || 'guest');
            } catch (_) {}
            setInstagram({ username: '', connected: false, connectedAt: null, lastSync: null });
            Toast.show({ type: 'info', text1: 'Instagram disconnected' });
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await authService.logout();
          reset();
          router.replace('/onboarding');
        },
      },
    ]);
  };

  const likedCount = preferences.likedTopics.length;
  const avoidedCount = preferences.avoidedTopics.length;

  const connectedDate = instagram.connectedAt
    ? new Date(instagram.connectedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Not connected';

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDark]}
              style={styles.bigAvatar}
            >
              <Text style={styles.bigAvatarText}>{(name || 'U').charAt(0).toUpperCase()}</Text>
            </LinearGradient>
            <Text style={styles.profileName}>{name || 'Guest User'}</Text>
            <Text style={styles.profileEmail}>{email || 'No email'}</Text>

            <View style={styles.profileBadgeRow}>
              <View style={styles.profileBadge}>
                <Ionicons name="flash" size={12} color={COLORS.primary} />
                <Text style={styles.profileBadgeText}>{automation.actionsCompleted} actions</Text>
              </View>
              <View style={styles.profileBadge}>
                <Ionicons name="star" size={12} color={COLORS.warning} />
                <Text style={styles.profileBadgeText}>{automation.progressScore}% feed score</Text>
              </View>
            </View>
          </View>

          {/* Instagram section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instagram Account</Text>
            <View style={styles.card}>
              <SettingRow
                icon="logo-instagram"
                label={instagram.connected ? `@${instagram.username}` : 'Not Connected'}
                value={instagram.connected ? `Connected since ${connectedDate}` : 'Tap to connect your account'}
                color={COLORS.instagram}
                onPress={() => !instagram.connected && router.push('/connect')}
              />
              {instagram.connected && (
                <>
                  <View style={styles.divider} />
                  <SettingRow
                    icon="sync-outline"
                    label="Last Sync"
                    value={instagram.lastSync ? new Date(instagram.lastSync).toLocaleTimeString() : 'Never'}
                    color={COLORS.accent}
                    showArrow={false}
                  />
                  <View style={styles.divider} />
                  <SettingRow
                    icon="unlink"
                    label="Disconnect Account"
                    color={COLORS.error}
                    onPress={handleDisconnect}
                  />
                </>
              )}
            </View>
          </View>

          {/* Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Content Preferences</Text>
            <View style={styles.card}>
              <SettingRow
                icon="heart"
                label="Topics You Love"
                value={likedCount > 0 ? `${likedCount} selected` : 'None selected'}
                color={COLORS.error}
                onPress={() => router.push('/preferences')}
              />
              <View style={styles.divider} />
              <SettingRow
                icon="close-circle"
                label="Topics to Reduce"
                value={avoidedCount > 0 ? `${avoidedCount} selected` : 'None selected'}
                color={COLORS.warning}
                onPress={() => router.push('/preferences')}
              />
            </View>

            {/* Topic preview */}
            {likedCount > 0 && (
              <View style={styles.topicPreview}>
                {preferences.likedTopics.slice(0, 6).map((id) => {
                  const t = TOPICS_LIKE.find((x) => x.id === id);
                  return t ? (
                    <View key={id} style={styles.topicChip}>
                      <Text>{t.emoji}</Text>
                      <Text style={styles.topicChipText}>{t.label}</Text>
                    </View>
                  ) : null;
                })}
              </View>
            )}
          </View>

          {/* Automation settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Automation Settings</Text>
            <View style={styles.card}>
              <SettingRow
                icon="notifications-outline"
                label="Activity Notifications"
                color={COLORS.accent}
                showArrow={false}
                rightComponent={
                  <Switch
                    value={notifs}
                    onValueChange={setNotifs}
                    trackColor={{ false: COLORS.bg4, true: COLORS.primary }}
                    thumbColor="#fff"
                  />
                }
              />
              <View style={styles.divider} />
              <SettingRow
                icon="moon-outline"
                label="Dark Mode"
                color={COLORS.primary}
                showArrow={false}
                rightComponent={
                  <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    trackColor={{ false: COLORS.bg4, true: COLORS.primary }}
                    thumbColor="#fff"
                  />
                }
              />
              <View style={styles.divider} />
              <SettingRow
                icon="speedometer-outline"
                label="Daily Action Target"
                value={`${automation.dailyTarget} actions/day`}
                color={COLORS.success}
                showArrow={false}
              />
            </View>
          </View>

          {/* App info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App</Text>
            <View style={styles.card}>
              <SettingRow icon="shield-checkmark-outline" label="Privacy Policy" color={COLORS.textSecondary} />
              <View style={styles.divider} />
              <SettingRow icon="document-text-outline" label="Terms of Service" color={COLORS.textSecondary} />
              <View style={styles.divider} />
              <SettingRow
                icon="information-circle-outline"
                label="App Version"
                value="1.0.0"
                color={COLORS.textMuted}
                showArrow={false}
              />
            </View>
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color={COLORS.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>FeedFlow v1.0 · Made with 💜 for your feed</Text>

          <View style={{ height: SPACING.xxl }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg0 },

  profileCard: {
    alignItems: 'center', paddingTop: SPACING.xl, paddingBottom: SPACING.lg,
    borderBottomWidth: 1, borderBottomColor: COLORS.borderLight,
    marginBottom: SPACING.md,
  },
  bigAvatar: {
    width: 84, height: 84, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.md,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 16, elevation: 12,
  },
  bigAvatarText: { color: '#fff', fontSize: 36, fontWeight: FONT.weights.bold },
  profileName: { fontSize: FONT.sizes.xl, fontWeight: FONT.weights.extrabold, color: COLORS.textPrimary },
  profileEmail: { fontSize: FONT.sizes.sm, color: COLORS.textSecondary, marginTop: 4, marginBottom: SPACING.md },
  profileBadgeRow: { flexDirection: 'row', gap: 10 },
  profileBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.bg3, borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: COLORS.borderLight,
  },
  profileBadgeText: { fontSize: FONT.sizes.xs, color: COLORS.textSecondary, fontWeight: FONT.weights.medium },

  section: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  sectionTitle: { fontSize: FONT.sizes.sm, fontWeight: FONT.weights.bold, color: COLORS.textMuted, marginBottom: SPACING.sm, textTransform: 'uppercase', letterSpacing: 0.5 },

  card: {
    backgroundColor: COLORS.bg2, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.borderLight, overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: SPACING.md,
  },
  settingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { fontSize: FONT.sizes.sm, color: COLORS.textPrimary, fontWeight: FONT.weights.medium },
  settingValue: { fontSize: FONT.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.borderLight, marginLeft: 60 },

  topicPreview: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: SPACING.sm,
  },
  topicChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.bg3, borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: COLORS.border,
  },
  topicChipText: { fontSize: 11, color: COLORS.textSecondary },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginHorizontal: SPACING.lg, marginBottom: SPACING.md,
    backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: RADIUS.lg,
    padding: SPACING.md, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)',
  },
  logoutText: { color: COLORS.error, fontSize: FONT.sizes.md, fontWeight: FONT.weights.bold },

  footer: { textAlign: 'center', color: COLORS.textMuted, fontSize: FONT.sizes.xs, marginBottom: SPACING.sm },
});
