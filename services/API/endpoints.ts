// src/services/api/endpoints.ts
// ✅ BIEN - Solo la ruta sin /api
export const endpoints = {
  test: {
    health: () => '/health', // ← Sin /api
    mensaje: () => '/mensaje',
    testEncryption: () => '/test-encryption',
  },

  users: {
    getAll: () => '/users',
    getById: (id: string) => `/users/${id}`,
    create: () => '/users',
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
    login: () => '/users/login',
    register: () => '/users/register',
    profile: () => `/users/profile`,
  },

  usersEncryption: {
    getUser: () => '/users/encrypt/me',
    login: () => '/login/encrypt/validateTokenGoogle',
    logout: () => '/login/encrypt/logout',
  },

  medical: {
    patients: () => '/patients',
    patientById: (id: string) => `/patients/${id}`,
    appointments: () => '/appointments',
    appointmentById: (id: string) => `/appointments/${id}`,
  },
};

export type Endpoints = typeof endpoints;
