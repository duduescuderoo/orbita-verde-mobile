import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { nivelCor, tipoEmoji } from '@/constants/theme'
import { useTheme } from '@/contexts/ThemeContext'
import type { Alerta } from '@/types'

interface Props {
  alerta: Alerta
  onPress: () => void
}

const formatarTempo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 60) return `${min} min atrás`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h atrás`
  return `${Math.floor(h / 24)}d atrás`
}

export default function AlertaCard({ alerta, onPress }: Props) {
  const { colors, sombra } = useTheme()
  const cor = nivelCor(alerta.nivel, colors)

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }, sombra as any]}
      onPress={onPress} activeOpacity={0.75}
    >
      <View style={[styles.iconBox, { backgroundColor: cor + '18' }]}>
        <Text style={styles.emoji}>{tipoEmoji(alerta.tipo)}</Text>
      </View>
      <View style={styles.corpo}>
        <View style={styles.topo}>
          <Text style={[styles.tipo, { color: colors.texto }]} numberOfLines={1}>
            {alerta.tipo.replace('_', ' ')}
          </Text>
          <Text style={[styles.tempo, { color: colors.textoSub }]}>{formatarTempo(alerta.criadoEm)}</Text>
        </View>
        <Text style={[styles.descricao, { color: colors.textoSub }]} numberOfLines={2}>{alerta.descricao}</Text>
        <View style={styles.rodape}>
          <View style={[styles.nivelPill, { backgroundColor: cor + '18' }]}>
            <View style={[styles.dot, { backgroundColor: cor }]} />
            <Text style={[styles.nivelTexto, { color: cor }]}>{alerta.nivel}</Text>
          </View>
          {alerta.resolvido && (
            <View style={[styles.resolvidoPill, { backgroundColor: colors.verde + '18' }]}>
              <Ionicons name="checkmark-circle" size={12} color={colors.verde} />
              <Text style={[styles.resolvidoTexto, { color: colors.verde }]}>Resolvido</Text>
            </View>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textoSub} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16, padding: 14,
    flexDirection: 'row', alignItems: 'center',
    gap: 12, marginBottom: 10,
  },
  iconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 22 },
  corpo: { flex: 1, gap: 4 },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tipo: { fontSize: 14, fontWeight: '700', flex: 1 },
  tempo: { fontSize: 11, marginLeft: 8 },
  descricao: { fontSize: 12, lineHeight: 17 },
  rodape: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 2 },
  nivelPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  nivelTexto: { fontSize: 11, fontWeight: '700' },
  resolvidoPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  resolvidoTexto: { fontSize: 11, fontWeight: '600' },
})
