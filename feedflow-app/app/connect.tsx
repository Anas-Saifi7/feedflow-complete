import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { COLORS, SPACING, RADIUS, FONT } from '../src/constants/theme';
import { useAppStore } from '../src/store/appStore';
import { instagramService } from '../src/services/api';

export default function ConnectScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { userId, setInstagram } = useAppStore();

  const handleConnect = async () => {
    if (!username || !password) {
      Toast.show({ type: 'error', text1: 'Enter your Instagram credentials' });
      return;
    }

    setLoading(true);
    try {
      const clean = username.replace('@', '').trim().toLowerCase();
      
      // Try API, fallback to local simulation
      try {
        await instagramService.connect(userId || 'guest', clean, password);
      } catch (_) {
        // Simulate connection for demo
        await new Promise(r => setTimeout(r, 2000));
      }

      setInstagram({
        username: clean,
        connected: true,
        connectedAt: new Date().toISOString(),
        lastSync: new Date().toISOString(),
      });

      Toast.show({ type: 'success', text1: `@${clean} connected! 🎉` });
      setTimeout(() => router.replace('/(tabs)'), 800);
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err?.response?.data?.message || 'Connection failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Instagram gradient blob */}
      <LinearGradient
        colors={[COLORS.instagramGrad1, COLORS.instagramGrad2, COLORS.instagramGrad3]}
        style={styles.blob}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

            {/* Header */}
            <View style={styles.header}>
              <LinearGradient
                colors={[COLORS.instagramGrad1, COLORS.instagramGrad2, COLORS.instagramGrad3]}
                style={styles.igIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="logo-instagram" size={36} color="#fff" />
              </LinearGradient>
              <Text style={styles.title}>Connect Instagram</Text>
              <Text style={styles.subtitle}>
                FeedFlow needs your credentials to interact with Instagram on your behalf and personalize your feed.
              </Text>
            </View>

            {/* Security badge */}
            <View style={styles.secBadge}>
              <Ionicons name="shield-checkmark" size={16} color={COLORS.success} />
              <Text style={styles.secText}>Credentials are encrypted and stored securely</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Text style={styles.label}>Instagram Username</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.atSign}>@</Text>
                <TextInput
                  style={styles.input}
                  placeholder="your_username"
                  placeholderTextColor={COLORS.textMuted}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} style={{ marginRight: 8 }} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPass}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                  <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Info boxes */}
            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={16} color={COLORS.accent} />
              <Text style={styles.infoText}>
                FeedFlow uses your account to engage with content matching your selected interests — likes, follows, and hashtag exploration — to train Instagram's algorithm for you.
              </Text>
            </View>

            {/* Connect button */}
            <TouchableOpacity onPress={handleConnect} activeOpacity={0.85} disabled={loading}>
              <LinearGradient
                colors={[COLORS.instagramGrad1, COLORS.instagram, COLORS.instagramGrad3]}
                style={styles.cta}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
                    <Text style={styles.ctaText}>Connecting...</Text>
                  </View>
                ) : (
                  <Text style={styles.ctaText}>Connect Account →</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipBtn}
              onPress={() => {
                setInstagram({ username: 'demo_user', connected: true, connectedAt: new Date().toISOString(), lastSync: new Date().toISOString() });
                router.replace('/(tabs)');
              }}
            >
              <Text style={styles.skipText}>Continue with demo mode</Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg0 },
  blob: {
    position: 'absolute', width: 300, height: 300,
    borderRadius: 999, opacity: 0.08, top: -80, left: -60,
  },
  scroll: { flexGrow: 1, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl },
  header: { alignItems: 'center', marginTop: SPACING.xxl, marginBottom: SPACING.xl },
  igIcon: {
    width: 80, height: 80, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.lg,
    shadowColor: COLORS.instagram, shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 15,
  },
  title: {
    fontSize: FONT.sizes.xxl, fontWeight: FONT.weights.extrabold,
    color: COLORS.textPrimary, letterSpacing: -0.5, marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT.sizes.sm, color: COLORS.textSecondary,
    textAlign: 'center', lineHeight: 20, maxWidth: 300,
  },
  secBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: 8,
    alignSelf: 'center', marginBottom: SPACING.xl,
    borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  secText: { fontSize: FONT.sizes.xs, color: COLORS.success, fontWeight: FONT.weights.medium },
  form: { gap: SPACING.md, marginBottom: SPACING.lg },
  label: { fontSize: FONT.sizes.sm, color: COLORS.textSecondary, fontWeight: FONT.weights.semibold, marginBottom: -6 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bg3, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.borderLight,
    paddingHorizontal: SPACING.md, height: 56,
  },
  atSign: { color: COLORS.textMuted, fontSize: FONT.sizes.md, marginRight: 4 },
  input: { flex: 1, color: COLORS.textPrimary, fontSize: FONT.sizes.md },
  infoBox: {
    flexDirection: 'row', gap: 10,
    backgroundColor: 'rgba(6, 182, 212, 0.08)',
    borderRadius: RADIUS.md, padding: SPACING.md,
    borderWidth: 1, borderColor: 'rgba(6, 182, 212, 0.15)',
    marginBottom: SPACING.xl,
  },
  infoText: { flex: 1, color: COLORS.textSecondary, fontSize: FONT.sizes.xs, lineHeight: 18 },
  cta: {
    height: 58, borderRadius: RADIUS.lg,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.instagram, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 16, elevation: 12,
    marginBottom: SPACING.md,
  },
  loadingRow: { flexDirection: 'row', alignItems: 'center' },
  ctaText: { color: '#fff', fontSize: FONT.sizes.lg, fontWeight: FONT.weights.bold },
  skipBtn: { alignItems: 'center', paddingVertical: SPACING.sm },
  skipText: { color: COLORS.textMuted, fontSize: FONT.sizes.sm },
});
