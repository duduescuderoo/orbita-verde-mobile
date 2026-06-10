import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/contexts/ThemeContext'
import { nivelCor, tipoEmoji } from '@/constants/theme'

export default function ConfirmacaoScreen() {
  const router = useRouter()
  const { colors, sombra } = useTheme()
  const { id, tipo, nivel } = useLocalSearchParams<{ id: string; tipo: string; nivel: string }>()
  const cor = nivelCor(nivel ?? 'NORMAL', colors)

  return (
    <View style={[styles.container, { backgroundColor: colors.fundo }]}>
      <View style={styles.topo}>
        <View style={[styles.checkCircle, { backgroundColor: colors.verde + '18' }]}>
          <Ionicons name="checkmark" size={40} color={colors.verde} />
        </View>
        <Text style={[styles.titulo, { color: colors.texto }]}>Alerta registrado!</Text>
        <Text style={[styles.subtitulo, { color: colors.textoSub }]}>A ocorrência foi salva com sucesso no sistema de monitoramento.</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderLeftColor: cor }, sombra as any]}>
        <View style={styles.linha}>
          <Text style={[styles.linhaTipo, { color: colors.texto }]}>{tipoEmoji(tipo ?? '')} {(tipo ?? '').replace('_', ' ')}</Text>
          <View style={[styles.nivelPill, { backgroundColor: cor + '18' }]}>
            <View style={[styles.nivelDot, { backgroundColor: cor }]} />
            <Text style={[styles.nivelTexto, { color: cor }]}>{nivel}</Text>
          </View>
        </View>
        <View style={[styles.div, { backgroundColor: colors.separador }]} />
        <View style={styles.linha}>
          <Text style={[styles.cardLabel, { color: colors.textoSub }]}>ID do alerta</Text>
          <Text style={[styles.cardId, { color: colors.verdeEscuro }]}>#{id}</Text>
        </View>
        <View style={[styles.div, { backgroundColor: colors.separador }]} />
        <View style={styles.linha}>
          <Text style={[styles.cardLabel, { color: colors.textoSub }]}>Status</Text>
          <View style={styles.statusAtivo}>
            <View style={[styles.statusDot, { backgroundColor: colors.verde }]} />
            <Text style={[styles.statusTexto, { color: colors.verde }]}>ATIVO</Text>
          </View>
        </View>
      </View>

      <View style={[styles.aviso, { backgroundColor: colors.card }, sombra as any]}>
        <Ionicons name="information-circle-outline" size={18} color={colors.textoSub} />
        <Text style={[styles.avisoTexto, { color: colors.textoSub }]}>
          Equipes de monitoramento foram notificadas. Acompanhe na aba Alertas.
        </Text>
      </View>

      <View style={styles.botoes}>
        <TouchableOpacity style={[styles.btnPrimario, { backgroundColor: colors.verdeEscuro }]} onPress={() => router.replace('/alertas')} activeOpacity={0.85}>
          <Ionicons name="list" size={18} color="#fff" />
          <Text style={styles.btnPrimarioTexto}>Ver alertas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecundario} onPress={() => router.replace('/')} activeOpacity={0.85}>
          <Text style={[styles.btnSecundarioTexto, { color: colors.textoSub }]}>Ir ao início</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 28, justifyContent: 'center' },
  topo: { alignItems: 'center', marginBottom: 32 },
  checkCircle: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  titulo: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 8 },
  subtitulo: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  card: { borderRadius: 16, padding: 18, marginBottom: 16, borderLeftWidth: 4 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  linhaTipo: { fontSize: 16, fontWeight: '700' },
  nivelPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  nivelDot: { width: 7, height: 7, borderRadius: 3.5 },
  nivelTexto: { fontSize: 12, fontWeight: '700' },
  div: { height: 1 },
  cardLabel: { fontSize: 13 },
  cardId: { fontSize: 14, fontWeight: '700', fontFamily: 'monospace' },
  statusAtivo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusTexto: { fontSize: 13, fontWeight: '700' },
  aviso: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', borderRadius: 14, padding: 14, marginBottom: 28 },
  avisoTexto: { flex: 1, fontSize: 13, lineHeight: 18 },
  botoes: { gap: 10 },
  btnPrimario: { borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnPrimarioTexto: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnSecundario: { padding: 14, alignItems: 'center' },
  btnSecundarioTexto: { fontSize: 15, fontWeight: '600' },
})
