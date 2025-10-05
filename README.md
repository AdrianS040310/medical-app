# Medical App

Una aplicación móvil desarrollada con React Native y Expo que proporciona servicios de salud y noticias médicas.

## 🚀 Instrucciones para ejecutar la aplicación

### Prerrequisitos

Antes de ejecutar la aplicación, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

### Configuración del proyecto

1. **Clona el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd medical-app
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configura las variables de entorno:**
   
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   NEWS_API_KEY=tu_api_key_de_newsapi_aquí
   ```

   > **Nota:** Para obtener tu API key de News API, visita [NewsAPI.org](https://newsapi.org/) y regístrate para obtener una clave gratuita.

4. **Ejecuta la aplicación:**

   **Para desarrollo web:**
   ```bash
   npm run web
   # o
   yarn web
   ```

   **Para dispositivos móviles (iOS/Android):**
   ```bash
   npm start
   # o
   yarn start
   ```

   Luego escanea el código QR con la aplicación Expo Go en tu dispositivo móvil.

   **Ejecución directa en dispositivos:**
   ```bash
   # Para Android
   npm run android
   
   # Para iOS
   npm run ios
   ```


## 📦 Dependencias y Librerías utilizadas

### Dependencias principales

| Librería | Versión | Propósito |
|----------|---------|-----------|
| **expo** | ~54.0.10 | Framework principal de Expo |
| **react** | 19.1.0 | Biblioteca principal de React |
| **react-native** | 0.81.4 | Framework para aplicaciones móviles |
| **expo-router** | ~6.0.8 | Sistema de navegación y routing |

### Librerías de UI y componentes

| Librería | Versión | Propósito |
|----------|---------|-----------|
| **react-native-paper** | ^5.14.5 | Componentes Material Design |
| **@expo/vector-icons** | ^15.0.2 | Conjunto de iconos |
| **react-native-gesture-handler** | ~2.28.0 | Manejo de gestos |
| **react-native-safe-area-context** | ~5.6.0 | Manejo de áreas seguras |

### Librerías de navegación

| Librería | Versión | Propósito |
|----------|---------|-----------|
| **@react-navigation/native** | ^7.1.8 | Navegación base |
| **@react-navigation/bottom-tabs** | ^7.4.0 | Navegación por pestañas |
| **@react-navigation/elements** | ^2.6.3 | Elementos de navegación |

### Librerías de desarrollo

| Librería | Versión | Propósito |
|----------|---------|-----------|
| **typescript** | ~5.9.2 | Tipado estático |
| **eslint** | ^9.25.0 | Linting de código |
| **eslint-config-expo** | ~10.0.0 | Configuración ESLint para Expo |

### Librerías de utilidades

| Librería | Versión | Propósito |
|----------|---------|-----------|
| **react-native-dotenv** | ^3.4.11 | Variables de entorno |
| **axios** | ^1.12.2 | Cliente HTTP |
| **crypto-js** | ^4.2.0 | Utilidades criptográficas |
| **expo-crypto** | ~15.0.7 | Funciones criptográficas nativas |

## 🔌 Integración con NEWS API

### Configuración de la API

La aplicación integra la API de News API para obtener noticias médicas y de salud. Aquí está el ejemplo de implementación:

#### 1. Configuración de variables de entorno

**Archivo `.env`:**
```env
NEWS_API_KEY=tu_api_key_aqui
```

**Archivo `env.d.ts`:**
```typescript
declare module "@env" {
  export const NEWS_API_KEY: string;
}
```

#### 2. Configuración de Babel

**Archivo `babel.config.js`:**
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
```

#### 3. Servicio de API

**Archivo `app/services/Api.ts`:**
```typescript
import { NEWS_API_KEY } from "@env";

export async function getHealthNews() {
  try {
    const url = `https://newsapi.org/v2/everything?q=health%20OR%20medicine&language=es&apiKey=${NEWS_API_KEY}`;
    const response = await fetch(url);

    // Verifica si la API responde con un error HTTP
    if (!response.ok) {
      return {
        success: false,
        error: `Error de la API (${response.status}): ${response.statusText}`,
      };
    }

    const data = await response.json();

    if (data.articles && data.articles.length > 0) {
      return {
        success: true,
        articles: data.articles,
      };
    } else {
      return {
        success: false,
        error: "No se encontraron noticias en este momento.",
      };
    }
  } catch (error) {
    // Error de conexión, sin internet o timeout
    return {
      success: false,
      error: "No hay conexión a computadoras o la API no respondió.",
    };
  }
}
```

#### 4. Uso en componentes

Ejemplo de cómo usar el servicio en un componente:

```typescript
import React, { useEffect, useState } from "react";
import { getHealthNews } from "../services/Api";

const HealthNewsScreen = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchHealthNews = async () => {
    setLoading(true);
    setErrorMsg(null);

    const result = await getHealthNews();
    if (result.success) {
      setNews(result.articles.slice(0, 8));
      setErrorMsg(null);
    } else {
      setNews([]);
      setErrorMsg(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHealthNews();
  }, []);

  // Renderizar componente...
};
```
## 🧪 Pruebas

Para ejecutar las pruebas, utiliza:

```bash
npm test
# o
yarn test
```

### Parámetros de la API

- **Endpoint:** `https://newsapi.org/v2/everything`
- **Query:** `q=health%20OR%20medicine` (noticias de salud o medicina)
- **Language:** `language=es` (idioma español)
- **API Key:** Tu clave personal de NewsAPI

### Manejo de errores

La implementación incluye manejo robusto de errores:
- Errores HTTP (401, 429, 500, etc.)
- Errores de conexión de red
- Timeouts y respuestas vacías

## 🏗️ Estructura del proyecto

```
medical-app/
├── app/                          # Rutas y páginas (Expo Router)
│   ├── (auth)/                   # Pantallas de autenticación
│   ├── (tabs)/                   # Navegación por pestañas
│   ├── services/                 # Servicios de API
│   └── _layout.tsx               # Layout principal
├── components/                   # Componentes reutilizables
├── constants/                    # Constantes y configuración
├── hooks/                        # Custom hooks
├── services/                     # Servicios adicionales
├── utils/                        # Utilidades
├── .env                          # Variables de entorno
├── babel.config.js               # Configuración de Babel
├── package.json                  # Dependencias del proyecto
└── README.md                     # Este archivo
```

## 🐛 Resolución de problemas

### Problemas comunes

1. **Error de API Key:**
   - Verifica que tu `.env` tenga la variable `NEWS_API_KEY`
   - Asegúrate de que la API key sea válida de [NewsAPI.org](https://newsapi.org/)

2. **Errores de instalación:**
   ```bash
   # Limpia la caché de npm
   npm cache clean --force
   
   # Elimina node_modules y reinstala
   rm -rf node_modules
   npm install
   ```

3. **Problemas con Expo:**
   ```bash
   # Limpia la caché de Expo
   expo start --clear
   ```

## 📄 Licencia

Este proyecto es privado. Todos los derechos reservados.

## 👥 Contribución

Para contribuir al proyecto, sigue estos pasos:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

---

**Desarrollado con ❤️ usando React Native y Expo**