import apiClient from '../api/apiClient';

// Tipos para las respuestas
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

// Función genérica para manejar requests
const handleRequest = async <T>(request: Promise<any>): Promise<ApiResponse<T>> => {
  try {
    const response = await request;
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    // Manejo específico para diferentes tipos de errores
    let errorMessage = 'Error desconocido';
    let statusCode = null;

    if (error.response) {
      // Error de respuesta del servidor
      statusCode = error.response.status;
      const data = error.response.data;

      if (statusCode === 401) {
        errorMessage = 'No autorizado - Token inválido o expirado';
      } else if (statusCode === 403) {
        errorMessage = 'Acceso denegado';
      } else if (statusCode === 404) {
        errorMessage = 'Recurso no encontrado';
      } else if (statusCode >= 500) {
        errorMessage = 'Error del servidor';
      } else {
        errorMessage = data?.message || data?.data || `Error ${statusCode}`;
      }
    } else if (error.request) {
      // Error de red
      errorMessage = 'Error de conexión - Verifica tu conexión a internet';
    } else {
      // Otros errores
      errorMessage = error.message || 'Error desconocido';
    }

    return {
      success: false,
      error: errorMessage,
      statusCode: statusCode,
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
