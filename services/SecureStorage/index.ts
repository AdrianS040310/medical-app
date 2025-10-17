import * as SecureStore from 'expo-secure-store';

export class SecureStorage {
  private static TOKEN_KEY = 'access_token';
  private static USER_KEY = 'user_data';

  static async saveToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token:', error);
      throw new Error('Failed to save token securely');
    }
  }

  static async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  static async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  static async saveUserData(userData: object): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.USER_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
      throw new Error('Failed to save user data securely');
    }
  }

  static async getUserData(): Promise<object | null> {
    try {
      const userData = await SecureStore.getItemAsync(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  static async removeUserData(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.USER_KEY);
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  }

  static async clearAll(): Promise<void> {
    try {
      await this.removeToken();
      await this.removeUserData();
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }
}
