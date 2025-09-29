// services/newsApi.ts

export async function getHealthNews() {
  try {
    const url = `https://newsapi.org/v2/everything?q=health%20OR%20medicine&language=es&apiKey=${NEWS_API_KEY}`;
    const response = await fetch(url);

    // 👀 Verifica si la API responde con un error HTTP
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
    // 👀 Error de conexión, sin internet o timeout
    return {
      success: false,
      error: "No hay conexión a internet o la API no respondió.",
    };
  }
}
