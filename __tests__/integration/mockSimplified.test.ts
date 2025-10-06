import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { apiRequests, ApiResponse } from '../../services/API/apiRequests';
import { decrypt, encrypt } from '../../utils/crypto';

// Mock de crypto-js
jest.mock('../../utils/crypto', () => ({
  encrypt: jest.fn((data: string) => `encrypted_${data}`),
  decrypt: jest.fn((data: string) => data.replace('encrypted_', '')),
}));

const mockEncrypt = encrypt as jest.Mock;
const mockDecrypt = decrypt as jest.Mock;

const server = setupServer(
  rest.get('http://localhost:3000/api/data', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'Hello from MSW!' }));
  }),
  rest.post('http://localhost:3000/api/encrypted', async (req, res, ctx) => {
    const requestBody = await req.json();
    // Simular que el servidor recibe datos cifrados
    if (
      requestBody.data &&
      typeof requestBody.data === 'string' &&
      requestBody.data.startsWith('encrypted_')
    ) {
      const decryptedData = mockDecrypt(requestBody.data);
      if (decryptedData === '{"secret":"value"}') {
        return res(
          ctx.status(200),
          ctx.json({ data: mockEncrypt('Server processed: {"secret":"value"}') }),
        );
      }
    }
    return res(ctx.status(400), ctx.json({ error: 'Invalid encrypted data' }));
  }),
  rest.get('http://localhost:3000/api/auth-error', (req, res, ctx) => {
    return res(ctx.status(401), ctx.json({ error: 'Unauthorized' }));
  }),
  rest.get('http://localhost:3000/api/network-error', (req, res, ctx) => {
    return res.networkError('Failed to connect');
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('MSW Integration (Simplified)', () => {
  test('debe interceptar una solicitud GET y retornar datos mockeados', async () => {
    const response: ApiResponse<any> = await apiRequests.get('http://localhost:3000/api/data');
    expect(response.success).toBe(true);
    expect(response.data).toEqual({ message: 'Hello from MSW!' });
  });

  test('debe manejar solicitudes POST con datos cifrados', async () => {
    const secretData = { secret: 'value' };
    const response: ApiResponse<any> = await apiRequests.post(
      'http://localhost:3000/api/encrypted',
      secretData,
    );

    // La ruta no requiere cifrado automático, por lo que debería fallar
    expect(response.success).toBe(false);
    expect(response.statusCode).toBe(400);
    expect(response.error).toBe('Error 400');
  });

  test('debe manejar errores de autenticación (401)', async () => {
    const response: ApiResponse<any> = await apiRequests.get(
      'http://localhost:3000/api/auth-error',
    );
    expect(response.success).toBe(false);
    expect(response.error).toBe('No autorizado - Token inválido o expirado');
    expect(response.statusCode).toBe(401);
  });

  test('debe manejar errores de red', async () => {
    const response: ApiResponse<any> = await apiRequests.get(
      'http://localhost:3000/api/network-error',
    );
    expect(response.success).toBe(false);
    expect(response.error).toBe('Error de conexión - Verifica tu conexión a internet');
    expect(response.statusCode).toBeNull();
  });
});
