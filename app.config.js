import 'dotenv/config';

module.exports = {
  expo: {
    name: "medical-app",
    slug: "medical-app",
    version: "1.0.0",
    scheme: 'medicalapp',
    orientation: "portrait",
    icon: "./assets/images/medical-logo.webp",
    userInterfaceStyle: "automatic",
    newArchEnabled: false,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/medical-logo.webp",
        backgroundImage: "./assets/images/medical-logo.webp",
        monochromeImage: "./assets/images/medical-logo.webp"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.medicalapp.app"
    },
    web: {
      output: "static",
      favicon: "./assets/images/medical-logo.webp"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/medical-logo.webp",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000"
          }
        }
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
      EXPO_PUBLIC_NEWS_API_KEY: process.env.EXPO_PUBLIC_NEWS_API_KEY,
      EXPO_PUBLIC_CRYPTO_SECRET: process.env.EXPO_PUBLIC_CRYPTO_SECRET,
      EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME: process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME,
      router: {},
      eas: {
        projectId: process.env.EAS_PROJECT_ID
      }
    }
  }
};
