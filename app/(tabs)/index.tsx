import { useAuth } from '@/hooks/use-auth';
import { apiRequests } from '@/services/API/apiRequests';
import { endpoints } from '@/services/API/endpoints';
import { UserData } from '@/types/auth';
import { HealthTip, getDailyHealthTip } from '@/utils/health-tips';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [currentTip, setCurrentTip] = useState<HealthTip | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const router = useRouter();
  const { requireAuth, logout } = useAuth();

  useEffect(() => {
    if (hasLoaded) return;

    const checkAuthAndLoadData = async () => {
      try {
        const { ExpoStorage } = await import('@/services/ExpoStorage');
        const token = await ExpoStorage.getToken();

        if (!token) {
          await logout();
          return;
        }

        const response = await apiRequests.get<UserData>(endpoints.usersEncryption.getUser());

        if (response.success && response.data) {
          setUserData(response.data.data);
        } else {
          if (
            response.statusCode === 401 ||
            response.error?.includes('401') ||
            response.error?.includes('Unauthorized')
          ) {
            await logout();
            return;
          }
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('401')) {
          await logout();
        }
      } finally {
        setIsLoading(false);
        setHasLoaded(true);
      }
    };

    checkAuthAndLoadData();
    const initialTip = getDailyHealthTip();
    setCurrentTip(initialTip);
  }, [hasLoaded, logout]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, styles.loadingContainer]}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Avatar.Image size={50} source={{ uri: 'https://picsum.photos/200/300' }} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Hola, {userData?.firstName || 'Usuario'}</Text>
            <Text style={styles.subtitle}>
              Gestiona tus citas médicas de forma rápida y sencilla
            </Text>
          </View>
        </View>

        {currentTip && (
          <View style={styles.healthTipCard}>
            <View style={styles.tipHeader}>
              <Text style={styles.healthTipTitle}>
                Consejo de Salud {getCategoryEmoji(currentTip.category)}
              </Text>
              <Text style={styles.healthTipCategory}>
                {capitalizeCategory(currentTip.category)}
              </Text>
            </View>

            <Text style={styles.healthTipText}>{currentTip.message}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function getCategoryEmoji(category: string): string {
  const emojiMap: { [key: string]: string } = {
    hidratacion: '💧',
    sueno: '😴',
    ejercicio: '🏃‍♀️',
    nutricion: '🥗',
    estres: '🧘‍♀️',
    higiene: '🧽',
    prevencion: '🩺',
    postura: '📏',
    vitaminas: '☀️',
    salud_mental: '🧠',
    digital: '📱',
    habitos: '🚭',
    piel: '☂️',
    respiracion: '🌬️',
    social: '👥',
    meditacion: '🕯️',
    emocional: '😊',
    aire_libre: '🌿',
    bebidas: '🍵',
  };
  return emojiMap[category] || '💡';
}

function capitalizeCategory(category: string): string {
  const categoryMap: { [key: string]: string } = {
    hidratacion: 'Hidratación',
    sueno: 'Sueño',
    ejercicio: 'Ejercicio',
    nutricion: 'Nutrición',
    estres: 'Manejo de Estrés',
    higiene: 'Higiene',
    prevencion: 'Prevención',
    postura: 'Postura Corporal',
    vitaminas: 'Vitaminas',
    salud_mental: 'Salud Mental',
    digital: 'Salud Digital',
    habitos: 'Hábitos Saludables',
    piel: 'Cuidado de la Piel',
    respiracion: 'Respiración',
    social: 'Conexión Social',
    meditacion: 'Meditación',
    emocional: 'Bienestar Emocional',
    aire_libre: 'Vida al Aire Libre',
    bebidas: 'Bebidas Saludables',
  };
  return categoryMap[category] || category;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1f2fd',
    padding: 12,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#0D47A1',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0D47A1',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
  },
  healthTipCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  healthTipTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D47A1',
    flex: 1,
  },
  modeButton: {
    backgroundColor: '#0D47A1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  healthTipCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  healthTipText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    lineHeight: 22,
  },
  refreshButton: {
    backgroundColor: '#E8F5E8',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
  },
});
