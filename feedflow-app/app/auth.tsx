import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../src/constants/theme';
import { authService } from '../src/services/api';
import { useAppStore } from '../src/store/appStore';

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { setUser, setOnboardingComplete } = useAppStore();

  const handleSubmit = async () => {
    if (!email || !password || (mode === 'register' && !name)) {
      Toast.show({ type: 'error', text1: 'Fill in all fields' });
      return;
    }

    setLoading(true);
    try {
      let data;
      if (mode === 'register') {
        data = await authService.register(name, email, password);
      } else {
        data = await authService.login(email, password);
      }

      setUser(data.user.id, data.user.name, data.user.email);
      setOnboardingComplete(true);

      Toast.show({ type: 'success', text1: `Welcome, ${data.user.name}! 🚀` });

      setTimeout(() => {
        router.replace('/preferences');
      }, 800);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Something went wrong';
      Toast.show({ type: 'error', text1: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.logo}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="sparkles" size={28} color="#fff" />
              </LinearGradient>
              <Text style={styles.brand}>FeedFlow</Text>
              <Text style={styles.tagline}>
                {mode === 'register' ? 'Create your account' : 'Welcome back'}
              </Text>
            </View>

            {/* Mode Toggle */}
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, mode === 'register' && styles.toggleActive]}
                onPress={() => setMode('register')}
              >
                <Text style={[styles.toggleText, mode === 'register' && styles.toggleTextActive]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, mode === 'login' && styles.toggleActive]}
                onPress={() => setMode('login')}
              >
                <Text style={[styles.toggleText, mode === 'login' && styles.toggleTextActive]}>
                  Log In
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {mode === 'register' && (
                <View style={styles.inputWrap}>
                  <Ionicons name="person-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full name"
                    placeholderTextColor={COLORS.textMuted}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              )}

              <View style={styles.inputWrap}>
                <Ionicons name="mail-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor={COLORS.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Password"
                  placeholderTextColor={COLORS.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPass}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                  <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              activeOpacity={0.85}
              disabled={loading}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.cta}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.ctaText}>
                    {mode === 'register' ? 'Create Account →' : 'Log In →'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.terms}>
              By continuing you agree to our Terms of Service and Privacy Policy.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg0 },
  blob: { position: 'absolute', borderRadius: 999, opacity: 0.1 },
  blob1: { width: 280, height: 280, backgroundColor: COLORS.primary, top: -60, right: -60 },
  blob2: { width: 220, height: 220, backgroundColor: COLORS.accent, bottom: 80, left: -60 },
  scroll: { flexGrow: 1, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl },
  header: { alignItems: 'center', marginTop: SPACING.xxl, marginBottom: SPACING.xl },
  logo: {
    width: 64, height: 64, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.md,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5, shadowRadius: 16, elevation: 12,
  },
  brand: {
    fontSize: FONT.sizes.xxl, fontWeight: FONT.weights.extrabold,
    color: COLORS.textPrimary, letterSpacing: -0.5,
  },
  tagline: { fontSize: FONT.sizes.md, color: COLORS.textSecondary, marginTop: 6 },
  toggleRow: {
    flexDirection: 'row', backgroundColor: COLORS.bg3,
    borderRadius: RADIUS.lg, padding: 4, marginBottom: SPACING.xl,
  },
  toggleBtn: {
    flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: RADIUS.md,
  },
  toggleActive: { backgroundColor: COLORS.primary },
  toggleText: { color: COLORS.textMuted, fontWeight: FONT.weights.semibold, fontSize: FONT.sizes.md },
  toggleTextActive: { color: '#fff' },
  form: { gap: SPACING.md, marginBottom: SPACING.xl },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bg3, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.borderLight,
    paddingHorizontal: SPACING.md, height: 56,
  },
  inputIcon: { marginRight: SPACING.sm },
  input: {
    flex: 1, color: COLORS.textPrimary,
    fontSize: FONT.sizes.md, fontWeight: FONT.weights.medium,
  },
  eyeBtn: { padding: 4 },
  cta: {
    height: 58, borderRadius: RADIUS.lg,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45, shadowRadius: 16, elevation: 12,
    marginBottom: SPACING.lg,
  },
  ctaText: { color: '#fff', fontSize: FONT.sizes.lg, fontWeight: FONT.weights.bold },
  terms: { color: COLORS.textMuted, fontSize: FONT.sizes.xs, textAlign: 'center', lineHeight: 18 },
});
