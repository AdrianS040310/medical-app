import 'dotenv/config';

module.exports = {
  expo: {
    name: "medical-app",
    slug: "medical-app",
    version: "1.0.0",
    scheme: 'medicalapp',
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.medicalapp.app"
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
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
          iosUrlScheme: "com.googleusercontent.apps.1058831406641-0p33oqhq3turgrqmij6kjbdc21va0678"
        }
      ],
      [
        "expo-local-authentication",
        {
          faceIDPermission: "Permite a $(PRODUCT_NAME) usar Face ID para autenticación biométrica."
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
      EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME: "com.googleusercontent.apps.1058831406641-0p33oqhq3turgrqmij6kjbdc21va0678",
      router: {},
      eas: {
        projectId: "74029ea5-8beb-462d-95b6-948b6de7d978"
      }
    }
  }
};
