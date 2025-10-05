import { ExpoStorage } from '@/services/ExpoStorage';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const isAuthenticated = await ExpoStorage.isAuthenticated();
      const user = isAuthenticated ? await ExpoStorage.getUser() : null;

      setAuthState({
        isAuthenticated,
        isLoading: false,
        user,
      });
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
    }
  };

  const login = useCallback(async (token: string, userData?: any) => {
    try {
      await ExpoStorage.saveToken(token);
      if (userData) {
        await ExpoStorage.saveUser(userData);
      }
      await checkAuthStatus();
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await ExpoStorage.clearSession();

      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });

      // Pequeño delay para asegurar que el estado se actualice
      setTimeout(() => {
        router.replace('/continue');
      }, 100);
    } catch (error) {
      throw error;
    }
  }, []);

  const requireAuth = useCallback(async () => {
    const token = await ExpoStorage.getToken();
    if (!token) {
      router.replace('/(auth)/login');
      return false;
    }
    return true;
  }, []);

  return {
    ...authState,
    login,
    logout,
    refreshAuth: checkAuthStatus,
    requireAuth,
  };
}
