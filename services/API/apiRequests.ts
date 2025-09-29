import apiClient from './apiClient';

// Tipos para las respuestas
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Función genérica para manejar requests
const handleRequest = async <T>(
  request: Promise<any>
): Promise<ApiResponse<T>> => {
  try {
    const response = await request;
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
  
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Error desconocido',
    };
  }
};

// Funciones HTTP
export const apiRequests = {
  get: async <T>(url: string): Promise<ApiResponse<T>> => {
    return handleRequest<T>(apiClient.get(url));
  },

  post: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    return handleRequest<T>(apiClient.post(url, data));
  },

  put: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    return handleRequest<T>(apiClient.put(url, data));
  },

  patch: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    return handleRequest<T>(apiClient.patch(url, data));
  },

  delete: async <T>(url: string): Promise<ApiResponse<T>> => {
    return handleRequest<T>(apiClient.delete(url));
  },
};