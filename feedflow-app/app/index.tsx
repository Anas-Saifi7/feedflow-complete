import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../src/store/appStore';
import { COLORS } from '../src/constants/theme';

export default function Index() {
  const { onboardingComplete, userId, instagram } = useAppStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!onboardingComplete) {
        router.replace('/onboarding');
      } else if (!userId) {
        router.replace('/onboarding');
      } else if (!instagram.connected) {
        router.replace('/connect');
      } else {
        router.replace('/(tabs)');
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [onboardingComplete, userId, instagram.connected]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg0, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}
