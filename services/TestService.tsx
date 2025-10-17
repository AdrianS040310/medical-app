import { Alert } from 'react-native';
import { apiRequests } from './api/apiRequests';
import { endpoints } from './api/endpoints';

export const TestService = {
  // ========================================
  // 1. Probar conexión básica (sin cifrado)
  // ========================================
  testConnection: async (): Promise<void> => {
    const result = await apiRequests.get(endpoints.test.health());

    if (result.success) {
      const status = result.data?.status || 'Desconocido';
      const service = result.data?.service || 'Backend';

      Alert.alert('✅ Backend Conectado', `Status: ${status}\nService: ${service}`);
    } else {
      Alert.alert('❌ Error de Conexión', result.error || 'No se pudo conectar al servidor');
    }
  },

  // ========================================
  // 2. Probar mensaje simple (sin cifrado)
  // ========================================
  testSimpleMessage: async (): Promise<void> => {
    const result = await apiRequests.get(endpoints.test.mensaje());

    if (result.success) {
      const mensaje = result.data?.mensaje || 'Sin mensaje';
      const funcionando = result.data?.funcionando ? 'Sí' : 'No';

      Alert.alert('📨 Mensaje Recibido', `${mensaje}\nFuncionando: ${funcionando}`);
    } else {
      Alert.alert('❌ Error', result.error || 'Error al obtener mensaje');
    }
  },

  // ========================================
  // 3. Probar cifrado/descifrado (CON cifrado automático)
  // ========================================
  testEncryption: async (): Promise<void> => {
    const testData = {
      message: 'Probando cifrado desde Expo',
      timestamp: new Date().toISOString(),
      userId: 'test-123',
      metadata: {
        platform: 'React Native',
        test: true,
      },
    };

    // 🔐 El interceptor de axios cifrará automáticamente estos datos
    const result = await apiRequests.post(endpoints.test.testEncryption(), testData);

    if (result.success) {
      Alert.alert('🔐 Cifrado OK', 'Comunicación segura funcionando correctamente');
    } else {
      Alert.alert('❌ Error Cifrado', result.error || 'Fallo en cifrado/descifrado');
    }
  },

  // ========================================
  // 4. Probar ruta no existente (para verificar manejo de errores)
  // ========================================
  testNotFound: async (): Promise<void> => {
    const result = await apiRequests.get('/ruta-inexistente');

    if (result.success) {
      Alert.alert('⚠️ Inesperado', 'La ruta debería haber fallado');
    } else {
      Alert.alert(
        '✅ Manejo de errores OK',
        'El sistema detectó correctamente la ruta inexistente',
      );
    }
  },

  // ========================================
  // 5. Ejecutar todas las pruebas en secuencia
  // ========================================
  runAllTests: async (): Promise<void> => {
    try {
      // Test 1: Conexión
      await TestService.testConnection();
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Test 2: Mensaje simple
      await TestService.testSimpleMessage();
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Test 3: Cifrado
      await TestService.testEncryption();
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Test 4: Ruta no encontrada
      await TestService.testNotFound();

      Alert.alert(
        '🎉 Pruebas Completadas',
        'Todos los tests han sido ejecutados. Revisa la consola para detalles.',
      );
    } catch (error) {
      Alert.alert('❌ Error Crítico', 'Ocurrió un error inesperado durante las pruebas');
    }
  },
};
