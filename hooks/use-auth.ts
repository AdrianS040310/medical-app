import { apiRequests } from '@/services/api/apiRequests';
import { endpoints } from '@/services/api/endpoints';
import { SecureStorage } from '@/services/SecureStorage';
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

      const token = await SecureStorage.getToken();
      const isAuthenticated = !!token;
      const user = isAuthenticated ? await SecureStorage.getUserData() : null;

      setAuthState({
        isAuthenticated,
        isLoading: false,
        user,
      });
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
    }
  };

  const login = useCallback(async (token: string, userData?: any) => {
    try {
      await SecureStorage.saveToken(token);
      if (userData) {
        await SecureStorage.saveUserData(userData);
      }
      await checkAuthStatus();
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const logOut = await apiRequests.post(endpoints.usersEncryption.logout(), {});
      if (logOut.success) {
        await SecureStorage.clearAll();
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });

        // Pequeño delay para asegurar que el estado se actualice
        setTimeout(() => {
          router.replace('/continue');
        }, 100);
      }
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }, []);

  const requireAuth = useCallback(async () => {
    const token = await SecureStorage.getToken();
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
