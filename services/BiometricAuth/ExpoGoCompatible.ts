import Constants from 'expo-constants';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

export interface BiometricResult {
  success: boolean;
  error?: string;
  biometryType?: LocalAuthentication.AuthenticationType[];
}

// Función para verificar si estamos en Expo Go
const isExpoGo = (): boolean => {
  return Constants.appOwnership === 'expo';
};

// Función para verificar si estamos en un simulador
const isSimulator = (): boolean => {
  if (Platform.OS === 'ios') {
    return Platform.isPad || Platform.isTV;
  }
  if (Platform.OS === 'android') {
    const deviceName = Constants.deviceName;
    return Boolean(
      deviceName &&
        (deviceName.includes('sdk') ||
          deviceName.includes('Simulator') ||
          deviceName.includes('Emulator')),
    );
  }
  return true;
};

export class BiometricAuth {
  /**
   * Verifica si el dispositivo soporta autenticación biométrica
   */
  static async isDeviceSupported(): Promise<boolean> {
    try {
      // En Expo Go, verificar si el módulo está disponible
      if (isExpoGo()) {
        console.log('BiometricAuth: Ejecutándose en Expo Go');
        try {
          const hasHardware = await LocalAuthentication.hasHardwareAsync();
          return hasHardware;
        } catch (error) {
          console.warn('BiometricAuth: Módulo no disponible en Expo Go:', error);
          return false;
        }
      }

      if (isSimulator()) {
        console.warn('BiometricAuth: Ejecutándose en simulador, biometría no disponible');
        return false;
      }

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      return hasHardware;
    } catch (error) {
      console.error('Error checking biometric hardware:', error);
      return false;
    }
  }

  /**
   * Verifica si hay datos biométricos configurados en el dispositivo
   */
  static async isEnrolled(): Promise<boolean> {
    try {
      if (isSimulator() || (isExpoGo() && isSimulator())) {
        return false;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return isEnrolled;
    } catch (error) {
      console.error('Error checking biometric enrollment:', error);
      return false;
    }
  }

  /**
   * Obtiene los tipos de autenticación biométrica disponibles
   */
  static async getSupportedAuthenticationTypes(): Promise<
    LocalAuthentication.AuthenticationType[]
  > {
    try {
      if (isSimulator() || (isExpoGo() && isSimulator())) {
        return [];
      }

      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      return types;
    } catch (error) {
      console.error('Error getting supported authentication types:', error);
      return [];
    }
  }

  /**
   * Ejecuta la autenticación biométrica
   */
  static async authenticate(
    promptMessage: string = 'Confirma tu identidad',
    fallbackLabel: string = 'Usar código',
    cancelLabel: string = 'Cancelar',
  ): Promise<BiometricResult> {
    try {
      // Verificar si estamos en Expo Go
      if (isExpoGo()) {
        console.log('BiometricAuth: Intentando autenticación en Expo Go');

        // Verificar si estamos en simulador dentro de Expo Go
        if (isSimulator()) {
          const error = 'La autenticación biométrica no está disponible en simuladores';
          console.warn('BiometricAuth:', error);
          return { success: false, error };
        }

        try {
          // Intentar la autenticación en Expo Go
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage,
            fallbackLabel,
            cancelLabel,
            disableDeviceFallback: false,
          });

          if (result.success) {
            return { success: true, biometryType: [] };
          } else {
            return {
              success: false,
              error: result.error || 'Autenticación biométrica fallida',
            };
          }
        } catch (error) {
          console.error('Error en autenticación biométrica con Expo Go:', error);
          return {
            success: false,
            error: 'Autenticación biométrica no disponible en Expo Go',
          };
        }
      }

      // Código para desarrollo standalone (fuera de Expo Go)
      if (isSimulator()) {
        const error = 'La autenticación biométrica no está disponible en simuladores';
        console.warn('BiometricAuth:', error);
        return { success: false, error };
      }

      const isSupported = await this.isDeviceSupported();
      if (!isSupported) {
        const error = 'Tu dispositivo no soporta autenticación biométrica';
        return { success: false, error };
      }

      const isEnrolled = await this.isEnrolled();
      if (!isEnrolled) {
        const error = 'No hay datos biométricos configurados en este dispositivo';
        return { success: false, error };
      }

      const biometryType = await this.getSupportedAuthenticationTypes();

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel,
        cancelLabel,
        disableDeviceFallback: false,
      });

      if (result.success) {
        return {
          success: true,
          biometryType,
        };
      } else {
        const error = result.error || 'Autenticación biométrica fallida';
        return {
          success: false,
          error,
          biometryType,
        };
      }
    } catch (error) {
      console.error('Error during biometric authentication:', error);
      let errorMessage = 'Error durante la autenticación biométrica';

      if (error instanceof Error && error.message.includes('ExpoLocalAuthentication')) {
        errorMessage = 'Autenticación biométrica no disponible en este entorno';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Verifica si la autenticación biométrica está completamente disponible
   */
  static async isAvailable(): Promise<{
    available: boolean;
    reason?: string;
    biometryType?: LocalAuthentication.AuthenticationType[];
  }> {
    // Verificar Expo Go primero
    if (isExpoGo()) {
      if (isSimulator()) {
        return {
          available: false,
          reason: 'La autenticación biométrica no está disponible en simuladores con Expo Go',
        };
      }

      try {
        const isSupported = await this.isDeviceSupported();
        if (!isSupported) {
          return {
            available: false,
            reason: 'El dispositivo no soporta autenticación biométrica',
          };
        }

        const isEnrolled = await this.isEnrolled();
        if (!isEnrolled) {
          return {
            available: false,
            reason: 'No hay datos biométricos configurados',
          };
        }

        return {
          available: true,
          biometryType: [],
        };
      } catch (error) {
        return {
          available: false,
          reason: 'Autenticación biométrica no disponible en Expo Go',
        };
      }
    }

    // Verificar simulador
    if (isSimulator()) {
      return {
        available: false,
        reason: 'La autenticación biométrica no está disponible en simuladores',
      };
    }

    const isSupported = await this.isDeviceSupported();
    if (!isSupported) {
      return {
        available: false,
        reason: 'El dispositivo no soporta autenticación biométrica',
      };
    }

    const isEnrolled = await this.isEnrolled();
    if (!isEnrolled) {
      return {
        available: false,
        reason: 'No hay datos biométricos configurados',
      };
    }

    const biometryType = await this.getSupportedAuthenticationTypes();
    return {
      available: true,
      biometryType,
    };
  }

  /**
   * Obtiene un mensaje descriptivo del tipo de biometría disponible
   */
  static getBiometryTypeDescription(types: LocalAuthentication.AuthenticationType[]): string {
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'Face ID';
    }
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'Touch ID / Huella digital';
    }
    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'Reconocimiento de iris';
    }
    return 'Autenticación biométrica';
  }

  /**
   * Método de utilidad para testing o desarrollo - simula autenticación exitosa
   */
  static async simulateAuthentication(): Promise<BiometricResult> {
    console.log('BiometricAuth: Simulando autenticación exitosa para desarrollo');
    return {
      success: true,
      biometryType: [],
    };
  }
}
