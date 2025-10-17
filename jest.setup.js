// Mock de expo-constants para variables de entorno
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      EXPO_PUBLIC_API_URL: 'http://localhost:3000',
      EXPO_PUBLIC_NEWS_API_KEY: 'test_news_api_key',
      EXPO_PUBLIC_CRYPTO_SECRET: 'test_crypto_secret',
      EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME: 'test_google_ios_url_scheme',
    },
  },
}));

// Mock de expo-secure-store
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock de expo-router
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  },
}));

// Configuración global para tests
global.fetch = jest.fn();