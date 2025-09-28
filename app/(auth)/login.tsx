import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { router } from "expo-router";
import React from "react";
import { Alert, StyleSheet, View } from "react-native";

export default function LoginScreen() {
  const handleOAuth2Login = async () => {
    try {
      console.log("Iniciando proceso OAuth2...");

      setTimeout(() => {
        router.replace("/(tabs)");
      }, 1000);
    } catch (error) {
      Alert.alert("Error", "Error al iniciar sesión");
      console.error("Error en OAuth2:", error);
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
          <ThemedView style={styles.loginButton} onTouchEnd={handleOAuth2Login}>
            <ThemedText style={styles.buttonText}>
              Iniciar Sesión con OAuth2
            </ThemedText>
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
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
