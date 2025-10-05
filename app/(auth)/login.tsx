import { apiRequests } from '@/services/API/apiRequests';
import { endpoints } from '@/services/API/endpoints';
import { ExpoStorage } from '@/services/ExpoStorage';
import { GoogleLoginRequest, LoginResponse } from '@/types/auth';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const configureGoogleSignIn = async () => {
    try {
      GoogleSignin.configure({
        webClientId: '1058831406641-i83rvsg53lbmtabob54821nrj76qenv1.apps.googleusercontent.com', // Web Client ID
        iosClientId: '1058831406641-0p33oqhq3turgrqmij6kjbdc21va0678.apps.googleusercontent.com',
        offlineAccess: true,
        forceCodeForRefreshToken: true,
      });

      // Verificar si ya hay usuario logueado
      const isSignedIn = await GoogleSignin.hasPreviousSignIn();

      if (isSignedIn) {
        await GoogleSignin.getCurrentUser();
      }
    } catch {
      // Error en configuración
    }
  };

  const handleOAuth2Login = async () => {
    setLoading(true);
    try {
      // Verificar Play Services (solo Android)
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      }

      // Intentar sign out primero (limpia cache)
      try {
        await GoogleSignin.signOut();
      } catch {
        // No había sesión previa
      }

      const userInfo = await GoogleSignin.signIn();

      if (isSuccessResponse(userInfo)) {
        const { user, idToken } = userInfo.data;

        if (!idToken) {
          Alert.alert('Error', 'No se pudo obtener el token de Google');
          return;
        }

        const loginData: GoogleLoginRequest = {
          idToken: idToken,
        };

        const responseApi = await apiRequests.post<LoginResponse>(
          endpoints.usersEncryption.login(),
          loginData,
        );

        if (responseApi.success && responseApi.data?.data) {
          const { token: tokenJWT } = responseApi.data.data;

          if (tokenJWT) {
            await ExpoStorage.saveToken(tokenJWT);
            router.replace('/(tabs)');
          }
        } else {
          const errorMessage = responseApi.error || 'Error al procesar la respuesta del servidor';
          Alert.alert('Error', errorMessage);
        }
      }

      // Aquí enviarías el token a tu backend
      // await sendTokenToBackend(userInfo.idToken);
    } catch (error) {
      let errorMessage = 'Error al iniciar sesión';

      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            errorMessage = 'Inicio de sesión cancelado';
            break;
          case statusCodes.IN_PROGRESS:
            errorMessage = 'Inicio de sesión en progreso';
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            errorMessage = 'Google Play Services no disponible o desactualizado';
            break;
          case 'DEVELOPER_ERROR':
            errorMessage =
              'Error de configuración. Verifica:\n- SHA-1 en GCP\n- google-services.json\n- Client IDs correctos';
            break;
          default:
            errorMessage = `Error: ${'Desconocido'}`;
        }
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/images/medical-logo.webp')} style={styles.logo} />
        <Text style={styles.logoText}>Medical</Text>
      </View>

      <View style={styles.overlappingCircles}>
        <View style={[styles.circle, styles.centerCircle]}>
          <Image source={require('@/assets/images/doctor.webp')} style={styles.circleImage} />
        </View>
        <View style={[styles.circle, styles.topLeftCircle]}>
          <Image source={require('@/assets/images/hospital.webp')} style={styles.circleImage} />
        </View>
        <View style={[styles.circle, styles.bottomRightCircle]}>
          <Image source={require('@/assets/images/surgery.webp')} style={styles.circleImage} />
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.title}>Bienvenido de Nuevo 👋</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.signInButton} onPress={() => router.push('/(tabs)')}>
          <Text style={styles.signInButtonText}>Iniciar</Text>
        </TouchableOpacity>

        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={styles.separatorText}>o</Text>
          <View style={styles.separator} />
        </View>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleOAuth2Login}
          disabled={loading}
        >
          <Image source={require('@/assets/images/google-icon.webp')} style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>
            {loading ? 'Iniciando sesión...' : 'Continua con Google'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          ¿No tienes una cuenta?{' '}
          <Link href="/registro" style={styles.link}>
            Registrarse
          </Link>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FCFF',
    paddingHorizontal: 24,
    paddingTop: 60,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D6CDF',
    marginTop: 6,
  },

  overlappingCircles: {
    width: '100%',
    height: 180,
    position: 'relative',
    alignItems: 'center',
    marginBottom: 30,
  },
  circle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  circleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  centerCircle: {
    top: 40,
    zIndex: 2,
  },
  topLeftCircle: {
    left: 40,
    top: 0,
    zIndex: 1,
  },
  bottomRightCircle: {
    right: 40,
    top: 100,
    zIndex: 1,
  },

  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F1F4F9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 14,
    marginBottom: 14,
    color: '#333',
  },
  signInButton: {
    backgroundColor: '#2D6CDF',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 13,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    marginBottom: 20,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  link: {
    color: '#2D6CDF',
    fontWeight: '600',
  },
});
