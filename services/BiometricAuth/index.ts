import Constants from 'expo-constants';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

export interface BiometricResult {
  success: boolean;
  error?: string;
  biometryType?: LocalAuthentication.AuthenticationType[];
}

// Función para verificar si estamos en un simulador
const isSimulator = (): boolean => {
  if (Platform.OS === 'ios') {
    // En iOS, verificamos si es un simulador
    return Platform.isPad || Platform.isTV;
  }
  if (Platform.OS === 'android') {
    // En Android, verificamos usando el modelo del dispositivo
    const deviceName = Constants.deviceName;
    return Boolean(
      deviceName &&
        (deviceName.includes('sdk') ||
          deviceName.includes('Simulator') ||
          deviceName.includes('Emulator')),
    );
  }
  return true; // Asumir simulador en web u otras plataformas
};

export class BiometricAuth {
  /**
   * Verifica si el dispositivo soporta autenticación biométrica
   */
  static async isDeviceSupported(): Promise<boolean> {
    try {
      // Verificar si estamos en simulador
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
      if (isSimulator()) {
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
      if (isSimulator()) {
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
      // Verificar si estamos en simulador
      if (isSimulator()) {
        const error = 'La autenticación biométrica no está disponible en simuladores';
        console.warn('BiometricAuth:', error);
        return { success: false, error };
      }

      // Verificar si el dispositivo soporta biometría
      const isSupported = await this.isDeviceSupported();
      if (!isSupported) {
        const error = 'Tu dispositivo no soporta autenticación biométrica';
        return { success: false, error };
      }

      // Verificar si hay datos biométricos configurados
      const isEnrolled = await this.isEnrolled();
      if (!isEnrolled) {
        const error = 'No hay datos biométricos configurados en este dispositivo';
        return { success: false, error };
      }

      // Obtener tipos de autenticación disponibles
      const biometryType = await this.getSupportedAuthenticationTypes();

      // Ejecutar la autenticación
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel,
        cancelLabel,
        disableDeviceFallback: false, // Permite usar PIN/contraseña como alternativa
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

      // Manejar errores específicos de módulos nativos
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
    // Verificar simulador primero
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
