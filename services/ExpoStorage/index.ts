import * as SecureStore from 'expo-secure-store';

// Usar claves válidas para SecureStore (solo caracteres alfanuméricos, ., -, _)
const KEY_TOKEN = '74PM10GEd68IG93ytf34i6';
const KEY_USER = 'nPZruw5IPO90X9Aj3f44s1';

export const ExpoStorage = {
  // Guardar token
  async saveToken(token: string): Promise<void> {
    console.log('Key', KEY_TOKEN);
    try {
      await SecureStore.setItemAsync(KEY_TOKEN, token);
      console.log('✅ Token guardado correctamente');
    } catch (error) {
      console.error('❌ Error guardando token:', error);
      throw error;
    }
  },

  // Obtener token
  async getToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(KEY_TOKEN);
      return token;
    } catch (error) {
      console.error('❌ Error obteniendo token:', error);
      return null;
    }
  },

  // Guardar datos del usuario
  async saveUser(userData: any): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEY_USER, JSON.stringify(userData));
      console.log('✅ Datos de usuario guardados');
    } catch (error) {
      console.error('❌ Error guardando usuario:', error);
      throw error;
    }
  },

  // Obtener datos del usuario
  async getUser(): Promise<any | null> {
    try {
      const userData = await SecureStore.getItemAsync(KEY_USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('❌ Error obteniendo usuario:', error);
      return null;
    }
  },

  // Verificar si hay sesión activa
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  },

  // Limpiar sesión (logout)
  async clearSession(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(KEY_TOKEN);
      await SecureStore.deleteItemAsync(KEY_USER);
      console.log('✅ Sesión cerrada correctamente');
    } catch (error) {
      console.error('❌ Error cerrando sesión:', error);
      throw error;
    }
  },
};
