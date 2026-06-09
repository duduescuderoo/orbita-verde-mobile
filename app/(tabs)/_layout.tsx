import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/theme'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.fundo },
        headerTintColor: COLORS.texto,
        headerTitleStyle: { fontWeight: '700' },
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.cardBorda,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: COLORS.verde,
        tabBarInactiveTintColor: COLORS.textoSub,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alertas"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="warning-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cadastrar"
        options={{
          title: 'Registrar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
