import {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserFilters,
  UserRole,
  UsersResponse,
} from '../../types/users';
import { apiRequests } from './apiRequests';

// Constantes para validación
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUIRED_FIELDS_ERROR = 'Email, nombre y apellido son requeridos';
const INVALID_EMAIL_ERROR = 'Formato de email inválido';
const INVALID_ROLE_ERROR = 'Rol de usuario inválido';
const USER_ID_REQUIRED_ERROR = 'ID de usuario requerido';

/**
 * Servicio de API para gestión de usuarios del sistema
 */
export class UsersService {
  /**
   * Obtener todos los usuarios con filtros opcionales
   */
  static async getAllUsers(filters?: UserFilters): Promise<ApiResponse<UsersResponse>> {
    try {
      const queryParams = new URLSearchParams();

      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());
      if (filters?.role) queryParams.append('role', filters.role);

      const url = `/api/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiRequests.get<UsersResponse>(url);

      // El backend devuelve la respuesta envuelta en { data: { data: {...}, message: "...", success: true } }
      if (response.success && response.data) {
        const backendResponse = response.data as any;
        if (backendResponse.success && backendResponse.data) {
          return {
            success: true,
            data: backendResponse.data,
          };
        }
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener los usuarios',
      };
    }
  }

  /**
   * Obtener un usuario por ID
   */
  static async getUserById(id: string): Promise<ApiResponse<User>> {
    try {
      if (!id) {
        return {
          success: false,
          error: USER_ID_REQUIRED_ERROR,
        };
      }

      const response = await apiRequests.get<User>(`/api/users/${id}`);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener el usuario',
      };
    }
  }

  /**
   * Crear un nuevo usuario
   */
  static async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    try {
      // Validar datos requeridos
      if (!userData.email || !userData.firstName || !userData.lastName) {
        return {
          success: false,
          error: REQUIRED_FIELDS_ERROR,
        };
      }

      // Validar formato de email
      if (!EMAIL_REGEX.test(userData.email)) {
        return {
          success: false,
          error: INVALID_EMAIL_ERROR,
        };
      }

      // Validar que el rol sea válido
      if (userData.role && !Object.values(UserRole).includes(userData.role)) {
        return {
          success: false,
          error: INVALID_ROLE_ERROR,
        };
      }

      const createEndpoint = '/api/users';
      const response = await apiRequests.post<User>(createEndpoint, userData);

      // El backend devuelve la respuesta envuelta en { data: { data: {...}, message: "...", success: true } }
      if (response.success && response.data) {
        const backendResponse = response.data as any;
        if (backendResponse.success && backendResponse.data) {
          return {
            success: true,
            data: backendResponse.data,
          };
        }
      }
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al crear el usuario',
      };
    }
  }

  /**
   * Actualizar un usuario existente
   */
  static async updateUser(id: string, updateData: UpdateUserRequest): Promise<ApiResponse<User>> {
    try {
      if (!id) {
        return {
          success: false,
          error: USER_ID_REQUIRED_ERROR,
        };
      }

      // Validar formato de email si se está actualizando
      if (updateData.email && !EMAIL_REGEX.test(updateData.email)) {
        return {
          success: false,
          error: INVALID_EMAIL_ERROR,
        };
      }

      // Validar que el rol sea válido si se está actualizando
      if (updateData.role && !Object.values(UserRole).includes(updateData.role)) {
        return {
          success: false,
          error: INVALID_ROLE_ERROR,
        };
      }

      const response = await apiRequests.put<User>(`/api/users/${id}`, updateData);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al actualizar el usuario',
      };
    }
  }

  /**
   * Eliminar un usuario
   */
  static async deleteUser(id: string): Promise<ApiResponse<void>> {
    try {
      if (!id) {
        return {
          success: false,
          error: USER_ID_REQUIRED_ERROR,
        };
      }

      const response = await apiRequests.delete(`/api/users/${id}`);

      return {
        success: response.success,
        error: response.error,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al eliminar el usuario',
      };
    }
  }

  /**
   * Obtener perfil del usuario autenticado
   */
  static async getProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await apiRequests.get<User>('/users/profile');
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener el perfil',
      };
    }
  }

  /**
   * Buscar usuarios por email o nombre
   */
  static async searchUsers(
    query: string,
    filters?: { role?: UserRole; page?: number; limit?: number },
  ): Promise<ApiResponse<UsersResponse>> {
    try {
      if (!query.trim()) {
        return {
          success: false,
          error: 'Término de búsqueda requerido',
        };
      }

      // Para búsqueda, usamos el endpoint de obtener todos con filtros
      const searchFilters: UserFilters = {
        ...filters,
      };

      const response = await this.getAllUsers(searchFilters);

      if (response.success && response.data) {
        // Filtrar localmente por el término de búsqueda
        const filteredUsers = response.data.users.filter(
          user =>
            user.email.toLowerCase().includes(query.toLowerCase()) ||
            user.firstName.toLowerCase().includes(query.toLowerCase()) ||
            user.lastName.toLowerCase().includes(query.toLowerCase()),
        );

        return {
          success: true,
          data: {
            users: filteredUsers,
            pagination: {
              ...response.data.pagination,
              total: filteredUsers.length,
              pages: Math.ceil(filteredUsers.length / (filters?.limit || 10)),
            },
          },
        };
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al buscar usuarios',
      };
    }
  }
}
