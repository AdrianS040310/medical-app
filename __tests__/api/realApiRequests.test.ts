import apiClient from '../../services/API/apiClient';
import { apiRequests, ApiResponse } from '../../services/API/apiRequests';

// Mock del apiClient
jest.mock('../../services/API/apiClient', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('API Requests - Manejo Real de Respuestas y Errores', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET Requests', () => {
    test('debe manejar respuesta exitosa GET', async () => {
      const mockResponse = {
        data: {
          success: true,
          users: [
            { id: 1, name: 'Dr. Juan Pérez', email: 'juan@medical.com' },
            { id: 2, name: 'Dr. María García', email: 'maria@medical.com' },
          ],
        },
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const result: ApiResponse<any> = await apiRequests.get('/users');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse.data);
      expect(result.error).toBeUndefined();
      expect(result.statusCode).toBeUndefined();
      expect(mockApiClient.get).toHaveBeenCalledWith('/users');
    });

    test('debe manejar error 404 GET', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Usuario no encontrado' },
        },
        config: { url: '/users/999' },
        message: 'Request failed with status code 404',
      };

      mockApiClient.get.mockRejectedValue(mockError);

      const result: ApiResponse<any> = await apiRequests.get('/users/999');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Recurso no encontrado');
      expect(result.statusCode).toBe(404);
      expect(result.data).toBeUndefined();
    });

    test('debe manejar error de red GET', async () => {
      const mockError = {
        request: {},
        config: { url: '/users' },
        message: 'Network Error',
      };

      mockApiClient.get.mockRejectedValue(mockError);

      const result: ApiResponse<any> = await apiRequests.get('/users');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error de conexión - Verifica tu conexión a internet');
      expect(result.statusCode).toBeNull();
      expect(result.data).toBeUndefined();
    });
  });

  describe('POST Requests', () => {
    test('debe manejar respuesta exitosa POST', async () => {
      const requestData = {
        email: 'nuevo@medical.com',
        password: 'securepassword',
        name: 'Dr. Carlos López',
      };

      const mockResponse = {
        data: {
          success: true,
          user: {
            id: 3,
            email: 'nuevo@medical.com',
            name: 'Dr. Carlos López',
            token: 'jwt-token-123',
          },
        },
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result: ApiResponse<any> = await apiRequests.post('/users/register', requestData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse.data);
      expect(result.error).toBeUndefined();
      expect(mockApiClient.post).toHaveBeenCalledWith('/users/register', requestData);
    });

    test('debe manejar error 400 POST - Datos inválidos', async () => {
      const requestData = {
        email: 'email-invalido',
        password: '123',
      };

      const mockError = {
        response: {
          status: 400,
          data: {
            message: 'Datos de registro inválidos',
            errors: ['Email inválido', 'Contraseña muy corta'],
          },
        },
        config: { url: '/users/register' },
        message: 'Request failed with status code 400',
      };

      mockApiClient.post.mockRejectedValue(mockError);

      const result: ApiResponse<any> = await apiRequests.post('/users/register', requestData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Datos de registro inválidos');
      expect(result.statusCode).toBe(400);
      expect(result.data).toBeUndefined();
    });

    test('debe manejar error 409 POST - Usuario ya existe', async () => {
      const requestData = {
        email: 'existente@medical.com',
        password: 'password123',
        name: 'Dr. Existente',
      };

      const mockError = {
        response: {
          status: 409,
          data: { message: 'El usuario ya existe' },
        },
        config: { url: '/users/register' },
        message: 'Request failed with status code 409',
      };

      mockApiClient.post.mockRejectedValue(mockError);

      const result: ApiResponse<any> = await apiRequests.post('/users/register', requestData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('El usuario ya existe');
      expect(result.statusCode).toBe(409);
    });
  });

  describe('PUT Requests', () => {
    test('debe manejar respuesta exitosa PUT', async () => {
      const updateData = {
        name: 'Dr. Juan Pérez Actualizado',
        speciality: 'Cardiología Avanzada',
      };

      const mockResponse = {
        data: {
          success: true,
          user: {
            id: 1,
            name: 'Dr. Juan Pérez Actualizado',
            speciality: 'Cardiología Avanzada',
            updatedAt: '2024-01-15T10:30:00Z',
          },
        },
      };

      mockApiClient.put.mockResolvedValue(mockResponse);

      const result: ApiResponse<any> = await apiRequests.put('/users/1', updateData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse.data);
      expect(mockApiClient.put).toHaveBeenCalledWith('/users/1', updateData);
    });

    test('debe manejar error 403 PUT - Sin permisos', async () => {
      const updateData = { name: 'Nombre no autorizado' };

      const mockError = {
        response: {
          status: 403,
          data: { message: 'No tienes permisos para modificar este usuario' },
        },
        config: { url: '/users/1' },
        message: 'Request failed with status code 403',
      };

      mockApiClient.put.mockRejectedValue(mockError);

      const result: ApiResponse<any> = await apiRequests.put('/users/1', updateData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Acceso denegado');
      expect(result.statusCode).toBe(403);
    });
  });

  describe('PATCH Requests', () => {
    test('debe manejar respuesta exitosa PATCH', async () => {
      const patchData = {
        speciality: 'Neurología',
      };

      const mockResponse = {
        data: {
          success: true,
          user: {
            id: 1,
            name: 'Dr. Juan Pérez',
            speciality: 'Neurología',
            updatedAt: '2024-01-15T10:30:00Z',
          },
        },
      };

      mockApiClient.patch.mockResolvedValue(mockResponse);

      const result: ApiResponse<any> = await apiRequests.patch('/users/1', patchData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse.data);
      expect(mockApiClient.patch).toHaveBeenCalledWith('/users/1', patchData);
    });
  });

  describe('DELETE Requests', () => {
    test('debe manejar respuesta exitosa DELETE', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Usuario eliminado correctamente',
        },
      };

      mockApiClient.delete.mockResolvedValue(mockResponse);

      const result: ApiResponse<any> = await apiRequests.delete('/users/1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse.data);
      expect(mockApiClient.delete).toHaveBeenCalledWith('/users/1');
    });

    test('debe manejar error 404 DELETE - Recurso no encontrado', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Usuario no encontrado' },
        },
        config: { url: '/users/999' },
        message: 'Request failed with status code 404',
      };

      mockApiClient.delete.mockRejectedValue(mockError);

      const result: ApiResponse<any> = await apiRequests.delete('/users/999');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Recurso no encontrado');
      expect(result.statusCode).toBe(404);
    });
  });

  describe('Manejo de Errores Específicos', () => {
    test('debe manejar error 401 - No autorizado', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Token inválido o expirado' },
        },
        config: { url: '/protected' },
        message: 'Request failed with status code 401',
      };

      mockApiClient.get.mockRejectedValue(mockError);

      const result: ApiResponse<any> = await apiRequests.get('/protected');

      expect(result.success).toBe(false);
      expect(result.error).toBe('No autorizado - Token inválido o expirado');
      expect(result.statusCode).toBe(401);
    });

    test('debe manejar error 403 - Acceso denegado', async () => {
      const mockError = {
        response: {
          status: 403,
          data: { message: 'Acceso denegado' },
        },
        config: { url: '/admin' },
        message: 'Request failed with status code 403',
      };

      mockApiClient.get.mockRejectedValue(mockError);

      const result: ApiResponse<any> = await apiRequests.get('/admin');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Acceso denegado');
      expect(result.statusCode).toBe(403);
    });

    test('debe manejar error 500 - Error del servidor', async () => {
      const mockError = {
        response: {
          status: 500,
          data: { message: 'Error interno del servidor' },
        },
        config: { url: '/api/data' },
        message: 'Request failed with status code 500',
      };

      mockApiClient.get.mockRejectedValue(mockError);

      const result: ApiResponse<any> = await apiRequests.get('/api/data');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error del servidor');
      expect(result.statusCode).toBe(500);
    });

    test('debe manejar error con status desconocido', async () => {
      const mockError = {
        response: {
          status: 418,
          data: { message: 'Soy una tetera' },
        },
        config: { url: '/teapot' },
        message: 'Request failed with status code 418',
      };

      mockApiClient.get.mockRejectedValue(mockError);

      const result: ApiResponse<any> = await apiRequests.get('/teapot');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Soy una tetera');
      expect(result.statusCode).toBe(418);
    });

    test('debe manejar error sin mensaje específico', async () => {
      const mockError = {
        response: {
          status: 400,
          data: {},
        },
        config: { url: '/bad-request' },
        message: 'Request failed with status code 400',
      };

      mockApiClient.get.mockRejectedValue(mockError);

      const result: ApiResponse<any> = await apiRequests.get('/bad-request');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error 400');
      expect(result.statusCode).toBe(400);
    });
  });

  describe('Errores de Red y Timeout', () => {
    test('debe manejar timeout', async () => {
      const mockError = {
        code: 'ECONNABORTED',
        message: 'timeout of 10000ms exceeded',
        request: {},
        config: { url: '/slow-endpoint' },
      };

      mockApiClient.get.mockRejectedValue(mockError);

      const result: ApiResponse<any> = await apiRequests.get('/slow-endpoint');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error de conexión - Verifica tu conexión a internet');
      expect(result.statusCode).toBeNull();
    });

    test('debe manejar error de red', async () => {
      const mockError = {
        request: {},
        config: { url: '/offline-endpoint' },
        message: 'Network Error',
      };

      mockApiClient.get.mockRejectedValue(mockError);

      const result: ApiResponse<any> = await apiRequests.get('/offline-endpoint');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error de conexión - Verifica tu conexión a internet');
      expect(result.statusCode).toBeNull();
    });

    test('debe manejar otros tipos de errores', async () => {
      const mockError = {
        message: 'Error desconocido',
        config: { url: '/unknown-error' },
      };

      mockApiClient.get.mockRejectedValue(mockError);

      const result: ApiResponse<any> = await apiRequests.get('/unknown-error');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error desconocido');
      expect(result.statusCode).toBeNull();
    });
  });

  describe('Datos Médicos Específicos', () => {
    test('debe manejar respuesta de pacientes', async () => {
      const mockResponse = {
        data: {
          success: true,
          patients: [
            {
              id: 'patient-1',
              name: 'Ana García',
              age: 45,
              diagnosis: 'Hipertensión',
              lastVisit: '2024-01-10',
            },
            {
              id: 'patient-2',
              name: 'Carlos López',
              age: 32,
              diagnosis: 'Diabetes tipo 2',
              lastVisit: '2024-01-12',
            },
          ],
        },
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const result: ApiResponse<any> = await apiRequests.get('/patients');

      expect(result.success).toBe(true);
      expect(result.data.patients).toHaveLength(2);
      expect(result.data.patients[0]).toHaveProperty('id');
      expect(result.data.patients[0]).toHaveProperty('diagnosis');
    });

    test('debe manejar respuesta de citas médicas', async () => {
      const mockResponse = {
        data: {
          success: true,
          appointments: [
            {
              id: 'appointment-1',
              patientId: 'patient-1',
              doctorId: 'doctor-1',
              date: '2024-01-20T10:00:00Z',
              status: 'scheduled',
              type: 'consulta',
            },
          ],
        },
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const result: ApiResponse<any> = await apiRequests.get('/appointments');

      expect(result.success).toBe(true);
      expect(result.data.appointments).toHaveLength(1);
      expect(result.data.appointments[0]).toHaveProperty('patientId');
      expect(result.data.appointments[0]).toHaveProperty('status');
    });
  });
});
