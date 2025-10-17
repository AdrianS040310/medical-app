import axios from 'axios';
import Constants from 'expo-constants';
import { decrypt, encrypt } from '../../utils/crypto';
import { SecureStorage } from '../SecureStorage';

const API_CONFIG = {
  baseURL: Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
};

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 🔐 Lista de rutas que requieren cifrado
const ENCRYPTED_ROUTES = [
  '/users/encrypt/me',
  '/login/encrypt/validateTokenGoogle',
  '/users/register',
  // Agrega aquí más rutas que necesiten cifrado
];

// Función helper para verificar si una ruta requiere cifrado
const requiresEncryption = (url?: string): boolean => {
  if (!url) return false;
  return ENCRYPTED_ROUTES.some(route => url.includes(route));
};

// ========================================
// INTERCEPTOR REQUEST - Cifrar datos salientes
// ========================================
apiClient.interceptors.request.use(
  async config => {
    if (requiresEncryption(config.url) && config.data) {
      try {
        const encryptedData = encrypt(JSON.stringify(config.data));

        config.data = { data: encryptedData };
      } catch (error) {
        throw new Error('Error al cifrar los datos de la petición');
      }
    }

    const token = await SecureStorage.getToken();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// ========================================
// INTERCEPTOR RESPONSE - Descifrar datos entrantes
// ========================================
apiClient.interceptors.response.use(
  response => {
    // Si la respuesta viene cifrada (tiene estructura { data: "encrypted_string" })
    if (response.data?.data && typeof response.data.data === 'string') {
      try {
        const decryptedData = decrypt(response.data.data);

        response.data = JSON.parse(decryptedData);
      } catch (error) {
        // Si falla el descifrado, devolver la respuesta original
        console.warn('⚠️ Devolviendo respuesta sin descifrar');
      }
    }

    return response;
  },
  error => {
    // Manejo específico para errores 401
    if (error.response?.status === 401) {
      console.log('🔐 Error 401 - Token no válido o expirado');
      // No limpiar automáticamente el token aquí, dejar que cada componente lo maneje
    }

    return Promise.reject(error);
  },
);

export default apiClient;
