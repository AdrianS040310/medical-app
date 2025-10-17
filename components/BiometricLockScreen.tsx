import { BiometricAuth } from '@/services/BiometricAuth';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BiometricLockScreenProps {
  onUnlock: () => void;
  onError?: (error: string) => void;
}

export function BiometricLockScreen({ onUnlock, onError }: BiometricLockScreenProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [canUseBiometric, setCanUseBiometric] = useState(true);

  useEffect(() => {
    checkBiometricAvailability();
    // Intentar autenticación automáticamente cuando se monta el componente
    setTimeout(() => {
      handleBiometricAuth();
    }, 500);
  }, []);

  const checkBiometricAvailability = async () => {
    const result = await BiometricAuth.isAvailable();
    setCanUseBiometric(result.available);
  };

  const handleBiometricAuth = async () => {
    if (isAuthenticating) return;

    setIsAuthenticating(true);

    try {
      const result = await BiometricAuth.authenticate();

      if (result.success) {
        onUnlock();
      } else {
        const errorMessage = result.error || 'Autenticación fallida';
        Alert.alert('Error de autenticación', errorMessage, [
          { text: 'Reintentar', onPress: () => handleBiometricAuth() },
          { text: 'Cancelar', style: 'cancel' },
        ]);

        if (onError) {
          onError(errorMessage);
        }
      }
    } catch (error) {
      const errorMessage = 'Error inesperado durante la autenticación';
      Alert.alert('Error', errorMessage);

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="lock-closed" size={80} color="#007AFF" style={styles.lockIcon} />

        <Text style={styles.title}>Aplicación Bloqueada</Text>
        <Text style={styles.subtitle}>Por seguridad, necesitas autenticarte para continuar</Text>

        {canUseBiometric ? (
          <TouchableOpacity
            style={[styles.button, isAuthenticating && styles.buttonDisabled]}
            onPress={handleBiometricAuth}
            disabled={isAuthenticating}
          >
            <Ionicons name="finger-print" size={24} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>
              {isAuthenticating ? 'Autenticando...' : 'Usar Huella/Face ID'}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.errorText}>Autenticación biométrica no disponible</Text>
        )}

        <Text style={styles.helpText}>Toca el botón para usar tu huella dactilar o Face ID</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  lockIcon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    minWidth: 200,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 20,
  },
});
