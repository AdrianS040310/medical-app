import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="login" 
        options={{ 
          headerShown: false,
          title: 'Iniciar Sesión'
        }} 
      />
      <Stack.Screen 
        name="registro" 
        options={{headerShown: false,
           title: 'Registro'
          }} 
      />
    </Stack>
    
  );
}
