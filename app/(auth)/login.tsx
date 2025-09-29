import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  View,
} from "react-native";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const configureGoogleSignIn = async () => {
    try {
      GoogleSignin.configure({
        webClientId:
          "1058831406641-i83rvsg53lbmtabob54821nrj76qenv1.apps.googleusercontent.com", // Web Client ID
        iosClientId:
          "1058831406641-0p33oqhq3turgrqmij6kjbdc21va0678.apps.googleusercontent.com",
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
      if (Platform.OS === "android") {
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
        const { user } = userInfo.data;
        Alert.alert("¡Bienvenido! 🎉", `${user.name}\n${user.email}`);
      }

      // Aquí enviarías el token a tu backend
      // await sendTokenToBackend(userInfo.idToken);
    } catch (error) {
      let errorMessage = "Error al iniciar sesión";

      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            errorMessage = "Inicio de sesión cancelado";
            break;
          case statusCodes.IN_PROGRESS:
            errorMessage = "Inicio de sesión en progreso";
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            errorMessage =
              "Google Play Services no disponible o desactualizado";
            break;
          case "DEVELOPER_ERROR":
            errorMessage =
              "Error de configuración. Verifica:\n- SHA-1 en GCP\n- google-services.json\n- Client IDs correctos";
            break;
          default:
            errorMessage = `Error: ${"Desconocido"}`;
        }
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          App Medica
        </ThemedText>

        <ThemedText type="subtitle" style={styles.subtitle}>
          Inicia sesión para continuar
        </ThemedText>

        <View style={styles.buttonContainer}>
          <ThemedView
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onTouchEnd={loading ? undefined : handleOAuth2Login}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <ThemedText style={styles.buttonText}>
                Iniciar Sesión con Google
              </ThemedText>
            )}
          </ThemedView>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: "center",
    opacity: 0.7,
  },
  buttonContainer: {
    width: "100%",
  },
  loginButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
