import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { inicializarDados } from '@/services/storage'
import { COLORS } from '@/constants/theme'

export default function RootLayout() {
  useEffect(() => {
    inicializarDados()
  }, [])

  return (
    <>
      <StatusBar style="light" backgroundColor={COLORS.fundo} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.fundo },
          headerTintColor: COLORS.texto,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: COLORS.fundo },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="alerta/[id]"
          options={{ title: 'Detalhes do Alerta' }}
        />
        <Stack.Screen
          name="confirmacao"
          options={{ title: 'Alerta Registrado', headerBackVisible: false }}
        />
      </Stack>
    </>
  )
}
