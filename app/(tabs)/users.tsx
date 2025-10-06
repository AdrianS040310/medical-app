import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserCard, UserForm } from '../../components/users';
import { useUsers } from '../../hooks/use-users';
import { CreateUserRequest, UpdateUserRequest, User, UserRole } from '../../types/users';

export default function UsersScreen() {
  const {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    clearError,
    refreshUsers,
  } = useUsers();

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | undefined>();

  const handleCreateUser = async (data: CreateUserRequest) => {
    setFormLoading(true);
    try {
      const success = await createUser(data);
      if (success) {
        setShowForm(false);
        return true;
      }
      return false;
    } catch (error) {
      Alert.alert('Error', 'Error al crear el usuario');
      return false;
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateUser = async (data: UpdateUserRequest) => {
    if (!editingUser) return false;

    setFormLoading(true);
    try {
      const success = await updateUser(editingUser.id, data);
      if (success) {
        setShowForm(false);
        setEditingUser(null);
        return true;
      }
      return false;
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = async (id: string) => {
    const success = await deleteUser(id);
    if (!success) {
      Alert.alert('Error', 'No se pudo eliminar el usuario');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handleFormSubmit = async (data: CreateUserRequest | UpdateUserRequest) => {
    if (editingUser) {
      return await handleUpdateUser(data as UpdateUserRequest);
    } else {
      return await handleCreateUser(data as CreateUserRequest);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await searchUsers(query, selectedRole);
    } else {
      await refreshUsers();
    }
  };

  const handleRoleFilter = async (role: UserRole | undefined) => {
    setSelectedRole(role);
    if (searchQuery.trim()) {
      await searchUsers(searchQuery, role);
    } else {
      // Aplicar filtro de rol directamente
      await fetchUsers({ role, page: 1, limit: 10 });
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <UserCard user={item} onEdit={handleEditUser} onDelete={handleDeleteUser} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>
        {searchQuery ? 'No se encontraron usuarios' : 'No hay usuarios'}
      </Text>
      <Text style={styles.emptyStateText}>
        {searchQuery
          ? 'Intenta con otro término de búsqueda o cambia el filtro de rol.'
          : 'No tienes usuarios registrados. Toca el botón "+" para agregar un nuevo usuario.'}
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <Text style={styles.errorSubtext}>
        Verifica que el backend esté funcionando en http://localhost:3001
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={refreshUsers}>
        <Text style={styles.retryButtonText}>Reintentar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.clearErrorButton} onPress={clearError}>
        <Text style={styles.clearErrorButtonText}>Cerrar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Usuarios</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar usuarios por nombre o email..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filtrar por rol:</Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[styles.filterButton, !selectedRole && styles.filterButtonActive]}
              onPress={() => handleRoleFilter(undefined)}
            >
              <Text
                style={[styles.filterButtonText, !selectedRole && styles.filterButtonTextActive]}
              >
                Todos
              </Text>
            </TouchableOpacity>
            {Object.values(UserRole).map(role => (
              <TouchableOpacity
                key={role}
                style={[styles.filterButton, selectedRole === role && styles.filterButtonActive]}
                onPress={() => handleRoleFilter(role)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedRole === role && styles.filterButtonTextActive,
                  ]}
                >
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {error && renderError()}

        {loading && users.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Cargando usuarios...</Text>
          </View>
        ) : (
          <FlatList
            data={users}
            renderItem={renderUser}
            keyExtractor={item => item.id}
            contentContainerStyle={
              users.length === 0 ? styles.emptyContainer : styles.listContainer
            }
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={refreshUsers} colors={['#007AFF']} />
            }
            showsVerticalScrollIndicator={false}
          />
        )}

        {pagination && users.length > 0 && (
          <View style={styles.paginationInfo}>
            <Text style={styles.paginationText}>
              Mostrando {users.length} de {pagination.total} usuarios
            </Text>
          </View>
        )}

        <UserForm
          visible={showForm}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          user={editingUser || undefined}
          mode={editingUser ? 'edit' : 'create'}
          loading={formLoading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  searchInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1C1C1E',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#F2F2F7',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
  listContainer: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  retryButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  clearErrorButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  clearErrorButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
  },
  paginationInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  paginationText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
