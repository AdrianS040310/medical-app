// src/services/api/endpoints.ts
// ✅ BIEN - Solo la ruta sin /api
export const endpoints = {
  test: {
    health: () => '/health',  // ← Sin /api
    mensaje: () => '/mensaje',
    testEncryption: () => '/test-encryption',
  },
  
  users: {
    login: () => '/users/login',
    register: () => '/users/register',
    profile: (id: string) => `/users/${id}`,
  },
  
  medical: {
    patients: () => '/patients',
    patientById: (id: string) => `/patients/${id}`,
    appointments: () => '/appointments',
    appointmentById: (id: string) => `/appointments/${id}`,
  }
};

export type Endpoints = typeof endpoints;