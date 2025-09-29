import axios from 'axios';
import { encrypt, decrypt } from '../../utils/crypto';

const API_CONFIG = {
baseURL: 'http://192.168.1.66:3000/api',
  timeout: 10000,
};

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 🔐 Lista de rutas que requieren cifrado
const ENCRYPTED_ROUTES = [
  '/test-encryption',
  '/users/login',
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
  (config) => {
    
    if (requiresEncryption(config.url) && config.data) {
      
      try {
        const encryptedData = encrypt(JSON.stringify(config.data));
        config.data = { data: encryptedData };
        
      } catch (error) {
        throw new Error('Error al cifrar los datos de la petición');
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========================================
// INTERCEPTOR RESPONSE - Descifrar datos entrantes
// ========================================
apiClient.interceptors.response.use(
  (response) => {
    
    // Si la respuesta viene cifrada (tiene estructura { data: "encrypted_string" })
    if (response.data?.data && typeof response.data.data === 'string') {
      try {
        const decryptedData = decrypt(response.data.data);
        response.data = JSON.parse(decryptedData);
      } catch (error) {
        console.error('❌ Error al descifrar respuesta:', error);
        // Si falla el descifrado, devolver la respuesta original
        console.warn('⚠️ Devolviendo respuesta sin descifrar');
      }
    }
    
    return response;
  },
  (error) => {
    console.error('❌ Error en response:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default apiClient;