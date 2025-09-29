// app.config.js
module.exports = {
  expo: {
    name: "medical-app",
    slug: "medical-app",
    version: "1.0.0",
    scheme: 'medicalapp',
    // ... resto de tu configuración
    extra: {
      EXPO_PUBLIC_CRYPTO_SECRET: process.env.EXPO_PUBLIC_CRYPTO_SECRET,
    },
  },
};