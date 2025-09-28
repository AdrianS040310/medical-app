import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      {/* Logo con texto */}
      <View style={styles.logoContainer}>
        <Image
          source={require("@/assets/images/medical-logo.webp")}
          style={styles.logo}
        />
        <Text style={styles.logoText}>Medical</Text>
      </View>

      {/* Círculos superpuestos */}
      <View style={styles.overlappingCircles}>
        <View style={[styles.circle, styles.centerCircle]}>
          <Image
            source={require("@/assets/images/doctor.webp")}
            style={styles.circleImage}
          />
        </View>
        <View style={[styles.circle, styles.topLeftCircle]}>
          <Image
            source={require("@/assets/images/hospital.webp")}
            style={styles.circleImage}
          />
        </View>
        <View style={[styles.circle, styles.bottomRightCircle]}>
          <Image
            source={require("@/assets/images/surgery.webp")}
            style={styles.circleImage}
          />
        </View>
      </View>

      {/* Formulario */}
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

        <TouchableOpacity style={styles.signInButton}>
          <Text style={styles.signInButtonText}>Iniciar</Text>
        </TouchableOpacity>

        {/* Separador */}
        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={styles.separatorText}>o</Text>
          <View style={styles.separator} />
        </View>

        {/* Botón de Google */}
        <TouchableOpacity style={styles.googleButton}>
          <Image
            source={require("@/assets/images/google-icon.webp")}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Continua con Google</Text>
        </TouchableOpacity>

        {/* Link a Sign Up */}
        <Text style={styles.footerText}>
          ¿No tienes una cuenta?{" "}
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
    backgroundColor: "#F9FCFF",
    paddingHorizontal: 24,
    paddingTop: 60,
  },

  
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D6CDF",
    marginTop: 6,
  },


  overlappingCircles: {
    width: "100%",
    height: 180,
    position: "relative",
    alignItems: "center",
    marginBottom: 30,
  },
  circle: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  circleImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
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
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#F1F4F9",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 14,
    marginBottom: 14,
    color: "#333",
  },
  signInButton: {
    backgroundColor: "#2D6CDF",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  separatorText: {
    marginHorizontal: 10,
    color: "#666",
    fontSize: 13,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    marginBottom: 20,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: "contain",
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
  },
  link: {
    color: "#2D6CDF",
    fontWeight: "600",
  },
});
