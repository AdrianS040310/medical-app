import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CreateUserRequest, UpdateUserRequest, User, UserRole, getUserRoleLabel } from '../../types/users';

interface UserFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<boolean>;
  user?: User;
  mode: 'create' | 'edit';
  loading?: boolean;
}

/**
 * Componente de formulario para crear o editar usuarios
 * Maneja validación y envío de datos
 */
export const UserForm: React.FC<UserFormProps> = ({
  visible,
  onClose,
  onSubmit,
  user,
  mode,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: UserRole.PATIENT,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Inicializar formulario cuando se abre el modal
  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && user) {
        setFormData({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        });
      } else {
        setFormData({
          email: '',
          firstName: '',
          lastName: '',
          role: UserRole.PATIENT,
        });
      }
      setErrors({});
    }
  }, [visible, mode, user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email es requerido';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Formato de email inválido';
      }
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Nombre es requerido';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Apellido es requerido';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('🚀 UserForm: Iniciando envío del formulario');
    if (!validateForm()) {
      console.log('❌ UserForm: Validación fallida');
      return;
    }

    try {
      const submitData = {
        ...formData,
        email: formData.email.trim().toLowerCase(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      };
      
      console.log('🚀 UserForm: Datos a enviar:', submitData);
      const success = await onSubmit(submitData);
      console.log('🚀 UserForm: Resultado del envío:', success);
      
      if (success) {
        Alert.alert(
          'Éxito',
          mode === 'create' ? 'Usuario creado exitosamente' : 'Usuario actualizado exitosamente',
          [{ text: 'OK', onPress: onClose }]
        );
      }
    } catch (error) {
      console.log('❌ UserForm: Error al procesar:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Error al procesar la solicitud'
      );
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData(prev => ({ ...prev, role }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {mode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}
          </Text>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="usuario@ejemplo.com"
              placeholderTextColor="#8E8E93"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={[styles.input, errors.firstName && styles.inputError]}
              value={formData.firstName}
              onChangeText={(value) => handleInputChange('firstName', value)}
              placeholder="Nombre del usuario"
              placeholderTextColor="#8E8E93"
              autoCapitalize="words"
            />
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Apellido *</Text>
            <TextInput
              style={[styles.input, errors.lastName && styles.inputError]}
              value={formData.lastName}
              onChangeText={(value) => handleInputChange('lastName', value)}
              placeholder="Apellido del usuario"
              placeholderTextColor="#8E8E93"
              autoCapitalize="words"
            />
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Rol</Text>
            <View style={styles.roleContainer}>
              {Object.values(UserRole).map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleButton,
                    formData.role === role && styles.roleButtonSelected,
                  ]}
                  onPress={() => handleRoleChange(role)}
                >
                  <Text
                    style={[
                      styles.roleButtonText,
                      formData.role === role && styles.roleButtonTextSelected,
                    ]}
                  >
                    {getUserRoleLabel(role)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {mode === 'edit' && user && (
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Información del Usuario</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>ID:</Text>
                <Text style={styles.infoValue}>{user.id}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Creado:</Text>
                <Text style={styles.infoValue}>
                  {new Date(user.createdAt).toLocaleString('es-ES')}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Actualizado:</Text>
                <Text style={styles.infoValue}>
                  {new Date(user.updatedAt).toLocaleString('es-ES')}
                </Text>
              </View>
              {user.patient && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Perfil:</Text>
                  <Text style={styles.infoValue}>Paciente</Text>
                </View>
              )}
              {user.doctor && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Perfil:</Text>
                  <Text style={styles.infoValue}>Doctor - {user.doctor.specialty}</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

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
  cancelButton: {
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#8E8E93',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  roleButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  roleButtonText: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  roleButtonTextSelected: {
    color: '#FFFFFF',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#1C1C1E',
    flex: 1,
  },
});
