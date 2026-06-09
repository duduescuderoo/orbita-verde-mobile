import { StyleSheet, Text, View } from 'react-native'
import { nivelCor, nivelEmoji } from '@/constants/theme'

interface Props {
  nivel: string
}

export default function NivelBadge({ nivel }: Props) {
  const cor = nivelCor(nivel)
  return (
    <View style={[styles.badge, { backgroundColor: cor + '22', borderColor: cor }]}>
      <Text style={[styles.texto, { color: cor }]}>
        {nivelEmoji(nivel)} {nivel}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  texto: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
})
