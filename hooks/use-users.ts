import { useCallback, useEffect, useState } from 'react';
import { UsersService } from '../services/api/users';
import { CreateUserRequest, UpdateUserRequest, User, UserFilters, UserRole } from '../types/users';

interface UseUsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
}

interface UseUsersReturn extends UseUsersState {
  // Operaciones CRUD
  fetchUsers: (filters?: UserFilters) => Promise<void>;
  createUser: (data: CreateUserRequest) => Promise<boolean>;
  updateUser: (id: string, data: UpdateUserRequest) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  searchUsers: (query: string, role?: UserRole) => Promise<void>;

  // Utilidades
  clearError: () => void;
  refreshUsers: () => Promise<void>;
}

/**
 * Hook personalizado para gestionar las operaciones CRUD de usuarios
 * Proporciona estado centralizado y métodos para todas las operaciones
 */
export const useUsers = (initialFilters?: UserFilters): UseUsersReturn => {
  const [state, setState] = useState<UseUsersState>({
    users: [],
    loading: false,
    error: null,
    pagination: null,
  });

  const [currentFilters, setCurrentFilters] = useState<UserFilters | undefined>(initialFilters);

  /**
   * Limpiar errores
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Obtener usuarios con filtros opcionales
   */
  const fetchUsers = useCallback(
    async (filters?: UserFilters) => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const filtersToUse = filters || currentFilters;

      try {
        const response = await UsersService.getAllUsers(filtersToUse);

        if (response.success && response.data) {
          setState(prev => ({
            ...prev,
            users: response.data!.users,
            pagination: response.data!.pagination,
            loading: false,
          }));

          if (filters) {
            setCurrentFilters(filters);
          }
        } else {
          setState(prev => ({
            ...prev,
            error: response.error || 'Error al obtener los usuarios',
            loading: false,
          }));
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Error desconocido',
          loading: false,
        }));
      }
    },
    [currentFilters],
  );

  /**
   * Crear un nuevo usuario
   */
  const createUser = useCallback(
    async (data: CreateUserRequest): Promise<boolean> => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await UsersService.createUser(data);

        if (response.success) {
          // Recargar los usuarios después de crear uno nuevo
          await fetchUsers();
          return true;
        } else {
          setState(prev => ({
            ...prev,
            error: response.error || 'Error al crear el usuario',
            loading: false,
          }));
          return false;
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Error desconocido',
          loading: false,
        }));
        return false;
      }
    },
    [fetchUsers],
  );

  /**
   * Actualizar un usuario existente
   */
  const updateUser = useCallback(async (id: string, data: UpdateUserRequest): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await UsersService.updateUser(id, data);

      if (response.success) {
        // Actualizar el usuario en el estado local
        setState(prev => ({
          ...prev,
          users: prev.users.map(user => (user.id === id ? { ...user, ...data } : user)),
          loading: false,
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          error: response.error || 'Error al actualizar el usuario',
          loading: false,
        }));
        return false;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error desconocido',
        loading: false,
      }));
      return false;
    }
  }, []);

  /**
   * Eliminar un usuario
   */
  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await UsersService.deleteUser(id);

      if (response.success) {
        // Remover el usuario del estado local
        setState(prev => ({
          ...prev,
          users: prev.users.filter(user => user.id !== id),
          loading: false,
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          error: response.error || 'Error al eliminar el usuario',
          loading: false,
        }));
        return false;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error desconocido',
        loading: false,
      }));
      return false;
    }
  }, []);

  /**
   * Buscar usuarios por email o nombre
   */
  const searchUsers = useCallback(
    async (query: string, role?: UserRole) => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const searchFilters = { role, ...currentFilters };

      try {
        const response = await UsersService.searchUsers(query, searchFilters);

        if (response.success && response.data) {
          setState(prev => ({
            ...prev,
            users: response.data!.users,
            pagination: response.data!.pagination,
            loading: false,
          }));
        } else {
          setState(prev => ({
            ...prev,
            error: response.error || 'Error al buscar usuarios',
            loading: false,
          }));
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Error desconocido',
          loading: false,
        }));
      }
    },
    [currentFilters],
  );

  /**
   * Recargar los usuarios con los filtros actuales
   */
  const refreshUsers = useCallback(async () => {
    await fetchUsers(currentFilters);
  }, [fetchUsers, currentFilters]);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    ...state,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    clearError,
    refreshUsers,
  };
};
