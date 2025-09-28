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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
  },
  titleContainer: {
    flexDirection: "column",
    gap: 0,
    flex: 1,
    marginBottom: 12,
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
  mainCard: {
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: "#E3F2FD",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0D47A1",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#444",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0D47A1",
    marginBottom: 12,
  },
  appointmentCard: {
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0D47A1",
  },
  specialty: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: "#666",
  },
});
