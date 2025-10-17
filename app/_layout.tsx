import { BiometricLockScreen } from '@/components/BiometricLockScreen';
import { useAppLock } from '@/hooks/use-app-lock';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import 'react-native-reanimated';

export const unstable_settings = {
  anchor: 'continue',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isLocked, unlockApp } = useAppLock();

  // Si la app está bloqueada, mostrar la pantalla de bloqueo biométrico
  if (isLocked) {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <BiometricLockScreen
          onUnlock={unlockApp}
          onError={error => console.log('Lock screen error:', error)}
        />
        <StatusBar style="auto" />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="continue" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
