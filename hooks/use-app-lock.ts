import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export interface AppLockState {
  isLocked: boolean;
  requiresBiometric: boolean;
  lastActiveTime: number;
}

const APP_LOCK_KEY = 'app_lock_state';
const LOCK_TIMEOUT = 10000; // 10 segundos sin usar la app para bloquear (reducido para testing)

export function useAppLock() {
  const [isLocked, setIsLocked] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    checkLockState();

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription?.remove();
  }, []);

  const checkLockState = async () => {
    try {
      const lockStateStr = await SecureStore.getItemAsync(APP_LOCK_KEY);
      if (lockStateStr) {
        const lockState: AppLockState = JSON.parse(lockStateStr);
        const timeSinceLastActive = Date.now() - lockState.lastActiveTime;

        // Si hay un JWT guardado y ha pasado tiempo, requerir biométrica
        const hasJWT = await SecureStore.getItemAsync('userToken');
        if (hasJWT && (lockState.isLocked || timeSinceLastActive > LOCK_TIMEOUT)) {
          setIsLocked(true);
        }
      }
    } catch (error) {
      console.log('Error checking lock state:', error);
    }
  };

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      // App vuelve al foreground
      await checkLockState();
    } else if (nextAppState.match(/inactive|background/)) {
      // App va al background
      await setAppLocked(true);
    }

    setAppState(nextAppState);
  };

  const setAppLocked = async (locked: boolean) => {
    try {
      const lockState: AppLockState = {
        isLocked: locked,
        requiresBiometric: true,
        lastActiveTime: Date.now(),
      };

      await SecureStore.setItemAsync(APP_LOCK_KEY, JSON.stringify(lockState));
      setIsLocked(locked);
    } catch (error) {
      console.log('Error setting lock state:', error);
    }
  };

  const unlockApp = async () => {
    await setAppLocked(false);
  };

  const lockApp = async () => {
    await setAppLocked(true);
  };

  const clearLockState = async () => {
    try {
      await SecureStore.deleteItemAsync(APP_LOCK_KEY);
      setIsLocked(false);
    } catch (error) {
      console.log('Error clearing lock state:', error);
    }
  };

  return {
    isLocked,
    unlockApp,
    lockApp,
    setAppLocked,
    clearLockState,
  };
}
