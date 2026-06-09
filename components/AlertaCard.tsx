import { Pressable, StyleSheet, Text, View } from 'react-native'
import { COLORS, nivelCor, tipoEmoji } from '@/constants/theme'
import NivelBadge from './NivelBadge'
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
  const cor = nivelCor(alerta.nivel)
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.75 }]}
      onPress={onPress}
    >
      <View style={[styles.barra, { backgroundColor: cor }]} />
      <View style={styles.corpo}>
        <View style={styles.topo}>
          <Text style={styles.tipo}>
            {tipoEmoji(alerta.tipo)} {alerta.tipo.replace('_', ' ')}
          </Text>
          {alerta.resolvido && (
            <View style={styles.resolvidoBadge}>
              <Text style={styles.resolvidoTexto}>✓ RESOLVIDO</Text>
            </View>
          )}
        </View>
        <Text style={styles.descricao} numberOfLines={2}>
          {alerta.descricao}
        </Text>
        <View style={styles.rodape}>
          <NivelBadge nivel={alerta.nivel} />
          <Text style={styles.tempo}>{formatarTempo(alerta.criadoEm)}</Text>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.cardBorda,
  },
  barra: {
    width: 4,
  },
  corpo: {
    flex: 1,
    padding: 14,
    gap: 8,
  },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tipo: {
    color: COLORS.texto,
    fontWeight: '700',
    fontSize: 13,
  },
  descricao: {
    color: COLORS.textoSub,
    fontSize: 13,
    lineHeight: 18,
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tempo: {
    color: COLORS.textoSub,
    fontSize: 11,
  },
  resolvidoBadge: {
    backgroundColor: COLORS.verde + '22',
    borderColor: COLORS.verde,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  resolvidoTexto: {
    color: COLORS.verde,
    fontSize: 10,
    fontWeight: '700',
  },
})
