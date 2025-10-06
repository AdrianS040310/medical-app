// Tipos para los usuarios del sistema
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  patient?: {
    id: string;
    userId: string;
    dateOfBirth: string;
    phone?: string;
    address?: string;
    medicalHistory?: string;
    createdAt: string;
    updatedAt: string;
  };
  doctor?: {
    id: string;
    userId: string;
    specialty: string;
    licenseNumber: string;
    phone?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: UserRole;
}

export interface UserPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface UsersResponse {
  users: User[];
  pagination: UserPagination;
}

// Utilidades para roles
export const getUserRoleLabel = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return 'Administrador';
    case UserRole.DOCTOR:
      return 'Doctor';
    case UserRole.PATIENT:
      return 'Paciente';
    default:
      return role;
  }
};

export const getUserRoleColor = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return '#FF3B30';
    case UserRole.DOCTOR:
      return '#007AFF';
    case UserRole.PATIENT:
      return '#34C759';
    default:
      return '#8E8E93';
  }
};
