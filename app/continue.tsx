import { useAppLock } from '@/hooks/use-app-lock';
import { SecureStorage } from '@/services/SecureStorage';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ContinueScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { isLocked } = useAppLock();

  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        const token = await SecureStorage.getToken();

        if (token && !isLocked) {
          // Solo redireccionar si hay token Y la app no está bloqueada
          router.replace('/(tabs)');
        } else {
          setIsLoading(false);
          fadeIn();
        }
      } catch (error) {
        setIsLoading(false);
        fadeIn();
      }
    };

    const fadeIn = () => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    };

    checkInitialAuth();
  }, [fadeAnim, isLocked]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <Image
          source={require('@/assets/images/medical-logo.webp')}
          style={styles.loaderLogo}
          contentFit="contain"
        />
        <Text style={styles.loaderText}>Cargando tu experiencia médica...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/medical-logo.webp')}
          style={styles.logo}
          contentFit="contain"
        />
        <Text style={styles.logoText}>Medical</Text>
      </View>

      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>¡Bienvenido a Medical! 👋</Text>
        <Text style={styles.welcomeSubtitle}>
          Gestiona tu salud con una experiencia moderna y segura
        </Text>
      </View>

      <View style={styles.illustrations}>
        <Image
          source={require('@/assets/images/hospital.webp')}
          style={[styles.illustration, { top: '35%', left: '5%', opacity: 0.25 }]}
        />
        <Image
          source={require('@/assets/images/doctor.webp')}
          style={[styles.illustration, { top: '45%', right: '10%', opacity: 0.3 }]}
        />
        <Image
          source={require('@/assets/images/surgery.webp')}
          style={[styles.illustration, { bottom: '30%', left: '15%', opacity: 0.25 }]}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/(auth)/registro')}
        >
          <Text style={styles.secondaryButtonText}>Crear Cuenta</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FCFF',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: '#F9FCFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderLogo: {
    width: 150,
    height: 60,
  },
  loaderText: {
    fontSize: 16,
    color: '#2D6CDF',
    marginTop: 20,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 140,
    height: 50,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2D6CDF',
    marginTop: 8,
  },
  welcomeSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1C1C1C',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  illustrations: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  illustration: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  actions: {
    marginTop: 'auto',
  },
  primaryButton: {
    backgroundColor: '#2D6CDF',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#2D6CDF',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2D6CDF',
  },
  secondaryButtonText: {
    color: '#2D6CDF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
