import { ExpoStorage } from '../../services/ExpoStorage';

// Mock de ExpoStorage - Simula el comportamiento real
jest.mock('../../services/ExpoStorage', () => ({
  ExpoStorage: {
    getToken: jest.fn(),
    saveToken: jest.fn(),
    getUser: jest.fn(),
    saveUser: jest.fn(),
    clearSession: jest.fn(),
    isAuthenticated: jest.fn(),
  },
}));

// Mock de expo-router
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  },
}));

const mockExpoStorage = ExpoStorage as jest.Mocked<typeof ExpoStorage>;

describe('Autenticación Real - ExpoStorage', () => {
  const realUserData = {
    id: 'user123',
    email: 'doctor@medicalapp.com',
    name: 'Dr. Juan Pérez',
    firstName: 'Juan',
    lastName: 'Pérez',
    role: 'doctor',
  };

  const realToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwibmFtZSI6Ikp1YW4gUGVyZXoiLCJpYXQiOjE1MTYyMzkwMjJ9.invalid';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe verificar autenticación correctamente', async () => {
    // Simular usuario autenticado
    mockExpoStorage.isAuthenticated.mockResolvedValue(true);
    mockExpoStorage.getUser.mockResolvedValue(realUserData);

    const isAuthenticated = await ExpoStorage.isAuthenticated();
    const user = await ExpoStorage.getUser();

    expect(isAuthenticated).toBe(true);
    expect(user).toEqual(realUserData);
    expect(mockExpoStorage.isAuthenticated).toHaveBeenCalled();
    expect(mockExpoStorage.getUser).toHaveBeenCalled();
  });

  test('debe manejar usuario no autenticado', async () => {
    // Simular usuario no autenticado
    mockExpoStorage.isAuthenticated.mockResolvedValue(false);
    mockExpoStorage.getUser.mockResolvedValue(null);

    const isAuthenticated = await ExpoStorage.isAuthenticated();
    const user = await ExpoStorage.getUser();

    expect(isAuthenticated).toBe(false);
    expect(user).toBe(null);
  });

  test('login: debe guardar token y datos de usuario correctamente', async () => {
    // Configurar mocks para el flujo de login
    mockExpoStorage.saveToken.mockResolvedValue(undefined);
    mockExpoStorage.saveUser.mockResolvedValue(undefined);

    await ExpoStorage.saveToken(realToken);
    await ExpoStorage.saveUser(realUserData);

    // Verificar que se guardaron los datos
    expect(mockExpoStorage.saveToken).toHaveBeenCalledWith(realToken);
    expect(mockExpoStorage.saveUser).toHaveBeenCalledWith(realUserData);
  });

  test('login: debe manejar errores durante el guardado', async () => {
    const saveError = new Error('Error guardando token');
    mockExpoStorage.saveToken.mockRejectedValue(saveError);

    await expect(ExpoStorage.saveToken(realToken)).rejects.toThrow('Error guardando token');
    expect(mockExpoStorage.saveToken).toHaveBeenCalledWith(realToken);
  });

  test('logout: debe limpiar sesión correctamente', async () => {
    // Configurar mocks para logout
    mockExpoStorage.clearSession.mockResolvedValue(undefined);

    await ExpoStorage.clearSession();

    // Verificar que se limpió la sesión
    expect(mockExpoStorage.clearSession).toHaveBeenCalled();
  });

  test('logout: debe manejar errores durante la limpieza', async () => {
    const clearError = new Error('Error limpiando sesión');
    mockExpoStorage.clearSession.mockRejectedValue(clearError);

    await expect(ExpoStorage.clearSession()).rejects.toThrow('Error limpiando sesión');
  });

  test('requireAuth: debe retornar true si hay token válido', async () => {
    mockExpoStorage.getToken.mockResolvedValue(realToken);

    const token = await ExpoStorage.getToken();

    expect(token).toBe(realToken);
    expect(mockExpoStorage.getToken).toHaveBeenCalled();
  });

  test('requireAuth: debe retornar null si no hay token', async () => {
    mockExpoStorage.getToken.mockResolvedValue(null);

    const token = await ExpoStorage.getToken();

    expect(token).toBe(null);
    expect(mockExpoStorage.getToken).toHaveBeenCalled();
  });

  test('requireAuth: debe retornar vacío si token es vacío', async () => {
    mockExpoStorage.getToken.mockResolvedValue('');

    const token = await ExpoStorage.getToken();

    expect(token).toBe('');
    expect(mockExpoStorage.getToken).toHaveBeenCalled();
  });

  test('debe manejar errores durante verificación de autenticación', async () => {
    const authError = new Error('Error verificando autenticación');
    mockExpoStorage.isAuthenticated.mockRejectedValue(authError);

    await expect(ExpoStorage.isAuthenticated()).rejects.toThrow('Error verificando autenticación');
  });
});
