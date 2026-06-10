import { StyleSheet, Text, View } from 'react-native'
import { nivelCor } from '@/constants/theme'
import { useTheme } from '@/contexts/ThemeContext'

interface Props { nivel: string }

export default function NivelBadge({ nivel }: Props) {
  const { colors } = useTheme()
  const cor = nivelCor(nivel, colors)
  return (
    <View style={[styles.badge, { backgroundColor: cor + '18' }]}>
      <View style={[styles.dot, { backgroundColor: cor }]} />
      <Text style={[styles.texto, { color: cor }]}>{nivel}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, alignSelf: 'flex-start',
  },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
  texto: { fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
})
