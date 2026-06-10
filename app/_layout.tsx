import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { inicializarDados } from '@/services/storage'
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext'

function RootStack() {
  const { colors, isDark } = useTheme()

  useEffect(() => {
    inicializarDados()
  }, [])

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.fundo} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.texto,
          headerTitleStyle: { fontWeight: '700', fontSize: 17 },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.fundo },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="alerta/[id]"
          options={{ title: 'Detalhes', headerBackTitle: 'Voltar' }}
        />
        <Stack.Screen
          name="confirmacao"
          options={{ title: '', headerBackVisible: false, headerStyle: { backgroundColor: colors.fundo } }}
        />
      </Stack>
    </>
  )
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootStack />
    </ThemeProvider>
  )
}
