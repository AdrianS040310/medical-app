import { BiometricAuth } from '@/services/BiometricAuth';
import { SecureStorage } from '@/services/SecureStorage';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BiometricDemo() {
  const [status, setStatus] = useState<string>('Presiona para probar biometría');
  const [isLoading, setIsLoading] = useState(false);

  const testBiometric = async () => {
    setIsLoading(true);
    setStatus('Verificando disponibilidad...');

    try {
      // Verificar disponibilidad
      const availability = await BiometricAuth.isAvailable();

      if (!availability.available) {
        setStatus(`❌ No disponible: ${availability.reason}`);
        Alert.alert('Biometría no disponible', availability.reason || 'Razón desconocida');
        return;
      }

      // Mostrar tipo de biometría disponible
      const biometryType = availability.biometryType
        ? BiometricAuth.getBiometryTypeDescription(availability.biometryType)
        : 'Biometría';

      setStatus(`✅ Disponible: ${biometryType}`);

      // Ejecutar autenticación
      setTimeout(async () => {
        setStatus('🔐 Solicitando autenticación...');

        const result = await BiometricAuth.authenticate(
          `Usa tu ${biometryType} para probar la funcionalidad`,
          'Usar código alternativo',
          'Cancelar prueba',
        );

        if (result.success) {
          setStatus('🎉 ¡Autenticación exitosa!');

          // Probar almacenamiento seguro
          const testToken = 'test-jwt-token-' + Date.now();
          await SecureStorage.saveToken(testToken);
          const retrievedToken = await SecureStorage.getToken();

          Alert.alert(
            '✅ Prueba completada',
            `Biometría: ✅\nAlmacenamiento: ${retrievedToken === testToken ? '✅' : '❌'}`,
          );

          // Limpiar token de prueba
          await SecureStorage.removeToken();
        } else {
          setStatus(`❌ Falló: ${result.error}`);
          Alert.alert('Autenticación fallida', result.error || 'Error desconocido');
        }
      }, 1000);
    } catch (error) {
      console.error('Error en prueba biométrica:', error);
      setStatus('❌ Error durante la prueba');
      Alert.alert('Error', 'Ocurrió un error durante la prueba');
    } finally {
      setIsLoading(false);
    }
  };

  const checkStorageStatus = async () => {
    try {
      const token = await SecureStorage.getToken();
      const userData = await SecureStorage.getUserData();

      Alert.alert(
        'Estado del almacenamiento',
        `Token: ${token ? '✅ Presente' : '❌ No hay'}\nDatos usuario: ${
          userData ? '✅ Presente' : '❌ No hay'
        }`,
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo verificar el almacenamiento');
    }
  };

  const clearStorage = async () => {
    try {
      await SecureStorage.clearAll();
      Alert.alert('✅ Completado', 'Almacenamiento limpiado');
    } catch (error) {
      Alert.alert('❌ Error', 'No se pudo limpiar el almacenamiento');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Demo Biometría</Text>
      <Text style={styles.status}>{status}</Text>

      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={testBiometric}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'Probando...' : 'Probar Biometría'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={checkStorageStatus}
        disabled={isLoading}
      >
        <Text style={styles.secondaryButtonText}>Verificar Almacenamiento</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.dangerButton]}
        onPress={clearStorage}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Limpiar Almacenamiento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  status: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    minHeight: 40,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2D6CDF',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2D6CDF',
  },
  dangerButton: {
    backgroundColor: '#ff4757',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#2D6CDF',
    fontSize: 16,
    fontWeight: '600',
  },
});
