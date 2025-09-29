import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getHealthNews } from "../services/Api";

const HealthNewsScreen = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchHealthNews = async () => {
    setLoading(true);
    setErrorMsg(null);

    const result = await getHealthNews();
    if (result.success) {
      setNews(result.articles.slice(0, 8)); // mostramos noticias
      setErrorMsg(null);
    } else {
      setNews([]); // vaciamos noticias si hay error
      setErrorMsg(result.error ?? null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHealthNews();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Noticias de Salud</Text>

        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : news.length > 0 ? (
          <FlatList
            data={news}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
                <View style={styles.newsCard}>
                  {item.urlToImage && (
                    <Image
                      source={{ uri: item.urlToImage }}
                      style={styles.newsImage}
                    />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.newsTitle}>{item.title}</Text>
                    <Text style={styles.newsDesc} numberOfLines={2}>
                      {item.description}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text>No se encontraron noticias.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#e1f2fd",
  },
  container: { flex: 1, padding: 20, backgroundColor: "#e1f2fd" },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 10,
  },
  newsCard: {
    flexDirection: "row",
    marginVertical: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
  },
  newsTitle: { fontWeight: "bold", fontSize: 15 },
  newsDesc: { fontSize: 13, color: "gray", marginTop: 3 },
  errorBox: {
    backgroundColor: "#ffe6e6",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default HealthNewsScreen;
