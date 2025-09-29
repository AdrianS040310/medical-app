import './cryptoPolyfill'; 
import CryptoJS from "crypto-js";
import Constants from 'expo-constants';


const SECRET_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_CRYPTO_SECRET;


export function encrypt(text: string): string {
  try {
    if (!text) throw new Error("No hay texto para cifrar");
    
    const encrypted = CryptoJS.AES.encrypt(text, SECRET_KEY);
    const result = encrypted.toString();
    return result;
  } catch (error: any) {
    throw new Error(`Error al cifrar: ${error.message}`);
  }
}

export function decrypt(ciphertext: string): string {
  try {
    if (!ciphertext) throw new Error("No hay texto para descifrar");
    
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decrypted) throw new Error("Descifrado vacío");
    
    return decrypted;
  } catch (error: any) {
    throw new Error(`Error al descifrar: ${error.message}`);
  }
}

// Resto del código sin cambios...
export class SecureApiClient {
  private baseURL: string;

  constructor(baseURL: string = "http://localhost:3000") {
    this.baseURL = baseURL;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    
    if (options.body && typeof options.body === 'string') {
      const bodyData = JSON.parse(options.body);
      const encryptedData = encrypt(JSON.stringify(bodyData));
      options.body = JSON.stringify({ data: encryptedData });
    }

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const encryptedResponse = await response.json();
    
    if (encryptedResponse.data && typeof encryptedResponse.data === 'string') {
      const decryptedData = decrypt(encryptedResponse.data);
      return JSON.parse(decryptedData);
    }
    
    return encryptedResponse;
  }

  async get(endpoint: string, headers?: Record<string, string>) {
    return this.makeRequest(endpoint, { method: 'GET', headers });
  }

  async post(endpoint: string, data: any, headers?: Record<string, string>) {
    return this.makeRequest(endpoint, { method: 'POST', body: JSON.stringify(data), headers });
  }

  async put(endpoint: string, data: any, headers?: Record<string, string>) {
    return this.makeRequest(endpoint, { method: 'PUT', body: JSON.stringify(data), headers });
  }

  async delete(endpoint: string, headers?: Record<string, string>) {
    return this.makeRequest(endpoint, { method: 'DELETE', headers });
  }

  async patch(endpoint: string, data: any, headers?: Record<string, string>) {
    return this.makeRequest(endpoint, { method: 'PATCH', body: JSON.stringify(data), headers });
  }
}

export const secureApiClient = new SecureApiClient();

export function useSecureApi() {
  const makeSecureRequest = async (
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
    data?: any
  ) => {
    switch (method) {
      case 'GET': return secureApiClient.get(endpoint);
      case 'POST': return secureApiClient.post(endpoint, data);
      case 'PUT': return secureApiClient.put(endpoint, data);
      case 'DELETE': return secureApiClient.delete(endpoint);
      case 'PATCH': return secureApiClient.patch(endpoint, data);
      default: throw new Error(`Método ${method} no soportado`);
    }
  };

  return { makeSecureRequest, secureApiClient };
}