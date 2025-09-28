import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Avatar.Image
            size={50}
            source={{ uri: "https://picsum.photos/200/300" }}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Hola, Usuario</Text>
            <Text style={styles.subtitle}>
              Gestiona tus citas médicas de forma rápida y sencilla
            </Text>
          </View>
        </View>

        <View style={styles.healthTipCard}>
          <Text style={styles.healthTipTitle}>Consejo de Salud 🥗</Text>
          <Text style={styles.healthTipCategory}>Alimentación</Text>
          <Text style={styles.healthTipText}>
            Incluye frutas y verduras frescas en cada comida del día.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e1f2fd",
    padding: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "column",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#0D47A1",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
  },
  healthTipCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  healthTipTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0D47A1",
    marginBottom: 6,
  },
  healthTipCategory: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 4,
  },
  healthTipText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  healthTipFooter: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#777",
  },
});
